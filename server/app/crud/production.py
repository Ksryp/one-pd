"""All aggregate queries done in SQL — no Python-side data pulling."""
from datetime import datetime, timezone
from sqlalchemy import text
from sqlalchemy.orm import Session

STAGES = [
    ("slip-prep",  "SLIP PREP"),
    ("glaze-prep", "GLAZE PREP"),
    ("casting",    "CASTING"),
    ("drying",     "DRYING"),
    ("spraying",   "SPRAYING"),
    ("firing",     "FIRING"),
]

LEVEL_ORDER = {"EMERGENCY": 3, "ABNORMAL": 2, "MAINTENANCE": 1, "NORMAL": 0}


# ── Pipeline ──────────────────────────────────────────────────────────────────
def get_pipeline(db: Session) -> list[dict]:
    rows = db.execute(text("""
        SELECT stage, level, MAX(created_at) AS latest
        FROM alerts
        WHERE resolved = false
        GROUP BY stage, level
    """)).fetchall()

    alert_map: dict[str, dict] = {}
    for stage, level, ts in rows:
        prev = alert_map.get(stage)
        if prev is None or LEVEL_ORDER.get(level, 0) > LEVEL_ORDER.get(prev["level"], 0):
            alert_map[stage] = {"level": level, "ts": ts}

    now_str = datetime.now(timezone.utc).strftime("%d/%m/%y %H:%M")
    result = []
    for stage_id, label in STAGES:
        info = alert_map.get(stage_id)
        status = info["level"] if info else "NORMAL"
        ts = info["ts"].strftime("%d/%m/%y %H:%M") if info and info["ts"] else now_str
        result.append({"id": stage_id, "label": label, "status": status, "timestamp": ts})
    return result


# ── Notifications ─────────────────────────────────────────────────────────────
def get_notifications(db: Session, limit: int = 20) -> list[dict]:
    rows = db.execute(text("""
        SELECT id, title, level, message, created_at, resolved, stage
        FROM alerts
        ORDER BY resolved ASC, created_at DESC
        LIMIT :limit
    """), {"limit": limit}).fetchall()

    return [
        {
            "id": r[0],
            "title": r[1],
            "level": r[2],
            "message": r[3],
            "timestamp": r[4].strftime("%d/%m/%y %H:%M") if r[4] else "",
            "resolved": r[5],
            "stage": r[6],
        }
        for r in rows
    ]


# ── Yield ─────────────────────────────────────────────────────────────────────
def get_yield(db: Session, type_: str) -> dict:
    if type_ == "firing":
        # Pieces that went through kiln (non-empty klin_key)
        sql = """
            SELECT
                COUNT(*) FILTER (WHERE result_work = 'Good') AS good,
                COUNT(*) FILTER (WHERE result_work = 'RF')   AS repair,
                COUNT(*) FILTER (WHERE result_work = 'Bad')  AS scrap,
                COUNT(*) AS total
            FROM fact_qr_scan
            WHERE klin_key IS NOT NULL AND klin_key != ''
        """
        title = "FIRING YIELD"
        target = 85.0
    else:
        # Clay: all inspected pieces
        sql = """
            SELECT
                COUNT(*) FILTER (WHERE result_work = 'Good') AS good,
                COUNT(*) FILTER (WHERE result_work = 'RF')   AS repair,
                COUNT(*) FILTER (WHERE result_work = 'Bad')  AS scrap,
                COUNT(*) AS total
            FROM fact_qr_scan
        """
        title = "CLAY YIELD"
        target = 90.0

    row = db.execute(text(sql)).fetchone()
    good, repair, scrap, total = (row[0] or 0, row[1] or 0, row[2] or 0, row[3] or 1)
    yield_pct = round(good / total * 100, 1) if total else 0.0

    return {
        "title": title,
        "value": yield_pct,
        "segments": [
            {"label": "Good",   "value": good,   "color": "#16A34A"},
            {"label": "Repair", "value": repair,  "color": "#D97706"},
            {"label": "Scrap",  "value": scrap,   "color": "#DC2626"},
        ],
        "target": target,
    }


# ── Metrics ───────────────────────────────────────────────────────────────────
def get_metrics(db: Session) -> dict:
    slip = db.execute(text("""
        SELECT
            COALESCE(SUM(casting_rate_mm20min), 0) AS slip_in,
            COALESCE(AVG(
                CASE WHEN conc_g200ml IS NOT NULL THEN casting_rate_mm20min END
            ), 0) AS avg_rate,
            COUNT(*) FILTER (WHERE conc_g200ml IS NOT NULL) AS recorded
        FROM slip_daily_record
        WHERE date >= CURRENT_DATE - INTERVAL '30 days'
    """)).fetchone()

    warehouse = db.execute(text("""
        SELECT COUNT(*) FROM fact_qr_scan
        WHERE result_work = 'Good'
          AND scanned_at >= NOW() - INTERVAL '30 days'
    """)).fetchone()

    slip_in_val = float(slip[0] or 0)
    wh_val = int(warehouse[0] or 0)

    total_qs = db.execute(text("""
        SELECT
            COUNT(*) FILTER (WHERE result_work = 'Good') AS good,
            COUNT(*) AS total
        FROM fact_qr_scan
        WHERE scanned_at >= NOW() - INTERVAL '30 days'
    """)).fetchone()
    good_30 = total_qs[0] or 0
    total_30 = total_qs[1] or 1
    slip_yield_pct = round(good_30 / total_30 * 100, 1)

    return {
        "slipIn":       {"value": round(slip_in_val, 1), "unit": "mm/20min avg"},
        "slipYield":    {"value": slip_yield_pct,         "unit": "%"},
        "warehouseIn":  {"value": wh_val,                 "unit": "pcs"},
    }
