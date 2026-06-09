from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.session import get_tsdb_db
from app.crud.production import get_machine_latest, get_machine_timeseries
from app.schemas.production import MachineLatest, MachineTimeseries, MachinePoint

router = APIRouter(prefix="/api/machine", tags=["machine"])


@router.get("/latest", response_model=MachineLatest | None)
def machine_latest(db: Session = Depends(get_tsdb_db)):
    return get_machine_latest(db)


@router.get("/timeseries", response_model=MachineTimeseries)
def machine_timeseries(
    hours: int = Query(24, ge=1, le=168),
    db: Session = Depends(get_tsdb_db),
):
    points = get_machine_timeseries(db, hours)
    return MachineTimeseries(
        points=[MachinePoint(**p) for p in points],
        has_data=len(points) > 0,
    )
