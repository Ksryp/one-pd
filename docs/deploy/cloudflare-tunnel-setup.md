# คู่มือติดตั้ง Cloudflare Tunnel — SNK MES API

> เอกสารนี้อธิบายวิธีเปิด FastAPI backend บนเครื่อง factory ให้เข้าถึงได้จากอินเทอร์เน็ต
> ผ่าน Cloudflare Tunnel โดยไม่ต้องเปิด port บน router/firewall

---

## สารบัญ

1. [Linux (Ubuntu/Debian)](#1-linux-ubuntudebian)
2. [Windows](#2-windows)
3. [ตั้งค่า config.yml](#3-ตั้งค่า-configyml)
4. [ติดตั้งเป็น System Service](#4-ติดตั้งเป็น-system-service)
5. [ตั้งค่า Frontend ให้ชี้ไป Tunnel](#5-ตั้งค่า-frontend-ให้ชี้ไป-tunnel)
6. [ตรวจสอบและแก้ไขปัญหา](#6-ตรวจสอบและแก้ไขปัญหา)

---

## 1. Linux (Ubuntu/Debian)

### 1.1 ติดตั้ง cloudflared

```bash
# ดาวน์โหลด binary
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 \
     -o /usr/local/bin/cloudflared

# ให้สิทธิ์รันได้
chmod +x /usr/local/bin/cloudflared

# ตรวจสอบเวอร์ชัน
cloudflared --version
```

### 1.2 Login เข้า Cloudflare

```bash
cloudflared tunnel login
# เบราว์เซอร์จะเปิดขึ้น → เลือก domain ที่ต้องการ → Authorize
# ไฟล์ certificate จะถูกบันทึกที่: ~/.cloudflared/cert.pem
```

### 1.3 สร้าง Tunnel

```bash
cloudflared tunnel create snk-api
# จะได้ TUNNEL_ID (UUID) เช่น: 550e8400-e29b-41d4-a716-446655440000
# ไฟล์ credentials: ~/.cloudflared/<TUNNEL_ID>.json
```

### 1.4 ผูก DNS กับ Tunnel

```bash
# ถ้ามี custom domain (เช่น api.snk-mes.com)
cloudflared tunnel route dns snk-api api.snk-mes.com

# ถ้าใช้ trycloudflare (ทดสอบเท่านั้น — URL เปลี่ยนทุกครั้งที่ restart)
# ไม่ต้องทำขั้นตอนนี้ — ดูส่วน "Quick Tunnel" ด้านล่าง
```

---

## 2. Windows

### 2.1 ติดตั้ง cloudflared

1. ดาวน์โหลด installer จาก:
   `https://github.com/cloudflare/cloudflared/releases/latest`
   → เลือก `cloudflared-windows-amd64.msi`

2. รัน `.msi` installer → Next → Install

3. เปิด **Command Prompt as Administrator** แล้วตรวจสอบ:
   ```cmd
   cloudflared --version
   ```

### 2.2 Login และสร้าง Tunnel (Windows)

เปิด **Command Prompt as Administrator**:

```cmd
cloudflared tunnel login
cloudflared tunnel create snk-api
cloudflared tunnel route dns snk-api api.snk-mes.com
```

ไฟล์ credentials อยู่ที่: `C:\Users\<username>\.cloudflared\<TUNNEL_ID>.json`

---

## 3. ตั้งค่า config.yml

### Linux path: `~/.cloudflared/config.yml`
### Windows path: `C:\Users\<username>\.cloudflared\config.yml`

```yaml
tunnel: <TUNNEL_ID>
credentials-file: /root/.cloudflared/<TUNNEL_ID>.json

ingress:
  # FastAPI backend
  - hostname: api.snk-mes.com
    service: http://localhost:8000
  # Catch-all (ต้องมีเสมอ)
  - service: http_status:404
```

> **Windows** — เปลี่ยน `credentials-file` เป็น:
> ```yaml
> credentials-file: C:\Users\<username>\.cloudflared\<TUNNEL_ID>.json
> ```

### ทดสอบ config ก่อน deploy

```bash
# Linux
cloudflared tunnel --config ~/.cloudflared/config.yml run snk-api

# Windows
cloudflared tunnel --config C:\Users\<username>\.cloudflared\config.yml run snk-api
```

เปิด `https://api.snk-mes.com/health` ในเบราว์เซอร์ — ควรได้ `{"status":"ok"}`

---

## 4. ติดตั้งเป็น System Service

### Linux (systemd)

```bash
# ติดตั้ง service (ต้องรันในฐานะ root)
sudo cloudflared service install

# เริ่ม service
sudo systemctl start cloudflared

# เปิดใช้งานเมื่อ boot
sudo systemctl enable cloudflared

# ตรวจสอบสถานะ
sudo systemctl status cloudflared

# ดู logs
sudo journalctl -u cloudflared -f
```

### Windows (Service)

เปิด **Command Prompt as Administrator**:

```cmd
cloudflared service install
```

จากนั้นเปิด **Services** (`services.msc`) → หา "Cloudflare Tunnel" → Start

หรือผ่าน command:
```cmd
sc start cloudflared
```

---

## 5. ตั้งค่า Frontend ให้ชี้ไป Tunnel

### 5.1 Cloudflare Pages (Production)

ไปที่ **Cloudflare Pages Dashboard** → โปรเจค `one-pd` →
**Settings** → **Environment variables** → เพิ่ม:

| Variable | Value | Environment |
|---|---|---|
| `VITE_API_BASE_URL` | `https://api.snk-mes.com` | Production |
| `VITE_API_BASE_URL` | `https://api.snk-mes.com` | Preview |

แล้ว **Redeploy** จาก latest deployment

### 5.2 Local Development

แก้ไข `.env.local` ที่ root ของโปรเจค:

```bash
# ใช้ localhost โดยตรง (Vite proxy จัดการ /api/*)
VITE_API_BASE_URL=http://localhost:8000
```

---

## 6. ตรวจสอบและแก้ไขปัญหา

### ตรวจสอบ Tunnel ทำงานหรือไม่

```bash
# ดูรายการ tunnel ทั้งหมด
cloudflared tunnel list

# ดูสถานะ connections
cloudflared tunnel info snk-api
```

### CORS Error ใน Browser

ตรวจสอบไฟล์ `server/app/core/config.py` ว่ามี domain ของ Cloudflare Pages อยู่ใน CORS:

```python
CORS_ORIGINS = [
    "https://one-pd.pages.dev",
    "https://api.snk-mes.com",
    "http://localhost:5173",
]
```

หลังแก้ไข restart Gunicorn:
```bash
kill -HUP $(cat /tmp/gunicorn.pid)
# หรือ
sudo systemctl restart snk-api
```

### Quick Tunnel (ทดสอบเร็ว ไม่ต้องมี domain)

```bash
# รันครั้งเดียว — URL ใหม่ทุกครั้ง เหมาะสำหรับ demo เท่านั้น
cloudflared tunnel --url http://localhost:8000
```

จะได้ URL เช่น `https://random-name.trycloudflare.com`
นำไปใส่ใน Cloudflare Pages Environment variable ได้เลย

---

## สรุปขั้นตอนด่วน

```
1. ติดตั้ง cloudflared
2. cloudflared tunnel login
3. cloudflared tunnel create snk-api
4. แก้ไข ~/.cloudflared/config.yml
5. ทดสอบ: cloudflared tunnel run snk-api
6. sudo cloudflared service install && sudo systemctl start cloudflared
7. ตั้ง VITE_API_BASE_URL ใน Cloudflare Pages
8. Redeploy frontend
```
