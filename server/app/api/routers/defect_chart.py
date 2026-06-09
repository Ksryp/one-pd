from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.session import get_pg_db, get_tsdb_db
from app.crud.production import (
    get_defect_chart, get_defect_insights,
    get_meta_models, get_meta_defect_types,
)

router = APIRouter(tags=["defect-chart"])


@router.get("/api/defects/chart")
def defect_chart(
    startDate:  str           = Query(...),
    endDate:    str           = Query(...),
    view:       str           = Query("day"),
    defect:     str           = Query("all"),
    model:      str           = Query("All"),
    parameter:  str           = Query("viscosity_v0"),
    pg_db:      Session       = Depends(get_pg_db),
    tsdb_db:    Session       = Depends(get_tsdb_db),
):
    model_names = None if model.strip().lower() == "all" else [m.strip() for m in model.split(",") if m.strip()]
    param_list  = [p.strip() for p in parameter.split(",") if p.strip()]
    defect_code = None if defect.strip().lower() == "all" else defect.strip()

    return get_defect_chart(pg_db, tsdb_db, view, startDate, endDate, defect_code, model_names, param_list)


@router.get("/api/defects/insights")
def defect_insights(
    startDate: str     = Query(...),
    endDate:   str     = Query(...),
    defect:    str     = Query("all"),
    model:     str     = Query("All"),
    pg_db:     Session = Depends(get_pg_db),
):
    model_names = None if model.strip().lower() == "all" else [m.strip() for m in model.split(",") if m.strip()]
    defect_code = None if defect.strip().lower() == "all" else defect.strip()
    return get_defect_insights(pg_db, startDate, endDate, defect_code, model_names)


@router.get("/api/meta/models")
def meta_models(pg_db: Session = Depends(get_pg_db)):
    return get_meta_models(pg_db)


@router.get("/api/meta/defect-types")
def meta_defect_types(pg_db: Session = Depends(get_pg_db)):
    return get_meta_defect_types(pg_db)
