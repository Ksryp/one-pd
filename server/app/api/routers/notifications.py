from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.session import get_pg_db
from app.crud.production import get_notifications
from app.schemas.production import NotificationOut

router = APIRouter(prefix="/api", tags=["notifications"])


@router.get("/notifications", response_model=list[NotificationOut])
def notifications(
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_pg_db),
):
    return get_notifications(db, limit=limit)
