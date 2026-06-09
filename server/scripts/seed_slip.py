"""Seed slip_daily_record and slip_spec_history from JSON source files."""
import json
import sys
from pathlib import Path
from datetime import date

import psycopg2
from psycopg2.extras import execute_values

DATA_DIR = Path(__file__).parent.parent.parent / "data"
sys.path.insert(0, str(Path(__file__).parent.parent))
from app.core.config import settings


def connect():
    return psycopg2.connect(
        host=settings.PG_HOST, port=settings.PG_PORT,
        dbname=settings.PG_NAME, user=settings.PG_USER, password=settings.PG_PASS,
    )


def seed_slip_records(cur):
    with open(DATA_DIR / "slip_prop_records.json") as f:
        data = json.load(f)

    records = data["slip_prop"]["daily_records"]
    rows = []
    null_rows = 0

    for r in records:
        d = r.get("date")
        line = r.get("line_no")
        if not d or line is None:
            continue

        all_null = all(r.get(k) is None for k in [
            "conc_g200ml", "v0_sec100ml", "v30_sec100ml",
            "yield_value", "casting_rate_mm20min"
        ])
        if all_null:
            null_rows += 1

        rows.append((
            d, line,
            r.get("tank_no"),
            r.get("type"),
            r.get("conc_g200ml"),
            r.get("temp_c"),
            r.get("v0_sec100ml"),
            r.get("v30_sec100ml"),
            r.get("yield_value"),
            r.get("f0"),
            r.get("f5"),
            r.get("thixo_f0_f5"),
            r.get("casting_rate_mm20min"),
        ))

    execute_values(cur, """
        INSERT INTO slip_daily_record
            (date, line_no, tank_no, type, conc_g200ml, temp_c,
             v0_sec100ml, v30_sec100ml, yield_value, f0, f5,
             thixo_f0_f5, casting_rate_mm20min)
        VALUES %s
        ON CONFLICT (date, line_no) DO UPDATE SET
            tank_no               = EXCLUDED.tank_no,
            type                  = EXCLUDED.type,
            conc_g200ml           = EXCLUDED.conc_g200ml,
            temp_c                = EXCLUDED.temp_c,
            v0_sec100ml           = EXCLUDED.v0_sec100ml,
            v30_sec100ml          = EXCLUDED.v30_sec100ml,
            yield_value           = EXCLUDED.yield_value,
            f0                    = EXCLUDED.f0,
            f5                    = EXCLUDED.f5,
            thixo_f0_f5           = EXCLUDED.thixo_f0_f5,
            casting_rate_mm20min  = EXCLUDED.casting_rate_mm20min
    """, rows)

    print(f"  slip_daily_record: {len(rows)} rows inserted")
    print(f"    ⚠ fully-null rows (future dates): {null_rows}/{len(rows)} ({100*null_rows/len(rows):.1f}%)")


def seed_spec_history(cur):
    with open(DATA_DIR / "slip_prop_standards.json") as f:
        data = json.load(f)

    specs = data["slip_prop_standards"]["spec_history"]
    rows = []
    for s in specs:
        rows.append((
            s["effective_date"],
            s["line"],
            s.get("conc", {}).get("min"),   s.get("conc", {}).get("max"),
            s.get("v0", {}).get("min"),      s.get("v0", {}).get("max"),
            s.get("v30", {}).get("min"),     s.get("v30", {}).get("max"),
            s.get("yield_value", {}).get("min"), s.get("yield_value", {}).get("max"),
            s.get("thixo", {}).get("min"),   s.get("thixo", {}).get("max"),
            s.get("casting_rate", {}).get("min"), s.get("casting_rate", {}).get("max"),
        ))

    execute_values(cur, """
        INSERT INTO slip_spec_history
            (effective_date, line, conc_min, conc_max, v0_min, v0_max,
             v30_min, v30_max, yield_min, yield_max,
             thixo_min, thixo_max, casting_min, casting_max)
        VALUES %s
        ON CONFLICT (effective_date, line) DO NOTHING
    """, rows)
    print(f"  slip_spec_history: {len(rows)} versions inserted")


def main():
    print("==> Seeding slip data...")
    conn = connect()
    try:
        with conn.cursor() as cur:
            seed_slip_records(cur)
            seed_spec_history(cur)
        conn.commit()
        print("==> Slip data done.\n")
    except Exception as e:
        conn.rollback()
        print(f"ERROR: {e}")
        sys.exit(1)
    finally:
        conn.close()


if __name__ == "__main__":
    main()
