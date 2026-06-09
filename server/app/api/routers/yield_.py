from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.session import get_pg_db
from app.crud.production import get_yield
from app.schemas.production import YieldOut

router = APIRouter(prefix="/api", tags=["yield"])


@router.get("/yield", response_model=YieldOut)
def yield_data(
    type: str = Query("clay", pattern="^(clay|firing)$"),
    db: Session = Depends(get_pg_db),
):
    return get_yield(db, type_=type)
