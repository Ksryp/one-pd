import asyncio
import json
from datetime import datetime, timezone
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from sqlalchemy import text
from app.db.session import pg_engine

router = APIRouter(tags=["ws"])


def _snapshot() -> dict:
    with pg_engine.connect() as conn:
        alert_count = conn.execute(
            text("SELECT COUNT(*) FROM alerts WHERE resolved = false")
        ).scalar() or 0

        rows = conn.execute(text("""
            SELECT DISTINCT ON (stage) stage, level, created_at
            FROM alerts
            WHERE resolved = false
            ORDER BY stage, created_at DESC
        """)).fetchall()

    pipeline = [
        {
            "id": r.stage,
            "status": r.level,
            "timestamp": r.created_at.isoformat() if r.created_at else None,
        }
        for r in rows
    ]
    return {
        "type": "snapshot",
        "ts": datetime.now(timezone.utc).isoformat(),
        "alert_count": alert_count,
        "pipeline": pipeline,
    }


@router.websocket("/ws/live")
async def ws_live(websocket: WebSocket):
    await websocket.accept()
    loop = asyncio.get_running_loop()
    try:
        while True:
            try:
                data = await loop.run_in_executor(None, _snapshot)
                await websocket.send_text(json.dumps(data))
            except Exception:
                pass
            await asyncio.sleep(10)
    except WebSocketDisconnect:
        pass
