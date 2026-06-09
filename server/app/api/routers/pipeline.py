from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_pg_db
from app.crud.production import get_pipeline
from app.schemas.production import StageCard

router = APIRouter(prefix="/api", tags=["pipeline"])


@router.get("/pipeline", response_model=list[StageCard])
def pipeline(db: Session = Depends(get_pg_db)):
    return get_pipeline(db)
