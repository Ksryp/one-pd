"""Seed dimension tables: dim_caster, dim_gi_inspector, dim_model from JSON source files."""
import json
import sys
from pathlib import Path

import psycopg2
from psycopg2.extras import execute_values

DATA_DIR = Path(__file__).parent.parent.parent  # one-pd/
sys.path.insert(0, str(Path(__file__).parent.parent))
from app.core.config import settings


def connect():
    return psycopg2.connect(
        host=settings.PG_HOST, port=settings.PG_PORT,
        dbname=settings.PG_NAME, user=settings.PG_USER, password=settings.PG_PASS,
    )


def seed_casters(cur):
    with open(DATA_DIR / "casters.json") as f:
        data = json.load(f)

    rows = []
    skipped = []
    for c in data:
        if not c.get("employee_id") or c.get("caster_id") in (None, "", "1 / 1"):
            skipped.append(c.get("id"))
            continue
        rows.append((c["employee_id"], c["caster_id"], c.get("name") or None, c.get("factories") or []))

    execute_values(cur,
        "INSERT INTO dim_caster (employee_id, caster_id, name, factories) VALUES %s ON CONFLICT (employee_id) DO NOTHING",
        rows
    )
    print(f"  dim_caster:       {len(rows)} inserted, {len(skipped)} skipped (malformed: ids {skipped})")
    return len(rows)


def seed_gi_inspectors(cur):
    with open(DATA_DIR / "gi_inspectors.json") as f:
        data = json.load(f)

    rows = []
    skipped = []
    for g in data:
        if not g.get("employee_id") or not g.get("name"):
            skipped.append(g.get("id"))
            continue
        rows.append((g["employee_id"], g.get("gi_id") or None, g["name"], g.get("factories") or []))

    execute_values(cur,
        "INSERT INTO dim_gi_inspector (employee_id, gi_id, name, factories) VALUES %s ON CONFLICT (employee_id) DO NOTHING",
        rows
    )
    print(f"  dim_gi_inspector: {len(rows)} inserted, {len(skipped)} skipped (malformed: ids {skipped})")
    return len(rows)


def seed_models(cur):
    """Extract unique (material_code, model_name) from qrcode_snk.json."""
    print("  dim_model: reading qrcode_snk.json (may take a moment)...")
    with open(DATA_DIR / "qrcode_snk.json") as f:
        data = json.load(f)

    seen = {}
    for factory in data.values():
        for r in factory["records"]:
            mat = r.get("Material", "").strip()
            mod = r.get("Model", "").strip()
            if mat and mat not in seen:
                seen[mat] = mod or None

    rows = [(mat, mod) for mat, mod in seen.items()]
    execute_values(cur,
        "INSERT INTO dim_model (material_code, model_name) VALUES %s ON CONFLICT (material_code) DO NOTHING",
        rows
    )
    print(f"  dim_model:        {len(rows)} inserted")
    return len(rows)


def main():
    print("==> Seeding dimension tables...")
    conn = connect()
    try:
        with conn.cursor() as cur:
            seed_casters(cur)
            seed_gi_inspectors(cur)
            seed_models(cur)
        conn.commit()
        print("  dim_factory + dim_defect_type: pre-seeded via migration")
        print("==> Dimensions done.\n")
    except Exception as e:
        conn.rollback()
        print(f"ERROR: {e}")
        sys.exit(1)
    finally:
        conn.close()


if __name__ == "__main__":
    main()
