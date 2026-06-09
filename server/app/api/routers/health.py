from fastapi import APIRouter
from sqlalchemy import text

from app.db.session import pg_engine, tsdb_engine

router = APIRouter()


@router.get("/health")
def health():
    pg_ok = False
    tsdb_ok = False

    try:
        with pg_engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        pg_ok = True
    except Exception:
        pass

    try:
        with tsdb_engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        tsdb_ok = True
    except Exception:
        pass

    status = "ok" if (pg_ok and tsdb_ok) else "degraded"
    return {"status": status, "pg": pg_ok, "tsdb": tsdb_ok}
