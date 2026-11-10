import React from 'react';
import { Shield, Activity, RefreshCw, AlertTriangle, Radio } from 'lucide-react';
import { ThreatSeverity } from '../types/cyber';

interface HeaderProps {
  threatStatus: ThreatSeverity;
  isEngineActive: boolean;
  onToggleEngine: () => void;
  onResetData: () => void;
  activeSimulating: boolean;
  activeAttackName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  threatStatus,
  isEngineActive,
  onToggleEngine,
  onResetData,
  activeSimulating,
  activeAttackName,
}) => {
  const getStatusBadge = () => {
    switch (threatStatus) {
      case 'CRITICAL':
        return {
          bg: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
          dot: 'bg-rose-500',
          text: 'CRITICAL',
        };
      case 'HIGH':
      case 'ELEVATED':
        return {
          bg: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
          dot: 'bg-orange-500',
          text: 'ELEVATED',
        };
      case 'MODERATE':
      default:
        return {
          bg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
          dot: 'bg-emerald-400',
          text: 'MODERATE',
        };
    }
  };

  const status = getStatusBadge();

  return (
    <header className="w-full bg-[#090e1a]/95 border-b border-slate-800/80 px-4 lg:px-6 py-3.5 backdrop-blur-md sticky top-0 z-40">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left branding */}
        <div className="flex items-center gap-3">
          <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-cyan-950/80 to-slate-900 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <Shield className="w-6 h-6 text-cyan-400" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg md:text-xl font-bold tracking-wider text-slate-100 flex items-center gap-2">
                AEGIS UNIFIED IPS SOC
                <span className="text-[11px] font-mono-code font-bold tracking-normal px-2 py-0.5 rounded border border-cyan-500/40 bg-cyan-950/60 text-cyan-300">
                  v4.2 PRO
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <span>Integrated NIPS / HIPS / WIPS / NBA Prevention Engine</span>
              <span className="text-cyan-500/60">•</span>
              <span className="text-cyan-400/90 font-medium">AI Proxy (Ollama v0.24.0)</span>
            </p>
          </div>
        </div>

        {/* Right status & controls */}
        <div className="flex items-center gap-3 flex-wrap">
          {activeSimulating && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-950/70 border border-rose-500/60 animate-pulse text-xs text-rose-300 font-mono-code">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>TEST VECTOR: {activeAttackName}</span>
            </div>
          )}

          {/* Global Threat Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs">
            <span className="text-slate-400 font-mono-code uppercase tracking-wider text-[11px]">
              GLOBAL THREAT STATUS:
            </span>
            <span
              className={`font-mono-code font-semibold px-2 py-0.5 rounded text-[11px] border flex items-center gap-1.5 ${status.bg}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot} animate-pulse`} />
              {status.text}
            </span>
          </div>

          {/* Live Engine Active */}
          <button
            onClick={onToggleEngine}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono-code transition-all duration-200 ${
              isEngineActive
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-400 hover:bg-emerald-900/40 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
            }`}
            title="Toggle Engine Real-Time Ingestion"
          >
            <div className="flex items-center gap-0.5">
              <span
                className={`inline-block w-1 h-3 rounded-sm ${
                  isEngineActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'
                }`}
              />
              <span
                className={`inline-block w-1 h-3.5 rounded-sm ${
                  isEngineActive ? 'bg-emerald-400 animate-pulse delay-75' : 'bg-slate-600'
                }`}
              />
              <span
                className={`inline-block w-1 h-2 rounded-sm ${
                  isEngineActive ? 'bg-emerald-400 animate-pulse delay-150' : 'bg-slate-600'
                }`}
              />
            </div>
            <span>{isEngineActive ? 'Live Engine Active' : 'Engine Paused'}</span>
          </button>

          {/* Reset / Refresh */}
          <button
            onClick={onResetData}
            className="p-2 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-cyan-300 hover:border-slate-700 hover:bg-slate-800 transition-colors"
            title="Reset telemetry baseline"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
