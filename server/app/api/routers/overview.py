from fastapi import APIRouter
from app.schemas.production import Overview

router = APIRouter(prefix="/api", tags=["overview"])

_MOCK_OVERVIEW = {
    "oee": {
        "value": 78, "availability": 82, "performance": 74, "quality": 81,
        "timeStart": "07:30", "timeEnd": "16:30",
        "timeline": [
            {"time": "07:30", "status": "NORMAL"},
            {"time": "08:30", "status": "NORMAL"},
            {"time": "09:30", "status": "NORMAL"},
            {"time": "10:30", "status": "ABNORMAL"},
            {"time": "11:30", "status": "EMERGENCY"},
            {"time": "12:30", "status": "NORMAL"},
            {"time": "13:30", "status": "ABNORMAL"},
            {"time": "14:30", "status": "NORMAL"},
            {"time": "15:30", "status": "NORMAL"},
        ],
    },
    "takt":  {"taktTime": 42, "cycleTime": 38, "unit": "s/pcs"},
    "wip":   {"value": 1840, "max": 2000, "hotStage": "casting"},
    "mttr":  {"value": 24, "target": 30, "incidents": 3, "unit": "min"},
}


@router.get("/overview", response_model=Overview)
def overview():
    # OEE / Takt / WIP / MTTR remain mock until sensor data is available
    return _MOCK_OVERVIEW
