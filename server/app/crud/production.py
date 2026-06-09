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

SEVERITY_SQL = """
    CASE level
        WHEN 'EMERGENCY'   THEN 1
        WHEN 'ABNORMAL'    THEN 2
        WHEN 'MAINTENANCE' THEN 3
        ELSE 4
    END
"""


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
    rows = db.execute(text(f"""
        SELECT id, title, level, message, created_at, resolved, stage
        FROM alerts
        ORDER BY resolved ASC, {SEVERITY_SQL}, created_at DESC
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
    totals = db.execute(text("""
        SELECT
            COUNT(*)                                        AS total,
            COUNT(*) FILTER (WHERE result_work = 'Good')   AS good,
            COUNT(*) FILTER (WHERE result_work = 'RF')     AS repair,
            COUNT(*) FILTER (WHERE result_work = 'Bad')    AS scrap
        FROM fact_qr_scan
        WHERE scanned_at >= NOW() - INTERVAL '30 days'
    """)).fetchone()

    wh = db.execute(text("""
        SELECT COUNT(*) FROM fact_qr_scan
        WHERE result_work = 'Good'
          AND scanned_at >= NOW() - INTERVAL '30 days'
    """)).fetchone()

    total = int(totals[0] or 0)
    good  = int(totals[1] or 0)
    slip_yield_pct = round(good / total * 100, 1) if total else 0.0
    wh_pcs = int(wh[0] or 0)

    return {
        "slipIn":      {"pieces": total,        "kg": round(total * 0.55, 0)},
        "slipYield":   {"value": slip_yield_pct, "target": 75},
        "warehouseIn": {"pieces": wh_pcs,        "kg": round(wh_pcs * 0.55, 0)},
    }


# ── Resolve alert ─────────────────────────────────────────────────────────────
def resolve_alert(db: Session, alert_id: int) -> bool:
    result = db.execute(
        text("UPDATE alerts SET resolved = true WHERE id = :id AND resolved = false"),
        {"id": alert_id},
    )
    db.commit()
    return result.rowcount > 0


# ── Defect summary ────────────────────────────────────────────────────────────
def get_defect_summary(db: Session, days: int = 30) -> list[dict]:
    rows = db.execute(text("""
        SELECT defect_type_key, COUNT(*) AS cnt
        FROM fact_qr_scan
        WHERE result_work IN ('RF','Bad')
          AND scanned_at >= NOW() - INTERVAL ':days days'
        GROUP BY defect_type_key
        ORDER BY cnt DESC
        LIMIT 10
    """.replace(":days days", f"{days} days"))).fetchall()
    return [{"type": r[0], "count": int(r[1])} for r in rows]


# ── Machine timeseries (TimescaleDB) ─────────────────────────────────────────
def get_machine_latest(tsdb_session: Session) -> dict | None:
    row = tsdb_session.execute(text("""
        SELECT time, "MCRIM","MCENG","MCSKR","MAP","VolST",
               "STemp","WTemp","CT_AVG_Cur","CT_MC_Cur","ClayGood"
        FROM hpc_shell_2
        ORDER BY time DESC LIMIT 1
    """)).fetchone()
    if row is None:
        return None
    keys = ["time","MCRIM","MCENG","MCSKR","MAP","VolST","STemp","WTemp","CT_AVG_Cur","CT_MC_Cur","ClayGood"]
    d = dict(zip(keys, row))
    d["time"] = d["time"].isoformat() if d["time"] else None
    return d


def get_machine_timeseries(tsdb_session: Session, hours: int = 24) -> list[dict]:
    rows = tsdb_session.execute(text(f"""
        SELECT
            to_char(date_trunc('hour', time), 'HH24:MI') AS hour,
            ROUND(AVG("CT_AVG_Cur")::numeric, 2)          AS viscosity,
            ROUND(AVG("CT_MC_Cur")::numeric, 2)           AS viscosity_v30,
            ROUND(AVG("STemp")::numeric, 2)               AS temperature,
            ROUND(AVG("VolST")::numeric, 2)               AS moisture,
            ROUND(AVG("MCRIM")::numeric, 2)               AS mcrim,
            ROUND(AVG("MCENG")::numeric, 2)               AS mceng,
            ROUND(AVG("MAP")::numeric, 2)                 AS map_val,
            COUNT(*)                                       AS samples
        FROM hpc_shell_2
        WHERE time >= NOW() - INTERVAL '{hours} hours'
        GROUP BY date_trunc('hour', time)
        ORDER BY date_trunc('hour', time)
    """)).fetchall()

    keys = ["hour","viscosity","viscosity_v30","temperature","moisture","mcrim","mceng","map_val","samples"]
    return [dict(zip(keys, r)) for r in rows]
