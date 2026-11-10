import React from 'react';
import {
  Network,
  Server,
  Wifi,
  LineChart,
  ShieldAlert,
  CheckCircle,
  AlertTriangle,
  Radio,
  Sliders,
  Terminal,
  Activity,
  Zap,
} from 'lucide-react';
import { IPSModuleType, MetricTelemetry } from '../types/cyber';

interface ModuleDetailsTabProps {
  module: IPSModuleType;
  metrics: MetricTelemetry;
  onTriggerAttack: (type: any) => void;
}

export const ModuleDetailsTab: React.FC<ModuleDetailsTabProps> = ({
  module,
  metrics,
  onTriggerAttack,
}) => {
  return (
    <div className="space-y-5">
      {module === 'NIPS' && (
        <div className="bg-[#0b1220]/95 border border-cyan-500/30 rounded-xl p-5 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-400">
                <Network className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-100 font-mono-code">
                    1. NIPS (Network Intrusion Prevention System)
                  </h3>
                  <span className="text-[10px] font-mono-code font-bold px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500 text-cyan-300">
                    INLINE
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real-time deep wire inspection intercepting packets between Hardware Firewall and server enclaves.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono-code text-cyan-400 px-3 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30">
                Throughput: {(metrics.nipsThroughput / 1000).toFixed(1)}k pps
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3 font-mono-code text-xs">
              <span className="text-slate-400 block mb-1">Packet Drop Counter</span>
              <span className="text-2xl font-bold text-rose-400">{metrics.nipsPacketDrops.toLocaleString()}</span>
              <span className="text-[10px] text-slate-500 block mt-1">Malicious payloads dropped inline</span>
            </div>
            <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3 font-mono-code text-xs">
              <span className="text-slate-400 block mb-1">Inline Rules Armed</span>
              <span className="text-2xl font-bold text-emerald-400">3 / 3 Active</span>
              <span className="text-[10px] text-emerald-500 block mt-1">Zero latency bypass policy</span>
            </div>
            <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3 font-mono-code text-xs">
              <span className="text-slate-400 block mb-1">Average Latency</span>
              <span className="text-2xl font-bold text-cyan-400">0.42 ms</span>
              <span className="text-[10px] text-slate-500 block mt-1">Hardware FPGA accelerated</span>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 font-mono-code text-xs space-y-2">
            <h4 className="text-slate-200 font-bold mb-2">Network Layer Inline Rules:</h4>
            <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
              <span className="text-cyan-300">RULE-101: TCP SYN Flood Volumetric Suppression</span>
              <span className="text-emerald-400 font-semibold">ENFORCING</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
              <span className="text-cyan-300">RULE-106: SQL Injection & OWASP Top-10 Ingress Stripper</span>
              <span className="text-emerald-400 font-semibold">ENFORCING</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
              <span className="text-cyan-300">RULE-108: ICMP Flood & Fragmented IP Header Dropper</span>
              <span className="text-emerald-400 font-semibold">ENFORCING</span>
            </div>
          </div>
        </div>
      )}

      {module === 'HIPS' && (
        <div className="bg-[#0b1220]/95 border border-amber-500/30 rounded-xl p-5 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-400">
                <Server className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-100 font-mono-code">
                    2. HIPS (Host Intrusion Prevention System)
                  </h3>
                  <span className="text-[10px] font-mono-code font-bold px-2 py-0.5 rounded bg-amber-950 border border-amber-500 text-amber-300">
                    AGENT
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Endpoint kernel driver monitoring system calls, shadow copy preservation, and process memory integrity.
                </p>
              </div>
            </div>

            <span className="text-xs font-mono-code text-amber-400 px-3 py-1.5 rounded-lg bg-amber-950/40 border border-amber-500/30">
              PIDs Monitored: {metrics.hipsMonitoredPids}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3 font-mono-code text-xs">
              <span className="text-slate-400 block mb-1">System Calls Guard</span>
              <span className="text-2xl font-bold text-emerald-400">Secured</span>
              <span className="text-[10px] text-slate-500 block mt-1">Kernel API hook active</span>
            </div>
            <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3 font-mono-code text-xs">
              <span className="text-slate-400 block mb-1">Isolated PIDs</span>
              <span className="text-2xl font-bold text-amber-400">{metrics.hipsIsolatedPids} Active</span>
              <span className="text-[10px] text-amber-500 block mt-1">Terminated and cordoned</span>
            </div>
            <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3 font-mono-code text-xs">
              <span className="text-slate-400 block mb-1">Ransomware Traps</span>
              <span className="text-2xl font-bold text-emerald-400">Armored</span>
              <span className="text-[10px] text-slate-500 block mt-1">Canary decoy files untouched</span>
            </div>
          </div>
        </div>
      )}

      {module === 'WIPS' && (
        <div className="bg-[#0b1220]/95 border border-yellow-500/30 rounded-xl p-5 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-yellow-950/60 border border-yellow-500/40 text-yellow-400">
                <Wifi className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-100 font-mono-code">
                    3. WIPS (Wireless Intrusion Prevention System)
                  </h3>
                  <span className="text-[10px] font-mono-code font-bold px-2 py-0.5 rounded bg-yellow-950 border border-yellow-500 text-yellow-300">
                    RF SENSOR
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Over-the-air 802.11 spectrum monitors catching rogue access points, evil twin clones, and deauth floods.
                </p>
              </div>
            </div>

            <span className="text-xs font-mono-code text-yellow-400 px-3 py-1.5 rounded-lg bg-yellow-950/40 border border-yellow-500/30">
              RF Sensors: {metrics.wipsMonitoredAps} APs
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3 font-mono-code text-xs">
              <span className="text-slate-400 block mb-1">Rogue APs Flagged</span>
              <span className="text-2xl font-bold text-yellow-400">{metrics.wipsRogueAps} Flagged</span>
              <span className="text-[10px] text-slate-500 block mt-1">SSID spoofing quarantined</span>
            </div>
            <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3 font-mono-code text-xs">
              <span className="text-slate-400 block mb-1">Deauth Defense</span>
              <span className="text-2xl font-bold text-emerald-400">Enabled</span>
              <span className="text-[10px] text-emerald-500 block mt-1">802.11w Protected Frames</span>
            </div>
            <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3 font-mono-code text-xs">
              <span className="text-slate-400 block mb-1">Spectrum Channels</span>
              <span className="text-2xl font-bold text-cyan-400">2.4 / 5.0 GHz</span>
              <span className="text-[10px] text-slate-500 block mt-1">Continuous spectrum sweep</span>
            </div>
          </div>
        </div>
      )}

      {module === 'NBA' && (
        <div className="bg-[#0b1220]/95 border border-purple-500/30 rounded-xl p-5 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-500/40 text-purple-400">
                <LineChart className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-100 font-mono-code">
                    4. NBA (Network Behavior Analysis)
                  </h3>
                  <span className="text-[10px] font-mono-code font-bold px-2 py-0.5 rounded bg-purple-950 border border-purple-500 text-purple-300">
                    HEURISTIC
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Flow baseline profiling (NetFlow/IPFIX) uncovering hidden tunnels, beaconing, and zero-day deviations.
                </p>
              </div>
            </div>

            <span className="text-xs font-mono-code text-purple-400 px-3 py-1.5 rounded-lg bg-purple-950/40 border border-purple-500/30">
              Anomaly Score: {metrics.nbaAnomalyScore} / 100
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3 font-mono-code text-xs">
              <span className="text-slate-400 block mb-1">Baseline Deviation</span>
              <span className="text-2xl font-bold text-cyan-400">+{metrics.nbaBaselineDev}%</span>
              <span className="text-[10px] text-slate-500 block mt-1">Within safe threshold</span>
            </div>
            <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3 font-mono-code text-xs">
              <span className="text-slate-400 block mb-1">DNS Tunnel Shield</span>
              <span className="text-2xl font-bold text-emerald-400">Active</span>
              <span className="text-[10px] text-slate-500 block mt-1">Shannon entropy analysis</span>
            </div>
            <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3 font-mono-code text-xs">
              <span className="text-slate-400 block mb-1">Exfiltration Detection</span>
              <span className="text-2xl font-bold text-purple-400">Real-time</span>
              <span className="text-[10px] text-slate-500 block mt-1">C2 beacon correlation</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
