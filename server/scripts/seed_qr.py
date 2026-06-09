"""Seed fact_qr_scan from qrcode_snk.json — streamed in batches to avoid memory issues."""
import json
import sys
from pathlib import Path
from datetime import datetime, timezone

import psycopg2
from psycopg2.extras import execute_values

DATA_DIR = Path(__file__).parent.parent.parent / "data"
sys.path.insert(0, str(Path(__file__).parent.parent))
from app.core.config import settings

BATCH_SIZE = 500


def connect():
    return psycopg2.connect(
        host=settings.PG_HOST, port=settings.PG_PORT,
        dbname=settings.PG_NAME, user=settings.PG_USER, password=settings.PG_PASS,
    )


def build_lookup_maps(cur):
    cur.execute("SELECT id, code FROM dim_factory")
    factory_map = {row[1]: row[0] for row in cur.fetchall()}

    cur.execute("SELECT id, employee_id FROM dim_caster")
    caster_map = {row[1]: row[0] for row in cur.fetchall()}

    cur.execute("SELECT id, employee_id FROM dim_gi_inspector")
    gi_map = {row[1]: row[0] for row in cur.fetchall()}

    cur.execute("SELECT id, material_code FROM dim_model")
    model_map = {row[1]: row[0] for row in cur.fetchall()}

    cur.execute("SELECT id, code FROM dim_defect_type")
    defect_map = {row[1]: row[0] for row in cur.fetchall()}

    return factory_map, caster_map, gi_map, model_map, defect_map


def parse_dt(s):
    if not s:
        return None
    try:
        return datetime.fromisoformat(s).replace(tzinfo=timezone.utc)
    except ValueError:
        return None


def process_factory(cur, factory_code, records, factory_map, caster_map, gi_map, model_map, defect_map):
    factory_id = factory_map.get(factory_code)
    total = len(records)
    inserted = 0
    fk_miss = {"caster": 0, "gi": 0, "model": 0, "defect": 0, "datetime": 0}

    batch = []
    for r in records:
        scanned_at = parse_dt(r.get("Create Update"))
        if not scanned_at:
            fk_miss["datetime"] += 1
            continue

        caster_emp = r.get("Caster Name", "")
        gi_emp     = r.get("GI Name", "")
        material   = r.get("Material", "").strip()
        defect_code= r.get("Defect", "").strip() or None

        caster_id = caster_map.get(caster_emp)
        gi_id     = gi_map.get(gi_emp)
        model_id  = model_map.get(material)
        defect_id = defect_map.get(defect_code) if defect_code else None

        if not caster_id and caster_emp: fk_miss["caster"] += 1
        if not gi_id     and gi_emp:     fk_miss["gi"]     += 1
        if not model_id  and material:   fk_miss["model"]  += 1
        if not defect_id and defect_code:fk_miss["defect"] += 1

        batch.append((
            scanned_at,
            r.get("QR Code"),
            r.get("Export Name") or None,
            factory_id,
            caster_id,
            gi_id,
            model_id,
            defect_id,
            r.get("Type") or None,
            r.get("Result Work") or None,
            r.get("Result") or None,
            r.get("Klin Key") or None,
            r.get("ZGI") or None,
        ))

        if len(batch) >= BATCH_SIZE:
            execute_values(cur, """
                INSERT INTO fact_qr_scan
                    (scanned_at, qr_code, export_name, factory_id, caster_id,
                     gi_id, model_id, defect_id, type, result_work, result, klin_key, zgi)
                VALUES %s
            """, batch)
            inserted += len(batch)
            batch = []

    if batch:
        execute_values(cur, """
            INSERT INTO fact_qr_scan
                (scanned_at, qr_code, export_name, factory_id, caster_id,
                 gi_id, model_id, defect_id, type, result_work, result, klin_key, zgi)
            VALUES %s
        """, batch)
        inserted += len(batch)

    return total, inserted, fk_miss


def main():
    print("==> Seeding fact_qr_scan (loading qrcode_snk.json)...")
    with open(DATA_DIR / "qrcode_snk.json") as f:
        data = json.load(f)
    print(f"    File loaded. Processing in batches of {BATCH_SIZE}...")

    conn = connect()
    try:
        with conn.cursor() as cur:
            factory_map, caster_map, gi_map, model_map, defect_map = build_lookup_maps(cur)

            grand_total = grand_inserted = 0
            grand_fk = {"caster": 0, "gi": 0, "model": 0, "defect": 0, "datetime": 0}

            for factory_code, factory_data in data.items():
                records = factory_data["records"]
                total, inserted, fk_miss = process_factory(
                    cur, factory_code, records,
                    factory_map, caster_map, gi_map, model_map, defect_map
                )
                conn.commit()
                grand_total    += total
                grand_inserted += inserted
                for k in grand_fk:
                    grand_fk[k] += fk_miss[k]
                print(f"    {factory_code}: {inserted}/{total} inserted")

        print(f"\n  fact_qr_scan total: {grand_inserted}/{grand_total} inserted")
        if any(v for v in grand_fk.values()):
            print(f"  FK misses: {grand_fk}")
        print("==> QR scan data done.\n")

    except Exception as e:
        conn.rollback()
        print(f"ERROR: {e}")
        sys.exit(1)
    finally:
        conn.close()


if __name__ == "__main__":
    main()
