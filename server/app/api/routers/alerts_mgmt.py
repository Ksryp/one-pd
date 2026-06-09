from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_pg_db
from app.crud.production import resolve_alert, get_defect_summary
from app.schemas.production import DefectSummary, DefectItem

router = APIRouter(prefix="/api", tags=["alerts"])


@router.patch("/alerts/{alert_id}/resolve")
def resolve(alert_id: int, db: Session = Depends(get_pg_db)):
    ok = resolve_alert(db, alert_id)
    if not ok:
        raise HTTPException(404, detail="Alert not found or already resolved")
    return {"ok": True, "id": alert_id}


@router.get("/defects/summary", response_model=DefectSummary)
def defect_summary(days: int = 30, db: Session = Depends(get_pg_db)):
    items = get_defect_summary(db, days)
    return DefectSummary(
        items=[DefectItem(**i) for i in items],
        days=days,
    )
