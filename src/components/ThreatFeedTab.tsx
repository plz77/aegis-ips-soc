import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  AlertTriangle,
  Lock,
  ExternalLink,
  X,
  Terminal,
} from 'lucide-react';
import { ThreatEvent, IPSModuleType, ThreatSeverity } from '../types/cyber';

interface ThreatFeedTabProps {
  threats: ThreatEvent[];
  onInspectPayload?: (threat: ThreatEvent) => void;
}

export const ThreatFeedTab: React.FC<ThreatFeedTabProps> = ({ threats }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModule, setSelectedModule] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [inspectedEvent, setInspectedEvent] = useState<ThreatEvent | null>(null);

  const filteredThreats = threats.filter((evt) => {
    const matchesSearch =
      evt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.sourceIp.includes(searchTerm) ||
      evt.targetIp.includes(searchTerm) ||
      evt.attackType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesModule = selectedModule === 'ALL' || evt.module === selectedModule;
    const matchesSeverity = selectedSeverity === 'ALL' || evt.severity === selectedSeverity;

    return matchesSearch && matchesModule && matchesSeverity;
  });

  const exportAsJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(threats, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `aegis-ips-threat-log-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getModuleBadgeColor = (module: IPSModuleType) => {
    switch (module) {
      case 'NIPS':
        return 'text-cyan-400 bg-cyan-950/60 border-cyan-500/40';
      case 'HIPS':
        return 'text-amber-400 bg-amber-950/60 border-amber-500/40';
      case 'WIPS':
        return 'text-yellow-400 bg-yellow-950/60 border-yellow-500/40';
      case 'NBA':
        return 'text-purple-400 bg-purple-950/60 border-purple-500/40';
      case 'AI_PROXY':
        return 'text-sky-300 bg-sky-950/60 border-sky-400/50';
    }
  };

  const getSeverityBadge = (severity: ThreatSeverity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'text-rose-400 bg-rose-950/70 border-rose-500/50';
      case 'HIGH':
        return 'text-amber-400 bg-amber-950/70 border-amber-500/50';
      case 'MODERATE':
        return 'text-blue-400 bg-blue-950/70 border-blue-500/50';
      case 'LOW':
        return 'text-emerald-400 bg-emerald-950/70 border-emerald-500/50';
    }
  };

  return (
    <div className="bg-[#0b1220]/95 border border-slate-800/90 rounded-xl p-4.5 space-y-4">
      {/* Header and Filter Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            Real-Time Threat Feed
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Streaming security vectors intercepted across NIPS, HIPS, WIPS, NBA & AI Proxy Layer
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportAsJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono-code text-slate-300 hover:text-cyan-300 hover:border-slate-600 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Log</span>
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono-code">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by attack name, IP address, or payload..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Modules</option>
            <option value="NIPS">1. NIPS (Network)</option>
            <option value="HIPS">2. HIPS (Host)</option>
            <option value="WIPS">3. WIPS (Wireless)</option>
            <option value="NBA">4. NBA (Behavior)</option>
            <option value="AI_PROXY">AI Intelligence Proxy</option>
          </select>

          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MODERATE">Moderate</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Threat Feed Table */}
      <div className="overflow-x-auto border border-slate-800/80 rounded-lg">
        <table className="w-full text-left font-mono-code text-xs">
          <thead className="bg-slate-900/90 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-2.5 px-3">Time</th>
              <th className="py-2.5 px-3">Module</th>
              <th className="py-2.5 px-3">Attack Vector</th>
              <th className="py-2.5 px-3">Source &rarr; Target</th>
              <th className="py-2.5 px-3">DPI Heuristics</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
            {filteredThreats.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500 italic">
                  No threat events match the current filter.
                </td>
              </tr>
            ) : (
              filteredThreats.map((evt) => (
                <tr key={evt.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">{evt.timestamp}</td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded border text-[10px] font-bold ${getModuleBadgeColor(
                        evt.module
                      )}`}
                    >
                      {evt.module}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-slate-200">{evt.title}</div>
                    <div className="text-[10px] text-slate-400">{evt.attackType}</div>
                  </td>
                  <td className="py-2.5 px-3 text-slate-300 whitespace-nowrap">
                    <span className="text-rose-400">{evt.sourceIp}</span>
                    <span className="text-slate-600 mx-1.5">&rarr;</span>
                    <span className="text-cyan-400">{evt.targetIp}</span>
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`font-bold ${
                          evt.heuristicScore >= 80 ? 'text-rose-400' : 'text-amber-400'
                        }`}
                      >
                        {evt.heuristicScore}/100
                      </span>
                      {evt.zeroDayProb > 50 && (
                        <span className="text-[10px] text-purple-400 bg-purple-950 px-1 rounded border border-purple-500/30">
                          ZeroDay {evt.zeroDayProb}%
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                        evt.status === 'DROPPED'
                          ? 'text-cyan-300 bg-cyan-950/70 border-cyan-500/40'
                          : evt.status === 'QUARANTINED'
                          ? 'text-rose-300 bg-rose-950/70 border-rose-500/40'
                          : 'text-amber-300 bg-amber-950/70 border-amber-500/40'
                      }`}
                    >
                      {evt.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => setInspectedEvent(evt)}
                      className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition-colors"
                      title="Inspect Payload"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Payload Inspection Modal */}
      {inspectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-[#0b1324] border border-cyan-500/40 rounded-xl max-w-2xl w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-cyan-400" />
                <h4 className="font-mono-code font-bold text-slate-100 text-sm">
                  Forensic Packet Payload Inspector [{inspectedEvent.id}]
                </h4>
              </div>
              <button
                onClick={() => setInspectedEvent(null)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 font-mono-code text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                <div>
                  <span className="text-slate-500 block text-[10px]">VECTOR:</span>
                  <span className="text-slate-200 font-semibold">{inspectedEvent.attackType}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">PREVENTION ACTION:</span>
                  <span className="text-emerald-400 font-semibold">{inspectedEvent.actionTaken}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">SOURCE IP:</span>
                  <span className="text-rose-400">{inspectedEvent.sourceIp}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">TARGET IP:</span>
                  <span className="text-cyan-400">{inspectedEvent.targetIp}</span>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block text-[11px] mb-1">
                  Raw Intercepted Packet Payload:
                </label>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-rose-300 break-all select-all">
                  {inspectedEvent.payload}
                </div>
              </div>

              {inspectedEvent.aiVerdict && (
                <div>
                  <label className="text-cyan-400 block text-[11px] mb-1 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
                    AI Intelligence Proxy DPI Analysis Verdict:
                  </label>
                  <div className="p-3 bg-cyan-950/40 border border-cyan-800/40 rounded-lg text-slate-300 leading-relaxed">
                    {inspectedEvent.aiVerdict}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setInspectedEvent(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-mono-code"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
