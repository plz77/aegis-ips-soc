import React from 'react';
import { Zap, Play, CheckCircle2, ShieldAlert } from 'lucide-react';
import { simulationPresets } from '../data/initialData';
import { IPSModuleType } from '../types/cyber';

interface AttackSimulatorProps {
  onTriggerAttack: (preset: typeof simulationPresets[0]) => void;
  activeAttackId?: string;
  isSimulating: boolean;
}

export const AttackSimulator: React.FC<AttackSimulatorProps> = ({
  onTriggerAttack,
  activeAttackId,
  isSimulating,
}) => {
  return (
    <div className="bg-[#0b1220]/95 border border-slate-800/90 rounded-xl p-3.5 lg:p-4">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
        {/* Left title & description */}
        <div className="flex items-start gap-2.5">
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 mt-0.5">
            <Zap className="w-4 h-4 fill-amber-400/20" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              Live Attack Simulator Panel
              <span className="text-[10px] font-mono-code font-normal text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                Interactive Test Vectors
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Trigger test vectors to verify automatic prevention responses across all 4 IPS modules & AI Proxy.
            </p>
          </div>
        </div>

        {/* Right trigger action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {simulationPresets.map((preset) => {
            const isActive = activeAttackId === preset.id && isSimulating;

            return (
              <button
                key={preset.id}
                onClick={() => onTriggerAttack(preset)}
                disabled={isSimulating}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono-code transition-all duration-200 ${
                  preset.borderColor
                } ${preset.hoverBg} ${preset.textColor} bg-slate-900/60 ${
                  isActive ? `ring-2 ring-offset-1 ring-offset-slate-950 ${preset.activeGlow}` : ''
                } ${isSimulating ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:scale-102'}`}
              >
                {isActive ? (
                  <ShieldAlert className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Zap className="w-3 h-3 fill-current" />
                )}
                <span>{preset.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
