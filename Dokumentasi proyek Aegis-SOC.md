DOKUMENTASI TEKNIS PROYEK AEGIS UNIFIED IPS SOC v4.2 PRO
Kartika Cyber Hackathon 2026 — Defensive Shield Category

---

1. DOKUMEN ARSITEKTUR & DESKRIPSI SISTEM

1.1 Identitas & Ringkasan Eksekutif
    - Nama Sistem: AEGIS UNIFIED IPS SOC v4.2 PRO
    - Live Demo URL: https://aegis-ips-soc.onrender.com/
    - Sub-Sistem: Integrated NIPS / HIPS / WIPS / NBA & AI Intelligence Proxy Engine
    - Penyedia AI Lokal: Ollama v0.24.0 (Model: `qwen2.5:1.5b` / `llama3` / `mistral` / `deepseek-r1`)
    - Penyedia AI Copilot Cloud: Groq Cloud API (`llama-3.3-70b-versatile`)
    - Pernyataan Misi: Menyediakan platform pencegahan gangguan siber terpadu (Intrusion Prevention System) untuk mengamankan infrastruktur teknologi informasi dan operasional (IT/OT) satuan TNI AD dari ancaman terdistribusi, ransomware, eksfiltrasi data, dan eksploitasi Zero-Day.

---

1.2 Topologi & Alur Data (AI Intelligence Proxy Pipeline Flow)
AEGIS menempatkan lapisan AI Intelligence Proxy secara terintegrasi dalam alur pemrosesan trafik jaringan:

```text
[ ANCAMAN EKSTERNAL / WAN ]
           │
           ▼
[ Hardware Firewall (Layer 3 / Layer 4) ]
   (Penyaringan Port & IP Blacklist Statis)
           │
           ▼
[ AI INTELLIGENCE PROXY / LAYER ] ─── (Analisis Semantik LLM & DPI Heuristics)
           │
 ┌─────────┴────────────────────────┐
 ▼                                  ▼
[ Trafik Bersih / Normal ]    [ Anomali / Zero-Day High Risk (>85%) ]
 │                                  │
 ▼                                  ▼
[ Modul Utama IPS ]            [ AUTOMATED QUARANTINE ENCLAVE ]
 ├── 1. NIPS (Network Inline)        ├── Isolasi Jaringan (Net Severance)
 ├── 2. HIPS (Endpoint Agent)        ├── Termination Process PID
 ├── 3. WIPS (RF Spectrum Sensor)    └── Air-Gapped Sandbox
 └── 4. NBA (Behavior Heuristic)
```

---

2. MODUL FUNGSI DAN SPESIFIKASI FITUR COMPREHENSIVE

| Nama Modul / Fitur | Jenis Enclave | Spesifikasi & Deskripsi Operasional | Indikator Kunci (KPI) |
| :--- | :---: | :--- | :--- |
| SOC Overview | Control Center | Dashboard utama penyaji metrik real-time, panel simulator serangan interaktif, dan grafik distribusi mitigasi. | Events/sec, Threats Blocked, Quarantine Count, Health %. |
| Network Topology | Architecture Map | Visualisasi peta pipeline lalu lintas paket dari WAN hingga titik karantina otomatis. | Pipeline status, Node Inspector details. |
| 1. NIPS (Network) | Inline DPI | Inspeksi paket terdalam secara inline untuk menjatuhkan (drop) trafik DDoS, SYN Flood, dan OWASP Top-10. | Throughput (45.2k pps), Packet Drops (1,240), Latency (0.42ms). |
| 2. HIPS (Host) | Endpoint Agent | Pemantauan system call kernel OS, integritas file sistem (FIM), dan isolasi otomatis PID proses ransomware. | PIDs Monitored (312), System Calls (Secured), Isolated PIDs. |
| 3. WIPS (Wireless) | RF Sensor | Pemantauan spektrum gelombang radio 2.4/5.0 GHz untuk menumpas Rogue AP dan Evil Twin ber-SSID palsu via deautentikasi. | Rogue APs Flagged (2), Deauth Defense (Active), AP Count (24). |
| 4. NBA (Behavior) | Heuristic AI | Analisis perilaku anomali NetFlow untuk mendeteksi baseline deviation dan eksfiltrasi rahasia via DNS Tunneling. | Anomaly Score (24/100), Baseline Deviation (+1.2%), Entropy Shield. |
| AI Proxy & DPI Engine| LLM Inspector | Pemrosesan semantik payload paket mentah (raw packet payload) menggunakan Ollama LLM lokal untuk memprediksi serangan Zero-Day. | Model Selector (`llama3`, `qwen2.5`), Preset Injector, Heuristic Risk %. |
| Quarantine Enclave | Isolation Enclave | Ruang isolasi Zero-Trust yang memutus jaringan host terinfeksi secara fisik/logis dengan fasilitas pelepas (Release). | Isolated Hosts (5), Hostname, IP/MAC, PID/Target, Isolation Reason. |
| Active Prevention Rules| Policy Engine | Pusat konfigurasi kebijakan penindakan otomatis (DROP_INLINE, QUARANTINE_HOST, DEAUTH_AP, AI_SANDBOX). | Rule Code, Enforcement Action, Total Hits, Arm Status (ARMED). |
| Real-Time Threat Feed | Audit Stream | Ringkasan log streaming aktivitas ancaman dengan kemampuan pencarian cerdas dan ekspor laporan audit. | Timestamp, Vector, DPI Heuristics, Status, Action inspect. |
| SOC Copilot (Groq) | AI Assistant | Widget asisten kecerdasan buatan berbasis Groq API untuk membantu operator SOC menganalisis insiden siber 24/7. | Floating Widget, Real-time Querying, Remediation Advice. |

---

3. PANDUAN DEPLOYMENT FISIK (HARDWARE & EDGE APPLIANCE SATUAN)

Untuk mengimplementasikan AEGIS pada lingkungan satuan pertahanan (On-Premise / Air-Gapped Environment):

3.1 Spesifikasi Perangkat Keras Mandiri (Aegis Tactical Security Node)
    - Form Factor: 1U Rackmount Server atau Rugged Industrial Mini PC.
    - CPU: Intel Core i7 / Xeon E-Series (Minimal 8 Core, mendukung instruksi AVX2/AVX-512).
    - RAM: 32 GB DDR4/DDR5 ECC RAM.
    - Storage: 512 GB NVMe SSD (High Endurance for Log Retention & Local Model Cache).
    - Network Interface Card (NIC): 4x 1GbE / 10GbE Ports (Dedicated Bypass NIC for Inline NIPS).

3.2 Langkah Instalasi Sistem di Satuan
1. Persiapan Sistem Operasi: Instalasi Ubuntu Server 22.04 LTS atau Rocky Linux 9.
2. Pemasangan Engine AI Lokal (Ollama):
   ```bash
   curl -fsSL https://ollama.com/install.sh | sh
   ollama pull qwen2.5:1.5b
   ```
3. Kloning & Eksekusi Backend FastAPI:
   ```bash
   cd /opt/UnifiedIPSSOC/backend
   python3 -m venv venv
   source venv/bin/activate
   pip install --only-binary=:all: -r requirements.txt
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```
4. Eksekusi Dashboard Frontend:
   ```bash
   cd /opt/UnifiedIPSSOC/frontend
   python3 -m http.server 3000
   ```