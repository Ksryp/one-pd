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
class SlipInItem(BaseModel):
    pieces: int
    kg: float

class SlipYieldItem(BaseModel):
    value: float
    target: float

class MetricsOut(BaseModel):
    slipIn: SlipInItem
    slipYield: SlipYieldItem
    warehouseIn: SlipInItem


# ── Defect summary ────────────────────────────────────────────────────────────
class DefectItem(BaseModel):
    type: str
    count: int

class DefectSummary(BaseModel):
    items: list[DefectItem]
    days: int


# ── Machine data ──────────────────────────────────────────────────────────────
class MachineLatest(BaseModel):
    time: str | None
    MCRIM: float | None
    MCENG: float | None
    MCSKR: float | None
    MAP: float | None
    VolST: float | None
    STemp: float | None
    WTemp: float | None
    CT_AVG_Cur: float | None
    CT_MC_Cur: float | None
    ClayGood: float | None

class MachinePoint(BaseModel):
    hour: str
    viscosity: float | None
    viscosity_v30: float | None
    temperature: float | None
    moisture: float | None
    mcrim: float | None
    mceng: float | None
    map_val: float | None
    samples: int

class MachineTimeseries(BaseModel):
    points: list[MachinePoint]
    has_data: bool
