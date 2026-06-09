from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_pg_db
from app.crud.production import get_metrics
from app.schemas.production import MetricsOut

router = APIRouter(prefix="/api", tags=["metrics"])


@router.get("/metrics", response_model=MetricsOut)
def metrics(db: Session = Depends(get_pg_db)):
    return get_metrics(db)
