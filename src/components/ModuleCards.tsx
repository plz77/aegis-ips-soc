import React from 'react';
import { Network, Server, Wifi, LineChart, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { MetricTelemetry, IPSModuleType } from '../types/cyber';

interface ModuleCardsProps {
  metrics: MetricTelemetry;
  onSelectModule: (module: IPSModuleType) => void;
  activeAttackModule?: IPSModuleType | null;
}

export const ModuleCards: React.FC<ModuleCardsProps> = ({
  metrics,
  onSelectModule,
  activeAttackModule,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. NIPS */}
      <div
        onClick={() => onSelectModule('NIPS')}
        className={`bg-[#0b1220]/95 border rounded-xl p-4 flex flex-col justify-between transition-all duration-200 cursor-pointer group hover:bg-slate-900/80 ${
          activeAttackModule === 'NIPS'
            ? 'border-cyan-400 ring-2 ring-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
            : 'border-slate-800/90 hover:border-cyan-500/50'
        }`}
      >
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Network className="w-4 h-4 text-cyan-400" />
              <h4 className="text-sm font-bold text-slate-100 font-mono-code group-hover:text-cyan-300">
                1. NIPS
              </h4>
            </div>
            <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-cyan-500/50 bg-cyan-950/60 text-cyan-300">
              INLINE
            </span>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
            Network IPS inspects raw packet payloads inline to drop malicious traffic before hitting servers.
          </p>
        </div>

        <div className="space-y-1.5 border-t border-slate-800/80 pt-3 text-xs font-mono-code">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Throughput:</span>
            <span className="text-slate-200 font-semibold">
              {(metrics.nipsThroughput / 1000).toFixed(1)}k pps
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Packet Drops:</span>
            <span className="text-rose-400 font-semibold">
              {metrics.nipsPacketDrops.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Active Rules:</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <span>{metrics.nipsActiveRules}/3 Armed</span>
              <CheckCircle className="w-3 h-3 text-emerald-400" />
            </span>
          </div>
        </div>
      </div>

      {/* 2. HIPS */}
      <div
        onClick={() => onSelectModule('HIPS')}
        className={`bg-[#0b1220]/95 border rounded-xl p-4 flex flex-col justify-between transition-all duration-200 cursor-pointer group hover:bg-slate-900/80 ${
          activeAttackModule === 'HIPS'
            ? 'border-amber-400 ring-2 ring-amber-500/30 shadow-[0_0_20px_rgba(249,115,22,0.25)]'
            : 'border-slate-800/90 hover:border-amber-500/50'
        }`}
      >
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-amber-400" />
              <h4 className="text-sm font-bold text-slate-100 font-mono-code group-hover:text-amber-300">
                2. HIPS
              </h4>
            </div>
            <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-amber-500/50 bg-amber-950/60 text-amber-300">
              AGENT
            </span>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
            Host IPS monitors OS system calls, memory integrity, and process execution on endpoints.
          </p>
        </div>

        <div className="space-y-1.5 border-t border-slate-800/80 pt-3 text-xs font-mono-code">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Monitored PIDs:</span>
            <span className="text-slate-200 font-semibold">{metrics.hipsMonitoredPids}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">System Calls:</span>
            <span className="text-emerald-400 font-semibold">
              {metrics.hipsSystemCallsSecured ? 'Secured' : 'Warning'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Isolated PIDs:</span>
            <span className="text-amber-400 font-semibold flex items-center gap-1">
              <span>{metrics.hipsIsolatedPids} Active</span>
              <AlertCircle className="w-3 h-3 text-amber-400" />
            </span>
          </div>
        </div>
      </div>

      {/* 3. WIPS */}
      <div
        onClick={() => onSelectModule('WIPS')}
        className={`bg-[#0b1220]/95 border rounded-xl p-4 flex flex-col justify-between transition-all duration-200 cursor-pointer group hover:bg-slate-900/80 ${
          activeAttackModule === 'WIPS'
            ? 'border-yellow-400 ring-2 ring-yellow-500/30 shadow-[0_0_20px_rgba(234,179,8,0.25)]'
            : 'border-slate-800/90 hover:border-yellow-500/50'
        }`}
      >
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-yellow-400" />
              <h4 className="text-sm font-bold text-slate-100 font-mono-code group-hover:text-yellow-300">
                3. WIPS
              </h4>
            </div>
            <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-yellow-500/50 bg-yellow-950/60 text-yellow-300">
              RF SENSOR
            </span>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
            Wireless IPS monitors the radio frequency spectrum for rogue APs, spoofed SSIDs, and jamming.
          </p>
        </div>

        <div className="space-y-1.5 border-t border-slate-800/80 pt-3 text-xs font-mono-code">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Monitored APs:</span>
            <span className="text-slate-200 font-semibold">{metrics.wipsMonitoredAps} APs</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Rogue APs:</span>
            <span className="text-yellow-400 font-semibold">
              {metrics.wipsRogueAps} Flagged
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Deauth Mitigation:</span>
            <span className="text-emerald-400 font-semibold">
              {metrics.wipsDeauthMitigation ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>
      </div>

      {/* 4. NBA */}
      <div
        onClick={() => onSelectModule('NBA')}
        className={`bg-[#0b1220]/95 border rounded-xl p-4 flex flex-col justify-between transition-all duration-200 cursor-pointer group hover:bg-slate-900/80 ${
          activeAttackModule === 'NBA'
            ? 'border-purple-400 ring-2 ring-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.25)]'
            : 'border-slate-800/90 hover:border-purple-500/50'
        }`}
      >
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <LineChart className="w-4 h-4 text-purple-400" />
              <h4 className="text-sm font-bold text-slate-100 font-mono-code group-hover:text-purple-300">
                4. NBA
              </h4>
            </div>
            <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-purple-500/50 bg-purple-950/60 text-purple-300">
              HEURISTIC
            </span>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
            Network Behavior Analysis establishes traffic baselines to catch unknown anomalies & zero-days.
          </p>
        </div>

        <div className="space-y-1.5 border-t border-slate-800/80 pt-3 text-xs font-mono-code">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Baseline Dev:</span>
            <span className="text-cyan-400 font-semibold">+{metrics.nbaBaselineDev}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Anomaly Score:</span>
            <span className="text-purple-400 font-semibold">
              {metrics.nbaAnomalyScore} / 100
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">DNS Tunnel Shield:</span>
            <span className="text-emerald-400 font-semibold">
              {metrics.nbaDnsTunnelShield ? 'Active' : 'Standby'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
