from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

from app.core.config import settings

# PostgreSQL — production/quality/app data
pg_engine = create_engine(settings.pg_dsn, pool_pre_ping=True)
PgSession = sessionmaker(bind=pg_engine, autoflush=False, autocommit=False)

# TimescaleDB — machine data (read-only)
tsdb_engine = create_engine(settings.tsdb_dsn, pool_pre_ping=True)
TsdbSession = sessionmaker(bind=tsdb_engine, autoflush=False, autocommit=False)


class PgBase(DeclarativeBase):
    pass


class TsdbBase(DeclarativeBase):
    pass


def get_pg_db():
    db = PgSession()
    try:
        yield db
    finally:
        db.close()


def get_tsdb_db():
    db = TsdbSession()
    try:
        yield db
    finally:
        db.close()
