import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#070b13] border-t border-slate-800/80 px-4 lg:px-6 py-2.5 text-xs font-mono-code text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-slate-300">
          Aegis Unified IPS Engine v4.2 • Active Sensor Array Connected
        </span>
      </div>

      <div className="flex items-center gap-3 text-[11px] flex-wrap">
        <span className="text-slate-500">
          NIPS: <span className="text-emerald-400 font-semibold">ONLINE</span>
        </span>
        <span className="text-slate-700">•</span>
        <span className="text-slate-500">
          HIPS: <span className="text-emerald-400 font-semibold">ONLINE</span>
        </span>
        <span className="text-slate-700">•</span>
        <span className="text-slate-500">
          WIPS: <span className="text-emerald-400 font-semibold">ONLINE</span>
        </span>
        <span className="text-slate-700">•</span>
        <span className="text-slate-500">
          NBA: <span className="text-emerald-400 font-semibold">ONLINE</span>
        </span>
        <span className="text-slate-700">•</span>
        <span className="text-slate-500">
          AI PROXY: <span className="text-cyan-400 font-semibold">ACTIVE</span>
        </span>
      </div>
    </footer>
  );
};
