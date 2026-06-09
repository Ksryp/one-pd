from datetime import datetime
from typing import Any
from pydantic import BaseModel


# ── Pipeline ──────────────────────────────────────────────────────────────────
class StageCard(BaseModel):
    id: str
    label: str
    status: str
    timestamp: str


# ── Overview (mock) ───────────────────────────────────────────────────────────
class TimelinePoint(BaseModel):
    time: str
    status: str

class OEE(BaseModel):
    value: float
    availability: float
    performance: float
    quality: float
    timeStart: str
    timeEnd: str
    timeline: list[TimelinePoint]

class Takt(BaseModel):
    taktTime: float
    cycleTime: float
    unit: str

class WIP(BaseModel):
    value: int
    max: int
    hotStage: str

class MTTR(BaseModel):
    value: float
    target: float
    incidents: int
    unit: str

class Overview(BaseModel):
    oee: OEE
    takt: Takt
    wip: WIP
    mttr: MTTR


# ── Notifications / Alerts ────────────────────────────────────────────────────
class NotificationOut(BaseModel):
    id: int
    title: str
    level: str
    message: str | None
    timestamp: str
    resolved: bool
    stage: str

    class Config:
        from_attributes = True


# ── Yield ─────────────────────────────────────────────────────────────────────
class YieldSegment(BaseModel):
    label: str
    value: int
    color: str

class YieldOut(BaseModel):
    title: str
    value: float
    segments: list[YieldSegment]
    target: float


# ── Metrics ───────────────────────────────────────────────────────────────────
class MetricItem(BaseModel):
    value: float
    unit: str

class MetricsOut(BaseModel):
    slipIn: MetricItem
    slipYield: MetricItem
    warehouseIn: MetricItem
