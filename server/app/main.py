from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.routers import health, pipeline, overview, notifications, yield_, metrics, ws, machine, alerts_mgmt, defect_chart

app = FastAPI(
    title="SNK MES API",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_list,
    allow_origin_regex=r"https://.*\.(pages|workers)\.dev|https://.*\.serveousercontent\.com",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(pipeline.router)
app.include_router(overview.router)
app.include_router(notifications.router)
app.include_router(yield_.router)
app.include_router(metrics.router)
app.include_router(ws.router)
app.include_router(machine.router)
app.include_router(alerts_mgmt.router)
app.include_router(defect_chart.router)
