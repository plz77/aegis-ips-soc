import React, { useState } from 'react';

export interface ThroughputDataPoint {
  timeLabel: string;
  trafficMbps: number;
  threatMbps: number;
}

interface VolumetricChartProps {
  data: ThroughputDataPoint[];
  currentTraffic: number;
  currentThreat: number;
}

export const VolumetricChart: React.FC<VolumetricChartProps> = ({
  data,
  currentTraffic,
  currentThreat,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const maxVal = 600;
  const height = 220;
  const width = 800;
  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const getY = (val: number) => {
    const clamped = Math.max(0, Math.min(val, maxVal));
    return paddingTop + chartHeight - (clamped / maxVal) * chartHeight;
  };

  const getX = (index: number) => {
    if (data.length <= 1) return paddingLeft;
    return paddingLeft + (index / (data.length - 1)) * chartWidth;
  };

  // Generate SVG smooth path using catmull-rom / cubic bezier
  const generateSmoothPath = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? i : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;

      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return path;
  };

  const trafficPoints = data.map((d, i) => ({ x: getX(i), y: getY(d.trafficMbps) }));
  const threatPoints = data.map((d, i) => ({ x: getX(i), y: getY(d.threatMbps) }));

  const trafficLine = generateSmoothPath(trafficPoints);
  const threatLine = generateSmoothPath(threatPoints);

  const trafficArea = `${trafficLine} L ${getX(data.length - 1)} ${paddingTop + chartHeight} L ${paddingLeft} ${paddingTop + chartHeight} Z`;
  const threatArea = `${threatLine} L ${getX(data.length - 1)} ${paddingTop + chartHeight} L ${paddingLeft} ${paddingTop + chartHeight} Z`;

  const yTicks = [600, 450, 300, 150, 0];

  return (
    <div className="bg-[#0b1220]/95 border border-slate-800/90 rounded-xl p-4 flex flex-col justify-between">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            Network Bandwidth & Threat Volumetric Filter
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Live throughput (Mbps) monitored by NIPS & NBA engines
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-mono-code">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
            <span className="text-slate-300">Traffic ({currentTraffic.toFixed(0)} Mbps)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
            <span className="text-rose-400">Threat Traffic ({currentThreat.toFixed(0)} Mbps)</span>
          </div>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative w-full h-[220px] select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#0891b2" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#0e7490" stopOpacity="0.0" />
            </linearGradient>

            <linearGradient id="threatGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.6" />
              <stop offset="70%" stopColor="#e11d48" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#9f1239" stopOpacity="0.0" />
            </linearGradient>

            <filter id="glow-traffic" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Grid lines & Y Axis */}
          {yTicks.map((tick) => {
            const y = getY(tick);
            return (
              <g key={tick}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#1e293b"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  fill="#64748b"
                  fontSize="10"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Traffic Area & Line */}
          <path d={trafficArea} fill="url(#trafficGradient)" />
          <path
            d={trafficLine}
            fill="none"
            stroke="#06b6d4"
            strokeWidth="2.5"
            filter="url(#glow-traffic)"
          />

          {/* Threat Area & Line */}
          <path d={threatArea} fill="url(#threatGradient)" />
          <path
            d={threatLine}
            fill="none"
            stroke="#f43f5e"
            strokeWidth="2"
          />

          {/* Interactive Hover columns */}
          {data.map((d, i) => {
            const x = getX(i);
            const isHovered = hoveredIndex === i;
            return (
              <g
                key={i}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer"
              >
                <rect
                  x={x - 15}
                  y={paddingTop}
                  width="30"
                  height={chartHeight}
                  fill="transparent"
                />
                {isHovered && (
                  <>
                    <line
                      x1={x}
                      y1={paddingTop}
                      x2={x}
                      y2={paddingTop + chartHeight}
                      stroke="#38bdf8"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                    />
                    <circle cx={x} cy={getY(d.trafficMbps)} r="4" fill="#06b6d4" stroke="#fff" strokeWidth="1.5" />
                    <circle cx={x} cy={getY(d.threatMbps)} r="3.5" fill="#f43f5e" stroke="#fff" strokeWidth="1.5" />
                  </>
                )}
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip */}
        {hoveredIndex !== null && data[hoveredIndex] && (
          <div
            className="absolute z-20 pointer-events-none bg-slate-900/95 border border-slate-700 rounded-lg p-2 text-xs font-mono-code shadow-xl"
            style={{
              left: `${Math.min(Math.max((hoveredIndex / (data.length - 1)) * 90, 5), 75)}%`,
              top: '15%',
            }}
          >
            <div className="text-slate-400 text-[10px] border-b border-slate-800 pb-1 mb-1">
              Time: {data[hoveredIndex].timeLabel}
            </div>
            <div className="text-cyan-400 flex items-center justify-between gap-3">
              <span>Traffic:</span>
              <span className="font-bold">{data[hoveredIndex].trafficMbps} Mbps</span>
            </div>
            <div className="text-rose-400 flex items-center justify-between gap-3">
              <span>Threat:</span>
              <span className="font-bold">{data[hoveredIndex].threatMbps} Mbps</span>
            </div>
          </div>
        )}
      </div>

      {/* X Axis Time Labels */}
      <div className="flex justify-between text-[10px] font-mono-code text-slate-500 px-6 mt-1 border-t border-slate-800/60 pt-1.5 overflow-x-hidden">
        {data.filter((_, i) => i % 2 === 0).map((d, i) => (
          <span key={i}>{d.timeLabel}</span>
        ))}
      </div>
    </div>
  );
};
