from datetime import date, datetime
from sqlalchemy import BigInteger, Boolean, Date, Double, ForeignKey, Integer, SmallInteger, String, Text, TIMESTAMP
from sqlalchemy.dialects.postgresql import ARRAY, INET, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import PgBase


class DimFactory(PgBase):
    __tablename__ = "dim_factory"

    id: Mapped[int] = mapped_column(SmallInteger, primary_key=True)
    code: Mapped[str] = mapped_column(String(10), unique=True, nullable=False)
    name: Mapped[str | None] = mapped_column(String(100))


class DimCaster(PgBase):
    __tablename__ = "dim_caster"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    employee_id: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    caster_id: Mapped[str | None] = mapped_column(String(20))
    name: Mapped[str | None] = mapped_column(String(200))
    factories: Mapped[list[str] | None] = mapped_column(ARRAY(Text))


class DimGiInspector(PgBase):
    __tablename__ = "dim_gi_inspector"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    employee_id: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    gi_id: Mapped[str | None] = mapped_column(String(10))
    name: Mapped[str | None] = mapped_column(String(200))
    factories: Mapped[list[str] | None] = mapped_column(ARRAY(Text))


class DimModel(PgBase):
    __tablename__ = "dim_model"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    material_code: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    model_name: Mapped[str | None] = mapped_column(String(200))


class DimDefectType(PgBase):
    __tablename__ = "dim_defect_type"

    id: Mapped[int] = mapped_column(SmallInteger, primary_key=True)
    code: Mapped[str] = mapped_column(String(10), unique=True, nullable=False)
    label: Mapped[str | None] = mapped_column(String(100))
    category: Mapped[str | None] = mapped_column(String(50))


class FactQrScan(PgBase):
    __tablename__ = "fact_qr_scan"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    scanned_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), nullable=False)
    qr_code: Mapped[str | None] = mapped_column(String(50))
    export_name: Mapped[str | None] = mapped_column(String(100))
    factory_id: Mapped[int | None] = mapped_column(SmallInteger, ForeignKey("dim_factory.id"))
    caster_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("dim_caster.id"))
    gi_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("dim_gi_inspector.id"))
    model_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("dim_model.id"))
    defect_id: Mapped[int | None] = mapped_column(SmallInteger, ForeignKey("dim_defect_type.id"))
    type: Mapped[str | None] = mapped_column(String(10))
    result_work: Mapped[str | None] = mapped_column(String(20))
    result: Mapped[str | None] = mapped_column(String(20))
    klin_key: Mapped[str | None] = mapped_column(String(20))
    zgi: Mapped[str | None] = mapped_column(String(10))

    factory = relationship("DimFactory")
    caster = relationship("DimCaster")
    gi_inspector = relationship("DimGiInspector")
    model = relationship("DimModel")
    defect_type = relationship("DimDefectType")


class SlipDailyRecord(PgBase):
    __tablename__ = "slip_daily_record"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    date: Mapped[date] = mapped_column(Date, nullable=False)
    line_no: Mapped[int] = mapped_column(SmallInteger, nullable=False)
    tank_no: Mapped[int | None] = mapped_column(SmallInteger)
    type: Mapped[str | None] = mapped_column(String(10))
    conc_g200ml: Mapped[float | None] = mapped_column(Double)
    temp_c: Mapped[float | None] = mapped_column(Double)
    v0_sec100ml: Mapped[float | None] = mapped_column(Double)
    v30_sec100ml: Mapped[float | None] = mapped_column(Double)
    yield_value: Mapped[float | None] = mapped_column(Double)
    f0: Mapped[float | None] = mapped_column(Double)
    f5: Mapped[float | None] = mapped_column(Double)
    thixo_f0_f5: Mapped[float | None] = mapped_column(Double)
    casting_rate_mm20min: Mapped[float | None] = mapped_column(Double)


class SlipSpecHistory(PgBase):
    __tablename__ = "slip_spec_history"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    effective_date: Mapped[date] = mapped_column(Date, nullable=False)
    line: Mapped[str] = mapped_column(String(10), nullable=False)
    conc_min: Mapped[float | None] = mapped_column(Double)
    conc_max: Mapped[float | None] = mapped_column(Double)
    v0_min: Mapped[float | None] = mapped_column(Double)
    v0_max: Mapped[float | None] = mapped_column(Double)
    v30_min: Mapped[float | None] = mapped_column(Double)
    v30_max: Mapped[float | None] = mapped_column(Double)
    yield_min: Mapped[float | None] = mapped_column(Double)
    yield_max: Mapped[float | None] = mapped_column(Double)
    thixo_min: Mapped[float | None] = mapped_column(Double)
    thixo_max: Mapped[float | None] = mapped_column(Double)
    casting_min: Mapped[float | None] = mapped_column(Double)
    casting_max: Mapped[float | None] = mapped_column(Double)


class User(PgBase):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(Text, nullable=False)
    full_name: Mapped[str | None] = mapped_column(String(100))
    role: Mapped[str] = mapped_column(String(30), nullable=False, default="operator")
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True))
    updated_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True))


class Alert(PgBase):
    __tablename__ = "alerts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    stage: Mapped[str] = mapped_column(String(50), nullable=False)
    level: Mapped[str] = mapped_column(String(20), nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    message: Mapped[str | None] = mapped_column(Text)
    resolved: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    resolved_by: Mapped[int | None] = mapped_column(Integer, ForeignKey("users.id"))
    resolved_at: Mapped[datetime | None] = mapped_column(TIMESTAMP(timezone=True))
    created_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True))


class ManualEntry(PgBase):
    __tablename__ = "manual_entries"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    stage: Mapped[str] = mapped_column(String(50), nullable=False)
    parameter: Mapped[str] = mapped_column(String(100), nullable=False)
    value: Mapped[float] = mapped_column(Double, nullable=False)
    unit: Mapped[str | None] = mapped_column(String(30))
    entered_by: Mapped[int | None] = mapped_column(Integer, ForeignKey("users.id"))
    created_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True))


class AuditLog(PgBase):
    __tablename__ = "audit_log"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    timestamp: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True))
    user_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("users.id"))
    role: Mapped[str | None] = mapped_column(String(30))
    action: Mapped[str] = mapped_column(String(100), nullable=False)
    resource: Mapped[str | None] = mapped_column(String(100))
    old_value: Mapped[dict | None] = mapped_column(JSONB)
    new_value: Mapped[dict | None] = mapped_column(JSONB)
    ip_address = mapped_column(INET)
    result: Mapped[str] = mapped_column(String(10), nullable=False, default="success")


class Threshold(PgBase):
    __tablename__ = "thresholds"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    stage: Mapped[str] = mapped_column(String(50), nullable=False)
    parameter: Mapped[str] = mapped_column(String(100), nullable=False)
    ucl: Mapped[float | None] = mapped_column(Double)
    lcl: Mapped[float | None] = mapped_column(Double)
    updated_by: Mapped[int | None] = mapped_column(Integer, ForeignKey("users.id"))
    updated_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True))
