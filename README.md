# QlipZync (QuickClick) - Autonomous Zero-Storage SaaS Platform v7.0.0

[![CI & Build Test](https://github.com/sh00trsTv/qlipzync/actions/workflows/ci.yml/badge.svg)](https://github.com/sh00trsTv/qlipzync/actions)
[![Deploy to Cloud Run](https://github.com/sh00trsTv/qlipzync/actions/workflows/google-cloudrun-docker.yml/badge.svg)](https://github.com/sh00trsTv/qlipzync/actions)
[![Repository](https://img.shields.io/badge/GitHub-sh00trsTv%2Fqlipzync-blue.svg)](https://github.com/sh00trsTv/qlipzync)
[![License](https://img.shields.io/badge/license-UNLICENSED-purple.svg)](https://github.com/sh00trsTv/qlipzync)

Autonome, produktionsreife Cloud-Pipeline für Content Creator und Streamer mit **Zero-Storage RAM-Doktrin (0 MB persistenter Disk-Footprint)**, automatisierter Multichannel-Distribution und Echtzeit-Logging.

**Offizielles GitHub-Repository:** [https://github.com/sh00trsTv/qlipzync](https://github.com/sh00trsTv/qlipzync)

---

## 🌟 Erweiterte 7-Stufen-Pipeline-Architektur

1. **Stufe 1: Online Live-Einladungslink-Verteiler (`stream.online`)**
   - Automatische Generierung und Verteilung des Live-Streams an Social Channels (X/Twitter, Telegram, Discord Webhooks) und Bot-Netzwerke unmittelbar nach Stream-Start.
2. **Stufe 2: 10-Minuten-Intervall Stream-Metriken**
   - Kontinuierliche Übertragung aktueller Stream-Kennzahlen (Viewer Count, Kategorie/Spiel, Uptime, Titel) an konfigurierte Discord & Telegram Bots im 10-Minuten-Takt.
3. **Stufe 3: 15-Minuten-Reminder**
   - Zeitgesteuertes Follow-up-Posting 15 Minuten nach Go-Live zur Maximierung der Reichweite.
4. **Stufe 4: Stream-Ende Verabschiedung (`stream.offline`)**
   - Automatischer Abschieds-Broadcast an Community-Bots bei Empfang des Twitch-Offline-Signals.
5. **Stufe 5: 5-Minuten-Cooldown & In-Memory RAM-Clip-Verarbeitung**
   - 300 Sekunden Pufferzeit via Cloud Tasks / Timer zur Bereitstellung der Twitch-VODs.
   - Flüchtige Verarbeitung im Linux Shared Memory (`/dev/shm`): Smart 9:16 Cropping via FFmpeg und KI-Transkription/Viralitäts-Scoring mit Gemini 2.5 Flash ohne Speicherung auf Festplatte.
6. **Stufe 6: Omni-Posting Social Media Distribution**
   - Automatisierte Veröffentlichung der generierten Highlights auf TikTok, YouTube Shorts, Instagram Reels und X/Twitter.
7. **Stufe 7: Google Sheets Audit Trail & Beitrags-URL-Logging**
   - Lückenloses Echtzeit-Logging aller System-Events, generierten Post-URLs und Verarbeitungsmetriken in Google Sheets (API v4).

---

## ⚙️ Plattformübergreifende Einstellungen & Produktionsparameter

### 1. Google Cloud Platform (GCP)
| Parameter | Produktionswert |
|---|---|
| **GCP-Projekt-ID** | `qlipzync` |
| **GCP-Projektnummer** | `248792984033` |
| **Primäre Region** | `europe-west3` (Frankfurt am Main) |
| **Cloud Run Service** | `quickclick-app` |
| **Port-Bindung** | Port `3000` |
| **Service Account** | `qlipzync-runner@qlipzync.iam.gserviceaccount.com` |

### 2. Firebase & Firestore
| Parameter | Produktionswert |
|---|---|
| **Firestore Database ID** | `ai-studio-quickclick-003fd948-cf64-489f-9030-863f460c6c91` |
| **Firebase App ID** | `1:248792984033:web:3c55dbd341eb24f6300aa0` |
| **Measurement ID** | `G-X5B6GPCF8H` |
| **Storage Bucket** | `qlipzync.firebasestorage.app` |
| **Auth Domain** | `qlipzync.firebaseapp.com` |

### 3. Benutzer-Rollen & Gatekeeper (Zero Trust)
| Rolle / Nutzer | E-Mail | Berechtigungen |
|---|---|---|
| **Master-Administrator** | `robert.f.telekom@gmail.com` | Unbeschränkter Vollzugriff, Admin-Privilegien |
| **Titan Lifetime VIP** | `sh00trs.tv@gmail.com` | 0 € Lifetime Titan-Plan, 600 Clips/Monat |
| **Titan Lifetime VIP** | `twoandahalfeafc@gmail.com` | 0 € Lifetime Titan-Plan, 600 Clips/Monat |
| **Standard-Nutzer** | Reguläre Accounts | Stripe-Abo zwingend vor Kanalverknüpfungen (Twitch, YouTube, TikTok) |

---

## 📡 API-Endpunkte

| Endpunkt | Methode | Beschreibung |
|---|---|---|
| `/health` & `/api/health` | `GET` | Health-Check mit Uptime, Region & Zero-Storage-Status |
| `/config/public` & `/api/config/public` | `GET` | Öffentliche Firebase- und Service-Konfiguration |
| `/api/v1/pipeline/trigger` | `POST` | Manueller oder Webhook-basierter Pipeline-Trigger |

---

## 🛡️ Zero-Storage RAM-Doktrin
- **0 MB Disk Retention**: Zu keinem Zeitpunkt werden Videodateien auf Persistent Disks oder Cloud Buckets gespeichert.
- **Flüchtiger Speicher (`/dev/shm`)**: Transcodierung und Pufferung erfolgen ausschließlich im RAM.
- **Cleanup-Garantie**: Puffer werden im `finally`-Block sofort freigegeben.

---

## 🚀 Installation & Repository-Setup

```bash
# 1. Repository klonen
git clone https://github.com/sh00trsTv/qlipzync.git
cd qlipzync

# 2. Abhängigkeiten installieren
npm install --legacy-peer-deps

# 3. Frontend & TypeScript kompilieren
npm run build

# 4. Dev-Server starten (Port 3000)
npm run dev

# 5. Production Start
npm run start
```
