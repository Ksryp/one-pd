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
        # All QR scan records = firing/kiln inspection
        sql = """
            SELECT
                COUNT(*) FILTER (WHERE result_work = 'Good') AS good,
                COUNT(*) FILTER (WHERE result_work = 'RF')   AS repair,
                COUNT(*) FILTER (WHERE result_work = 'Bad')  AS scrap,
                COUNT(*) AS total
            FROM fact_qr_scan
        """
        title = "FIRING YIELD"
        target = 85.0
    else:
        # Clay yield has no real data — this path is kept for completeness
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
    value_total = round((good + repair) / total * 100, 1) if total else 0.0
    value_once  = round(good / total * 100, 1) if total else 0.0

    return {
        "title": title,
        "value_total": value_total,
        "value_once":  value_once,
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
        SELECT time, mcrim, mceng, mcskr, map, volst,
               stemp, wtemp, ct_avg_cur, ct_mc_cur, claygood
        FROM hpc_shell_2
        ORDER BY time DESC LIMIT 1
    """)).fetchone()
    if row is None:
        return None
    keys = ["time","mcrim","mceng","mcskr","map","volst","stemp","wtemp","ct_avg_cur","ct_mc_cur","claygood"]
    d = dict(zip(keys, row))
    d["time"] = d["time"].isoformat() if d["time"] else None
    return d


def get_defects_hourly(db: Session) -> list[dict]:
    """Hourly defect counts from the most recent active day in fact_qr_scan."""
    rows = db.execute(text("""
        WITH latest_day AS (
            SELECT DATE_TRUNC('day', scanned_at)::date AS day
            FROM fact_qr_scan
            GROUP BY 1 HAVING COUNT(*) > 10
            ORDER BY 1 DESC LIMIT 1
        )
        SELECT
            to_char(date_trunc('hour', scanned_at), 'HH24:MI')         AS hour,
            COUNT(*)                                                      AS total,
            COUNT(*) FILTER (WHERE result_work NOT IN ('Good', 'RF'))   AS defects
        FROM fact_qr_scan
        WHERE DATE_TRUNC('day', scanned_at)::date = (SELECT day FROM latest_day)
        GROUP BY date_trunc('hour', scanned_at)
        ORDER BY date_trunc('hour', scanned_at)
    """)).fetchall()
    return [{"hour": r[0], "total": int(r[1]), "defects": int(r[2])} for r in rows]


def get_machine_timeseries(tsdb_session: Session, hours: int = 24) -> list[dict]:
    rows = tsdb_session.execute(text(f"""
        SELECT
            to_char(date_trunc('hour', time), 'HH24:MI') AS hour,
            ROUND(AVG(ct_avg_cur)::numeric, 2)           AS viscosity,
            ROUND(AVG(ct_mc_cur)::numeric, 2)            AS viscosity_v30,
            ROUND(AVG(stemp)::numeric, 2)                AS temperature,
            ROUND(AVG(volst)::numeric, 2)                AS moisture,
            ROUND(AVG(mcrim)::numeric, 2)                AS mcrim,
            ROUND(AVG(mceng)::numeric, 2)                AS mceng,
            ROUND(AVG(map)::numeric, 2)                  AS map_val,
            COUNT(*)                                      AS samples
        FROM hpc_shell_2
        WHERE time >= NOW() - INTERVAL '{hours} hours'
        GROUP BY date_trunc('hour', time)
        ORDER BY date_trunc('hour', time)
    """)).fetchall()

    keys = ["hour","viscosity","viscosity_v30","temperature","moisture","mcrim","mceng","map_val","samples"]
    return [dict(zip(keys, r)) for r in rows]


# ── Parameter-Defect Chart ─────────────────────────────────────────────────────

_VALID_VIEWS = {'hour', 'day', 'week', 'month'}
_VIEW_FMT = {'hour': 'DD Mon', 'day': 'DD Mon', 'week': 'IYYY-IW', 'month': 'Mon YYYY'}

# Columns in slip_daily_record mapped to frontend parameter keys
_SLIP_PARAM_COL = {
    'viscosity_v0':  'v0_sec100ml',
    'viscosity_v30': 'v30_sec100ml',
    'temperature':   'temp_c',
    'concentration': 'conc_g200ml',
    'casting_rate':  'casting_rate_mm20min',
    'yield_value':   'yield_value',
    'thixo':         'thixo_f0_f5',
}

# spec column names in slip_spec_history keyed by parameter
_SPEC_COLS = {
    'viscosity_v0':  ('v0_min',      'v0_max'),
    'viscosity_v30': ('v30_min',     'v30_max'),
    'concentration': ('conc_min',    'conc_max'),
    'yield_value':   ('yield_min',   'yield_max'),
    'thixo':         ('thixo_min',   'thixo_max'),
    'casting_rate':  ('casting_min', 'casting_max'),
}


def _get_slip_specs(pg_db: Session, params: list[str]) -> tuple[dict, dict]:
    """Return (ucl, lcl) dicts from the most-recent slip_spec_history row."""
    row = pg_db.execute(text("""
        SELECT conc_min, conc_max, v0_min, v0_max, v30_min, v30_max,
               yield_min, yield_max, thixo_min, thixo_max, casting_min, casting_max
        FROM slip_spec_history
        ORDER BY effective_date DESC
        LIMIT 1
    """)).fetchone()
    if not row:
        return {}, {}
    col_idx = {
        'conc_min': 0, 'conc_max': 1,
        'v0_min':   2, 'v0_max':   3,
        'v30_min':  4, 'v30_max':  5,
        'yield_min':6, 'yield_max':7,
        'thixo_min':8, 'thixo_max':9,
        'casting_min':10,'casting_max':11,
    }
    lcl, ucl = {}, {}
    for pp in params:
        if pp in _SPEC_COLS:
            mn_col, mx_col = _SPEC_COLS[pp]
            v_min = row[col_idx[mn_col]]
            v_max = row[col_idx[mx_col]]
            if v_min is not None:
                lcl[pp] = float(v_min)
            if v_max is not None:
                ucl[pp] = float(v_max)
    return ucl, lcl


def _defect_where(defect_code: str | None, model_names: list[str] | None, params: dict) -> str:
    parts = ["f.scanned_at BETWEEN :start_dt AND :end_dt"]
    if defect_code and defect_code.upper() != 'ALL':
        parts.append("f.defect_id = (SELECT id FROM dim_defect_type WHERE code = :dcode LIMIT 1)")
        params["dcode"] = defect_code.upper()
    else:
        parts.append("f.defect_id IS NOT NULL")
    if model_names:
        parts.append("f.model_id IN (SELECT id FROM dim_model WHERE model_name = ANY(:mnames))")
        params["mnames"] = model_names
    return " AND ".join(parts)


def get_defect_chart(
    pg_db: Session,
    view: str,
    start_date: str,
    end_date: str,
    defect_code: str | None,
    model_names: list[str] | None,
    parameter_list: list[str],
) -> dict:
    # 'hour' is not meaningful for daily slip records — treat as 'day'
    view = view if view in ('day', 'week', 'month') else 'day'
    fmt    = _VIEW_FMT[view]
    bucket = f"date_trunc('{view}', f.scanned_at AT TIME ZONE 'Asia/Bangkok')"

    p: dict = {
        "start_dt": f"{start_date} 00:00:00+07:00",
        "end_dt":   f"{end_date} 23:59:59+07:00",
    }
    where = _defect_where(defect_code, model_names, p)

    # Defect bars — COUNT per time bucket
    defect_rows = pg_db.execute(text(f"""
        SELECT to_char({bucket}, '{fmt}') AS label,
               {bucket}                   AS ts,
               COUNT(*)                   AS defect_count
        FROM fact_qr_scan f
        WHERE {where}
        GROUP BY {bucket} ORDER BY {bucket} ASC
    """), p).fetchall()

    # Total scans per bucket
    total_p: dict = {"start_dt": p["start_dt"], "end_dt": p["end_dt"]}
    total_where = "scanned_at BETWEEN :start_dt AND :end_dt"
    if model_names:
        total_where += " AND model_id IN (SELECT id FROM dim_model WHERE model_name = ANY(:mnames))"
        total_p["mnames"] = model_names

    total_rows = pg_db.execute(text(f"""
        SELECT to_char(date_trunc('{view}', scanned_at AT TIME ZONE 'Asia/Bangkok'), '{fmt}') AS label,
               date_trunc('{view}', scanned_at AT TIME ZONE 'Asia/Bangkok') AS ts,
               COUNT(*) AS total
        FROM fact_qr_scan
        WHERE {total_where}
        GROUP BY date_trunc('{view}', scanned_at AT TIME ZONE 'Asia/Bangkok')
        ORDER BY date_trunc('{view}', scanned_at AT TIME ZONE 'Asia/Bangkok') ASC
    """), total_p).fetchall()

    defect_map   = {r[0]: int(r[2]) for r in defect_rows}
    total_map    = {r[0]: int(r[2]) for r in total_rows}
    label_ts_map = {r[0]: r[1].replace(tzinfo=None) for r in defect_rows}
    label_ts_map.update({r[0]: r[1].replace(tzinfo=None) for r in total_rows})

    # Parameter lines — AVG per bucket from slip_daily_record
    # sorted by date ASC, then line_no ASC
    valid_params = [pp for pp in parameter_list if pp in _SLIP_PARAM_COL]
    param_map: dict = {}
    has_param_data = False

    if valid_params:
        col_exprs = ", ".join(
            f"ROUND(AVG(s.{_SLIP_PARAM_COL[pp]})::numeric, 2) AS {pp}"
            for pp in valid_params
        )
        pb = f"date_trunc('{view}', s.date::timestamp)"
        slip_rows = pg_db.execute(text(f"""
            SELECT to_char({pb}, '{fmt}') AS label,
                   {pb}                   AS ts,
                   {col_exprs}
            FROM slip_daily_record s
            WHERE s.date BETWEEN :start_date AND :end_date
            GROUP BY {pb}
            ORDER BY {pb} ASC
        """), {"start_date": start_date, "end_date": end_date}).fetchall()

        if slip_rows:
            has_param_data = True
            for r in slip_rows:
                label, ts = r[0], r[1]
                param_map[label] = {
                    pp: (float(r[i + 2]) if r[i + 2] is not None else None)
                    for i, pp in enumerate(valid_params)
                }
                if label not in label_ts_map and ts is not None:
                    label_ts_map[label] = ts if not hasattr(ts, 'tzinfo') else ts.replace(tzinfo=None)

    ucl, lcl = _get_slip_specs(pg_db, valid_params)

    all_labels = sorted(
        set(total_map) | set(param_map),
        key=lambda lbl: label_ts_map.get(lbl, datetime.max.replace(tzinfo=None))
    )
    points = []
    for lbl in all_labels:
        pt: dict = {"label": lbl, "defect": defect_map.get(lbl, 0), "total": total_map.get(lbl, 0)}
        pvals = param_map.get(lbl, {})
        for pp in valid_params:
            pt[pp] = pvals.get(pp)
        points.append(pt)

    return {
        "points":         points,
        "ucl":            ucl,
        "lcl":            lcl,
        "has_param_data": has_param_data,
    }


def get_defect_insights(
    pg_db: Session,
    start_date: str,
    end_date: str,
    defect_code: str | None,
    model_names: list[str] | None,
) -> dict:
    p: dict = {
        "start_dt": f"{start_date} 00:00:00+07:00",
        "end_dt":   f"{end_date} 23:59:59+07:00",
    }
    where = _defect_where(defect_code, model_names, p)

    top = pg_db.execute(text(f"""
        SELECT dt.code, dt.label, dt.category, COUNT(*) AS cnt
        FROM fact_qr_scan f
        JOIN dim_defect_type dt ON dt.id = f.defect_id
        WHERE {where}
        GROUP BY dt.code, dt.label, dt.category ORDER BY cnt DESC LIMIT 8
    """), p).fetchall()

    cat = pg_db.execute(text(f"""
        SELECT dt.category, COUNT(*) AS cnt
        FROM fact_qr_scan f
        JOIN dim_defect_type dt ON dt.id = f.defect_id
        WHERE {where}
        GROUP BY dt.category ORDER BY cnt DESC
    """), p).fetchall()

    # Total (all scans in range, not just defective)
    tot_p: dict = {"start_dt": p["start_dt"], "end_dt": p["end_dt"]}
    tot_where = "scanned_at BETWEEN :start_dt AND :end_dt"
    if model_names:
        tot_where += " AND model_id IN (SELECT id FROM dim_model WHERE model_name = ANY(:mnames))"
        tot_p["mnames"] = model_names
    totals = pg_db.execute(text(f"""
        SELECT COUNT(*) FILTER (WHERE defect_id IS NOT NULL) AS defects,
               COUNT(*) AS total
        FROM fact_qr_scan WHERE {tot_where}
    """), tot_p).fetchone()

    d, t = int(totals[0] or 0), int(totals[1] or 0)
    return {
        "top_defects":    [{"code": r[0], "label": r[1], "category": r[2], "count": int(r[3])} for r in top],
        "by_category":    [{"category": r[0], "count": int(r[1])} for r in cat],
        "total_defects":  d,
        "total_scans":    t,
        "defect_rate":    round(d / t * 100, 1) if t else 0,
    }


def get_meta_models(pg_db: Session) -> list[dict]:
    rows = pg_db.execute(text("""
        SELECT dm.model_name, COUNT(*) AS cnt
        FROM fact_qr_scan f JOIN dim_model dm ON dm.id = f.model_id
        GROUP BY dm.model_name ORDER BY cnt DESC
    """)).fetchall()
    return [{"name": r[0], "count": int(r[1])} for r in rows]


def get_meta_defect_types(pg_db: Session) -> list[dict]:
    rows = pg_db.execute(text("""
        SELECT dt.code, dt.label, dt.category, COUNT(f.id) AS cnt
        FROM dim_defect_type dt LEFT JOIN fact_qr_scan f ON f.defect_id = dt.id
        GROUP BY dt.id, dt.code, dt.label, dt.category ORDER BY cnt DESC
    """)).fetchall()
    return [{"code": r[0], "label": r[1], "category": r[2], "count": int(r[3] or 0)} for r in rows]
