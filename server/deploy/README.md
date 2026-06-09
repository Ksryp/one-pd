# SNK MES — Deploy Guide

## Architecture

```
[HiveMQ Cloud] → mqtt-subscriber (systemd) → TimescaleDB :5432
                                              PostgreSQL   :5433
                                                   ↓
                                          FastAPI :8000 (systemd)
                                                   ↓
                                        cloudflared Quick Tunnel
                                                   ↓
                                    https://<random>.trycloudflare.com
                                                   ↓
                               Cloudflare Pages (React frontend)
```

---

## 1. First-time server setup

```bash
# Prerequisites
sudo apt update && sudo apt install -y python3-venv docker.io docker-compose-v2

# Run master install (creates venv, starts DBs, installs all 4 services)
cd ~/one-pd/server
bash deploy/install.sh
```

## 2. Database migration + seed

```bash
cd ~/one-pd/server
venv/bin/alembic upgrade head
venv/bin/python scripts/seed_all.py
```

## 3. Get the Tunnel URL

After `install.sh`, the Quick Tunnel URL appears in the cloudflared logs:

```bash
journalctl -u cloudflared --no-pager | grep trycloudflare
# → https://some-name-here.trycloudflare.com
```

**Important:** This URL changes every time cloudflared restarts. You must update `VITE_API_BASE_URL` in Cloudflare Pages when it changes. For a stable URL, migrate to a Named Tunnel (see `deploy/cloudflared/config.yml.example`).

---

## 4. Cloudflare Pages — connect to GitHub

1. Push `one-pd` repo to GitHub (ensure no secrets in committed files).
2. Open [Cloudflare Dashboard](https://dash.cloudflare.com) → **Pages** → **Create a project** → **Connect to Git**.
3. Select your `one-pd` repository.
4. Build settings:
   - **Framework preset:** Vite
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
5. **Environment variables** (Production):
   | Variable | Value |
   |---|---|
   | `VITE_API_BASE_URL` | `https://<your>.trycloudflare.com` |
   | `VITE_USE_API` | `true` |
6. Click **Save and Deploy**.

Every `git push` to your default branch triggers an automatic redeploy.

---

## 5. Service management

```bash
# Check all services
sudo systemctl status mqtt-subscriber snk-mes-api cloudflared

# View live tunnel URL
journalctl -u cloudflared -f

# Restart API after code change
sudo systemctl restart snk-mes-api

# Restart tunnel (generates new URL — update Pages env var after)
sudo systemctl restart cloudflared
```

---

## 6. Notes

- **qrcode_snk.json (~60MB)** must NOT be committed directly.
  - Use Git LFS: `git lfs track "qrcode_snk.json"` then commit
  - Or keep it outside the repo and run `seed_qr.py` with `--path /absolute/path/to/file`
- WebSocket (`/ws/live`) pushes a DB snapshot every 10 seconds. Cloudflare Tunnel supports WebSocket natively.
- OEE / Takt / WIP / MTTR remain mock data (no live source yet).
