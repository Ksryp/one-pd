#!/bin/bash
set -e

SERVER_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DEPLOY_DIR="$SERVER_DIR/deploy"

echo "=== SNK MES — Full Service Install ==="
echo ""

# ── 1. Python venv + deps ──────────────────────────────────────────
echo "==> [1/6] Installing Python venv..."
python3 -m venv "$SERVER_DIR/venv"
"$SERVER_DIR/venv/bin/pip" install --quiet -r "$SERVER_DIR/requirements.txt"

# ── 2. Docker + containers (TimescaleDB + PostgreSQL) ──────────────
echo "==> [2/6] Enabling Docker and starting DB containers..."
sudo systemctl enable docker
cd /home/surayutp/mqtt-tsdb && docker compose up -d
echo "    Waiting 5s for DBs to be ready..."
sleep 5

# ── 3. MQTT Subscriber service ─────────────────────────────────────
echo "==> [3/6] Installing mqtt-subscriber service..."
MQTT_DIR="/home/surayutp/mqtt-tsdb"

if [ ! -f "$MQTT_DIR/venv/bin/python" ]; then
    python3 -m venv "$MQTT_DIR/venv"
    "$MQTT_DIR/venv/bin/pip" install --quiet -r "$MQTT_DIR/requirements.txt"
fi

sudo cp "$MQTT_DIR/mqtt-subscriber.service" /etc/systemd/system/mqtt-subscriber.service
sudo systemctl enable mqtt-subscriber
sudo systemctl restart mqtt-subscriber

# ── 4. FastAPI service ─────────────────────────────────────────────
echo "==> [4/6] Installing snk-mes-api service..."
sudo cp "$DEPLOY_DIR/systemd/snk-mes-api.service" /etc/systemd/system/snk-mes-api.service
sudo systemctl daemon-reload
sudo systemctl enable snk-mes-api
sudo systemctl restart snk-mes-api

# ── 5. Cloudflare Tunnel (cloudflared) ────────────────────────────
echo "==> [5/6] Installing cloudflared tunnel service..."
if ! command -v cloudflared &>/dev/null; then
    echo "    cloudflared not found — installing..."
    curl -fsSL https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 \
        -o /tmp/cloudflared
    sudo install -m 755 /tmp/cloudflared /usr/local/bin/cloudflared
    rm /tmp/cloudflared
fi
sudo cp "$DEPLOY_DIR/systemd/cloudflared.service" /etc/systemd/system/cloudflared.service
sudo systemctl daemon-reload
sudo systemctl enable cloudflared
sudo systemctl restart cloudflared
echo "    Tunnel URL will appear in: journalctl -u cloudflared -f"
echo "    Copy the https://<random>.trycloudflare.com URL to Cloudflare Pages env var."

# ── 6. Status ──────────────────────────────────────────────────────
echo ""
echo "==> [6/6] Service status:"
echo ""
sudo systemctl status docker          --no-pager -l | grep -E "Active|●"
sudo systemctl status mqtt-subscriber --no-pager -l | grep -E "Active|●"
sudo systemctl status snk-mes-api     --no-pager -l | grep -E "Active|●"
sudo systemctl status cloudflared     --no-pager -l | grep -E "Active|●"

echo ""
echo "=== Done ==="
echo "  TimescaleDB : localhost:5432"
echo "  PostgreSQL  : localhost:5433"
echo "  MQTT sub    : systemctl status mqtt-subscriber"
echo "  API         : http://localhost:8000/health"
echo "  API docs    : http://localhost:8000/docs"
echo "  Tunnel URL  : journalctl -u cloudflared --no-pager | grep trycloudflare"
