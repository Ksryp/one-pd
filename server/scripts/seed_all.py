"""Master seed script — runs all seeds in order and prints a data quality report."""
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

import psycopg2
from app.core.config import settings

import seed_dims
import seed_slip
import seed_qr


def quality_report(conn):
    cur = conn.cursor()
    print("=" * 55)
    print("DATA QUALITY REPORT")
    print("=" * 55)

    checks = [
        ("dim_factory",        "SELECT COUNT(*) FROM dim_factory"),
        ("dim_caster",         "SELECT COUNT(*) FROM dim_caster"),
        ("dim_gi_inspector",   "SELECT COUNT(*) FROM dim_gi_inspector"),
        ("dim_model",          "SELECT COUNT(*) FROM dim_model"),
        ("dim_defect_type",    "SELECT COUNT(*) FROM dim_defect_type"),
        ("fact_qr_scan",       "SELECT COUNT(*) FROM fact_qr_scan"),
        ("slip_daily_record",  "SELECT COUNT(*) FROM slip_daily_record"),
        ("slip_spec_history",  "SELECT COUNT(*) FROM slip_spec_history"),
    ]
    for label, sql in checks:
        cur.execute(sql)
        print(f"  {label:<22} {cur.fetchone()[0]:>8} rows")

    print()

    # Date ranges
    cur.execute("SELECT MIN(scanned_at), MAX(scanned_at) FROM fact_qr_scan")
    r = cur.fetchone()
    if r[0]:
        print(f"  fact_qr_scan date range: {r[0].date()} → {r[1].date()}")

    cur.execute("SELECT MIN(date), MAX(date) FROM slip_daily_record")
    r = cur.fetchone()
    if r[0]:
        print(f"  slip_daily_record range: {r[0]} → {r[1]}")

    # Null analysis on slip
    cur.execute("""
        SELECT
            COUNT(*) FILTER (WHERE v0_sec100ml IS NULL) AS null_v0,
            COUNT(*) FILTER (WHERE conc_g200ml  IS NULL) AS null_conc,
            COUNT(*) AS total
        FROM slip_daily_record
    """)
    r = cur.fetchone()
    if r[2]:
        print(f"  slip null v0:   {r[0]}/{r[2]} ({100*r[0]/r[2]:.1f}%)")
        print(f"  slip null conc: {r[1]}/{r[2]} ({100*r[1]/r[2]:.1f}%)")

    # Defect breakdown
    cur.execute("""
        SELECT d.code, d.label, COUNT(q.id) as cnt
        FROM dim_defect_type d
        LEFT JOIN fact_qr_scan q ON q.defect_id = d.id
        GROUP BY d.id, d.code, d.label
        ORDER BY cnt DESC
    """)
    print("\n  Defect breakdown:")
    for row in cur.fetchall():
        print(f"    {row[0]:<5} {row[1]:<20} {row[2]:>7}")

    # Result work breakdown
    cur.execute("""
        SELECT result_work, COUNT(*) FROM fact_qr_scan
        GROUP BY result_work ORDER BY COUNT(*) DESC
    """)
    print("\n  Result Work breakdown:")
    for row in cur.fetchall():
        print(f"    {str(row[0]):<10} {row[1]:>8}")

    print("=" * 55)
    cur.close()


def main():
    t0 = time.time()
    print("╔══════════════════════════════════════╗")
    print("║   SNK MES — Full Database Seed       ║")
    print("╚══════════════════════════════════════╝\n")

    seed_dims.main()
    seed_slip.main()
    seed_qr.main()

    conn = psycopg2.connect(
        host=settings.PG_HOST, port=settings.PG_PORT,
        dbname=settings.PG_NAME, user=settings.PG_USER, password=settings.PG_PASS,
    )
    quality_report(conn)
    conn.close()

    elapsed = time.time() - t0
    print(f"\nTotal time: {elapsed:.1f}s")


if __name__ == "__main__":
    main()
