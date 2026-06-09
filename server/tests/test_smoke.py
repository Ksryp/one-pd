"""Smoke tests — require running DB (PostgreSQL seeded)."""
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health():
    r = client.get("/health")
    assert r.status_code == 200
    assert "status" in r.json()


def test_pipeline():
    r = client.get("/api/pipeline")
    assert r.status_code == 200
    data = r.json()
    assert len(data) == 6
    ids = [s["id"] for s in data]
    assert "slip-prep" in ids
    assert "firing" in ids
    for s in data:
        assert s["status"] in ("NORMAL", "ABNORMAL", "EMERGENCY", "MAINTENANCE")


def test_overview():
    r = client.get("/api/overview")
    assert r.status_code == 200
    d = r.json()
    assert "oee" in d and "takt" in d and "wip" in d and "mttr" in d


def test_notifications():
    r = client.get("/api/notifications")
    assert r.status_code == 200
    assert isinstance(r.json(), list)


def test_yield_clay():
    r = client.get("/api/yield?type=clay")
    assert r.status_code == 200
    d = r.json()
    assert d["title"] == "CLAY YIELD"
    assert 0 <= d["value"] <= 100
    assert len(d["segments"]) == 3


def test_yield_firing():
    r = client.get("/api/yield?type=firing")
    assert r.status_code == 200
    assert r.json()["title"] == "FIRING YIELD"


def test_metrics():
    r = client.get("/api/metrics")
    assert r.status_code == 200
    d = r.json()
    assert "slipIn" in d and "slipYield" in d and "warehouseIn" in d
