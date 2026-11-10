import React, { useState } from 'react';
import { IPSModuleType } from '../types/cyber';

interface ModuleDistribution {
  module: IPSModuleType;
  label: string;
  percentage: number;
  color: string;
  count: number;
  description: string;
}

interface MitigationDonutProps {
  distribution?: ModuleDistribution[];
  onSelectModule?: (module: IPSModuleType) => void;
  totalThreats: number;
}

export const MitigationDonut: React.FC<MitigationDonutProps> = ({
  distribution = [
    {
      module: 'NIPS',
      label: 'NIPS',
      percentage: 45,
      color: '#06b6d4',
      count: 578,
      description: 'Network packet drops & rate limiting',
    },
    {
      module: 'HIPS',
      label: 'HIPS',
      percentage: 25,
      color: '#f97316',
      count: 321,
      description: 'Host endpoint quarantine & syscall intercept',
    },
    {
      module: 'WIPS',
      label: 'WIPS',
      percentage: 15,
      color: '#eab308',
      count: 193,
      description: 'Rogue AP deauthentication & RF jam defense',
    },
    {
      module: 'NBA',
      label: 'NBA',
      percentage: 15,
      color: '#a855f7',
      count: 193,
      description: 'Heuristic anomaly detection & DNS sinkhole',
    },
  ],
  onSelectModule,
  totalThreats,
}) => {
  const [hoveredModule, setHoveredModule] = useState<ModuleDistribution | null>(null);

  // SVG Donut calculation
  const size = 180;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercent = 0;

  return (
    <div className="bg-[#0b1220]/95 border border-slate-800/90 rounded-xl p-4 flex flex-col justify-between">
      {/* Header */}
      <div>
        <h3 className="text-sm font-semibold text-slate-100">Mitigation Load by Module</h3>
        <p className="text-xs text-slate-400 mt-0.5">Active enforcement distribution</p>
      </div>

      {/* Donut graphic */}
      <div className="relative flex items-center justify-center my-2">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#1e293b"
            strokeWidth={strokeWidth}
          />

          {distribution.map((item) => {
            const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
            const strokeDashoffset = -((cumulativePercent / 100) * circumference);
            cumulativePercent += item.percentage;

            const isHovered = hoveredModule?.module === item.module;

            return (
              <circle
                key={item.module}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={item.color}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredModule(item)}
                onMouseLeave={() => setHoveredModule(null)}
                onClick={() => onSelectModule && onSelectModule(item.module)}
              />
            );
          })}
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          {hoveredModule ? (
            <>
              <span className="text-xs font-mono-code font-bold" style={{ color: hoveredModule.color }}>
                {hoveredModule.label}
              </span>
              <span className="text-xl font-bold font-mono-code text-slate-100">
                {hoveredModule.percentage}%
              </span>
              <span className="text-[10px] text-slate-400 font-mono-code">
                {hoveredModule.count} alerts
              </span>
            </>
          ) : (
            <>
              <span className="text-[11px] font-mono-code text-slate-400">Total Filtered</span>
              <span className="text-xl font-bold font-mono-code text-slate-100">
                {totalThreats.toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-400 font-mono-code">100% Armed</span>
            </>
          )}
        </div>
      </div>

      {/* Legend below matching image layout */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-2 border-t border-slate-800/80">
        {distribution.map((item) => (
          <div
            key={item.module}
            onClick={() => onSelectModule && onSelectModule(item.module)}
            onMouseEnter={() => setHoveredModule(item)}
            onMouseLeave={() => setHoveredModule(null)}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <span
              className="w-2.5 h-2.5 rounded-full transition-transform group-hover:scale-125"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs font-mono-code text-slate-300 group-hover:text-white">
              {item.label}: <span className="font-semibold">{item.percentage}%</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
