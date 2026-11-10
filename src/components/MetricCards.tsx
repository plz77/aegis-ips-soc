import React from 'react';
import { Activity, ShieldCheck, UserX, Cpu } from 'lucide-react';
import { MetricTelemetry } from '../types/cyber';

interface MetricCardsProps {
  metrics: MetricTelemetry;
  onNavigateToQuarantine?: () => void;
  onNavigateToFeed?: () => void;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  metrics,
  onNavigateToQuarantine,
  onNavigateToFeed,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Events / Sec */}
      <div className="bg-[#0b1220]/90 border border-slate-800/90 rounded-xl p-4 flex items-center justify-between hover:border-cyan-500/40 transition-all group">
        <div>
          <p className="text-xs font-medium text-slate-400 mb-1">Events / Sec</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-bold font-mono-code text-cyan-400 tracking-tight">
              {metrics.eventsPerSec.toLocaleString()}
            </span>
            <span className="text-[11px] font-mono-code text-emerald-400">pps</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-[10px] text-slate-500 font-mono-code">Inbound Stream Stable</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.15)] group-hover:scale-105 transition-transform">
          <Activity className="w-5 h-5" />
        </div>
      </div>

      {/* 2. Threats Prevented */}
      <div 
        onClick={onNavigateToFeed}
        className="bg-[#0b1220]/90 border border-slate-800/90 rounded-xl p-4 flex items-center justify-between hover:border-emerald-500/40 transition-all group cursor-pointer"
        title="View Threat Feed"
      >
        <div>
          <p className="text-xs font-medium text-slate-400 mb-1">Threats Prevented</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-bold font-mono-code text-emerald-400 tracking-tight">
              {metrics.threatsPrevented.toLocaleString()}
            </span>
            <span className="text-[11px] font-mono-code text-emerald-500/80">intercepted</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[10px] text-emerald-400/80 font-mono-code">100% Inline Mitigation</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)] group-hover:scale-105 transition-transform">
          <ShieldCheck className="w-5 h-5" />
        </div>
      </div>

      {/* 3. Host Quarantines */}
      <div 
        onClick={onNavigateToQuarantine}
        className="bg-[#0b1220]/90 border border-slate-800/90 rounded-xl p-4 flex items-center justify-between hover:border-amber-500/40 transition-all group cursor-pointer"
        title="View Quarantined Hosts"
      >
        <div>
          <p className="text-xs font-medium text-slate-400 mb-1">Host Quarantines</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-bold font-mono-code text-amber-400 tracking-tight">
              {metrics.hostQuarantines}
            </span>
            <span className="text-[11px] font-mono-code text-amber-500/80">hosts</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="text-[10px] text-amber-400/80 font-mono-code">Endpoints Isolated</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-400 shadow-[0_0_12px_rgba(249,115,22,0.15)] group-hover:scale-105 transition-transform">
          <UserX className="w-5 h-5" />
        </div>
      </div>

      {/* 4. Engine Health */}
      <div className="bg-[#0b1220]/90 border border-slate-800/90 rounded-xl p-4 flex items-center justify-between hover:border-blue-500/40 transition-all group">
        <div>
          <p className="text-xs font-medium text-slate-400 mb-1">Engine Health</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-bold font-mono-code text-blue-400 tracking-tight">
              {metrics.engineHealth.toFixed(1)}%
            </span>
            <span className="text-[11px] font-mono-code text-blue-500/80">optimal</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[10px] text-blue-400/80 font-mono-code">Sensors & AI Proxy Active</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/30 text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.15)] group-hover:scale-105 transition-transform">
          <Cpu className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
