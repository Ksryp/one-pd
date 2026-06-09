"""initial schema

Revision ID: 0001
Revises:
Create Date: 2026-06-09
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import ARRAY, INET, JSONB

revision = "0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ── Dimension tables ──────────────────────────────────────────────────────
    op.create_table("dim_factory",
        sa.Column("id",   sa.SmallInteger(), primary_key=True, autoincrement=True),
        sa.Column("code", sa.String(10),  nullable=False, unique=True),
        sa.Column("name", sa.String(100), nullable=True),
    )
    op.execute("INSERT INTO dim_factory (code, name) VALUES ('SNK1','SNK Factory 1'),('SNK2','SNK Factory 2') ON CONFLICT DO NOTHING")

    op.create_table("dim_caster",
        sa.Column("id",          sa.Integer(),    primary_key=True, autoincrement=True),
        sa.Column("employee_id", sa.String(20),   nullable=False, unique=True),
        sa.Column("caster_id",   sa.String(20),   nullable=True),
        sa.Column("name",        sa.String(200),  nullable=True),
        sa.Column("factories",   ARRAY(sa.Text()), nullable=True),
    )

    op.create_table("dim_gi_inspector",
        sa.Column("id",          sa.Integer(),    primary_key=True, autoincrement=True),
        sa.Column("employee_id", sa.String(20),   nullable=False, unique=True),
        sa.Column("gi_id",       sa.String(10),   nullable=True),
        sa.Column("name",        sa.String(200),  nullable=True),
        sa.Column("factories",   ARRAY(sa.Text()), nullable=True),
    )

    op.create_table("dim_model",
        sa.Column("id",            sa.Integer(),   primary_key=True, autoincrement=True),
        sa.Column("material_code", sa.String(50),  nullable=False, unique=True),
        sa.Column("model_name",    sa.String(200), nullable=True),
    )

    op.create_table("dim_defect_type",
        sa.Column("id",       sa.SmallInteger(), primary_key=True, autoincrement=True),
        sa.Column("code",     sa.String(10),  nullable=False, unique=True),
        sa.Column("label",    sa.String(100), nullable=True),
        sa.Column("category", sa.String(50),  nullable=True),
    )
    op.execute("""
        INSERT INTO dim_defect_type (code, label, category) VALUES
            ('C',  'Crack',         'crack'),
            ('B',  'Poor Body',     'body'),
            ('P',  'Pinhole',       'pinhole'),
            ('J',  'Glaze Jump',    'glaze'),
            ('CD', 'Clay Dirt',     'contamination'),
            ('W',  'Warp',          'deformation'),
            ('K',  'Knock',         'mechanical'),
            ('KD', 'Kiln Dirt',     'contamination'),
            ('F',  'Poor Firing',   'firing'),
            ('S',  'Spot',          'surface'),
            ('O',  'Other',         'other'),
            ('G1', 'Poor Glazing',  'glaze'),
            ('G2', 'Poor Glazing',  'glaze'),
            ('X1', 'Poor Function', 'function'),
            ('X2', 'Poor Function', 'function'),
            ('X3', 'Poor Function', 'function'),
            ('X4', 'Poor Function', 'function')
        ON CONFLICT DO NOTHING
    """)

    # ── Users (app data) ──────────────────────────────────────────────────────
    op.create_table("users",
        sa.Column("id",            sa.Integer(),  primary_key=True, autoincrement=True),
        sa.Column("username",      sa.String(50), nullable=False, unique=True),
        sa.Column("password_hash", sa.Text(),     nullable=False),
        sa.Column("full_name",     sa.String(100),nullable=True),
        sa.Column("role",          sa.String(30), nullable=False, server_default="operator"),
        sa.Column("is_active",     sa.Boolean(),  nullable=False, server_default="true"),
        sa.Column("created_at",    sa.TIMESTAMP(timezone=True), server_default=sa.text("NOW()")),
        sa.Column("updated_at",    sa.TIMESTAMP(timezone=True), server_default=sa.text("NOW()")),
    )

    # ── Production / Quality data ─────────────────────────────────────────────
    op.create_table("fact_qr_scan",
        sa.Column("id",            sa.BigInteger(),  primary_key=True, autoincrement=True),
        sa.Column("scanned_at",    sa.TIMESTAMP(timezone=True), nullable=False),
        sa.Column("qr_code",       sa.String(50),  nullable=True),
        sa.Column("export_name",   sa.String(100), nullable=True),
        sa.Column("factory_id",    sa.SmallInteger(), sa.ForeignKey("dim_factory.id"),     nullable=True),
        sa.Column("caster_id",     sa.Integer(),      sa.ForeignKey("dim_caster.id"),      nullable=True),
        sa.Column("gi_id",         sa.Integer(),      sa.ForeignKey("dim_gi_inspector.id"),nullable=True),
        sa.Column("model_id",      sa.Integer(),      sa.ForeignKey("dim_model.id"),       nullable=True),
        sa.Column("defect_id",     sa.SmallInteger(), sa.ForeignKey("dim_defect_type.id"), nullable=True),
        sa.Column("type",          sa.String(10),  nullable=True),
        sa.Column("result_work",   sa.String(20),  nullable=True),
        sa.Column("result",        sa.String(20),  nullable=True),
        sa.Column("klin_key",      sa.String(20),  nullable=True),
        sa.Column("zgi",           sa.String(10),  nullable=True),
    )
    op.create_index("idx_qr_scanned",  "fact_qr_scan", ["scanned_at"])
    op.create_index("idx_qr_factory",  "fact_qr_scan", ["factory_id", "scanned_at"])
    op.create_index("idx_qr_caster",   "fact_qr_scan", ["caster_id",  "scanned_at"])
    op.create_index("idx_qr_defect",   "fact_qr_scan", ["defect_id",  "scanned_at"])
    op.create_index("idx_qr_result",   "fact_qr_scan", ["result_work","scanned_at"])
    op.create_index("idx_qr_model",    "fact_qr_scan", ["model_id",   "scanned_at"])

    op.create_table("slip_daily_record",
        sa.Column("id",                   sa.Integer(),    primary_key=True, autoincrement=True),
        sa.Column("date",                 sa.Date(),       nullable=False),
        sa.Column("line_no",              sa.SmallInteger(),nullable=False),
        sa.Column("tank_no",              sa.SmallInteger(),nullable=True),
        sa.Column("type",                 sa.String(10),   nullable=True),
        sa.Column("conc_g200ml",          sa.Double(),     nullable=True),
        sa.Column("temp_c",               sa.Double(),     nullable=True),
        sa.Column("v0_sec100ml",          sa.Double(),     nullable=True),
        sa.Column("v30_sec100ml",         sa.Double(),     nullable=True),
        sa.Column("yield_value",          sa.Double(),     nullable=True),
        sa.Column("f0",                   sa.Double(),     nullable=True),
        sa.Column("f5",                   sa.Double(),     nullable=True),
        sa.Column("thixo_f0_f5",          sa.Double(),     nullable=True),
        sa.Column("casting_rate_mm20min", sa.Double(),     nullable=True),
        sa.UniqueConstraint("date", "line_no"),
    )
    op.create_index("idx_slip_date", "slip_daily_record", ["date", "line_no"])

    op.create_table("slip_spec_history",
        sa.Column("id",             sa.Integer(),  primary_key=True, autoincrement=True),
        sa.Column("effective_date", sa.Date(),     nullable=False),
        sa.Column("line",           sa.String(10), nullable=False),
        sa.Column("conc_min",       sa.Double(),   nullable=True),
        sa.Column("conc_max",       sa.Double(),   nullable=True),
        sa.Column("v0_min",         sa.Double(),   nullable=True),
        sa.Column("v0_max",         sa.Double(),   nullable=True),
        sa.Column("v30_min",        sa.Double(),   nullable=True),
        sa.Column("v30_max",        sa.Double(),   nullable=True),
        sa.Column("yield_min",      sa.Double(),   nullable=True),
        sa.Column("yield_max",      sa.Double(),   nullable=True),
        sa.Column("thixo_min",      sa.Double(),   nullable=True),
        sa.Column("thixo_max",      sa.Double(),   nullable=True),
        sa.Column("casting_min",    sa.Double(),   nullable=True),
        sa.Column("casting_max",    sa.Double(),   nullable=True),
        sa.UniqueConstraint("effective_date", "line"),
    )

    # ── App / Operational tables ──────────────────────────────────────────────
    op.create_table("alerts",
        sa.Column("id",          sa.Integer(),  primary_key=True, autoincrement=True),
        sa.Column("stage",       sa.String(50), nullable=False),
        sa.Column("level",       sa.String(20), nullable=False),
        sa.Column("title",       sa.String(200),nullable=False),
        sa.Column("message",     sa.Text(),     nullable=True),
        sa.Column("resolved",    sa.Boolean(),  nullable=False, server_default="false"),
        sa.Column("resolved_by", sa.Integer(),  sa.ForeignKey("users.id"), nullable=True),
        sa.Column("resolved_at", sa.TIMESTAMP(timezone=True), nullable=True),
        sa.Column("created_at",  sa.TIMESTAMP(timezone=True), server_default=sa.text("NOW()")),
    )
    op.create_index("idx_alerts_stage",   "alerts", ["stage"])
    op.create_index("idx_alerts_created", "alerts", ["created_at"])

    op.create_table("manual_entries",
        sa.Column("id",         sa.Integer(),  primary_key=True, autoincrement=True),
        sa.Column("stage",      sa.String(50), nullable=False),
        sa.Column("parameter",  sa.String(100),nullable=False),
        sa.Column("value",      sa.Double(),   nullable=False),
        sa.Column("unit",       sa.String(30), nullable=True),
        sa.Column("entered_by", sa.Integer(),  sa.ForeignKey("users.id"), nullable=True),
        sa.Column("created_at", sa.TIMESTAMP(timezone=True), server_default=sa.text("NOW()")),
    )

    op.create_table("audit_log",
        sa.Column("id",         sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column("timestamp",  sa.TIMESTAMP(timezone=True), server_default=sa.text("NOW()")),
        sa.Column("user_id",    sa.Integer(),  sa.ForeignKey("users.id"), nullable=True),
        sa.Column("role",       sa.String(30), nullable=True),
        sa.Column("action",     sa.String(100),nullable=False),
        sa.Column("resource",   sa.String(100),nullable=True),
        sa.Column("old_value",  JSONB,         nullable=True),
        sa.Column("new_value",  JSONB,         nullable=True),
        sa.Column("ip_address", INET,          nullable=True),
        sa.Column("result",     sa.String(10), nullable=False, server_default="success"),
    )
    op.create_index("idx_audit_ts",   "audit_log", ["timestamp"])
    op.create_index("idx_audit_user", "audit_log", ["user_id"])

    op.create_table("thresholds",
        sa.Column("id",         sa.Integer(),  primary_key=True, autoincrement=True),
        sa.Column("stage",      sa.String(50), nullable=False),
        sa.Column("parameter",  sa.String(100),nullable=False),
        sa.Column("ucl",        sa.Double(),   nullable=True),
        sa.Column("lcl",        sa.Double(),   nullable=True),
        sa.Column("updated_by", sa.Integer(),  sa.ForeignKey("users.id"), nullable=True),
        sa.Column("updated_at", sa.TIMESTAMP(timezone=True), server_default=sa.text("NOW()")),
        sa.UniqueConstraint("stage", "parameter"),
    )


def downgrade() -> None:
    op.drop_table("thresholds")
    op.drop_table("audit_log")
    op.drop_table("manual_entries")
    op.drop_table("alerts")
    op.drop_table("slip_spec_history")
    op.drop_table("slip_daily_record")
    for idx in ["idx_qr_model","idx_qr_result","idx_qr_defect","idx_qr_caster","idx_qr_factory","idx_qr_scanned"]:
        op.drop_index(idx, "fact_qr_scan")
    op.drop_table("fact_qr_scan")
    op.drop_table("users")
    op.drop_table("dim_defect_type")
    op.drop_table("dim_model")
    op.drop_table("dim_gi_inspector")
    op.drop_table("dim_caster")
    op.drop_table("dim_factory")
