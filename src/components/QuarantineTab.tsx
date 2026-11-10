import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  ShieldAlert,
  Server,
  Activity,
  CheckCircle,
  FileText,
  Search,
  AlertTriangle,
} from 'lucide-react';
import { QuarantinedHost } from '../types/cyber';

interface QuarantineTabProps {
  hosts: QuarantinedHost[];
  onReleaseHost: (hostId: string) => void;
  onSandboxHost: (hostId: string) => void;
}

export const QuarantineTab: React.FC<QuarantineTabProps> = ({
  hosts,
  onReleaseHost,
  onSandboxHost,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'ALL' | 'ISOLATED' | 'SANDBOXED'>('ALL');

  const filteredHosts = hosts.filter((h) => {
    const matchesSearch =
      h.hostname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.ip.includes(searchTerm) ||
      h.reason.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = activeTab === 'ALL' || h.status === activeTab;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-[#0b1220]/95 border border-slate-800/90 rounded-xl p-4.5 space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-950/80 border border-rose-500/40 text-rose-300">
              TOPOLOGI BLOK B: AUTOMATED QUARANTINE / BLOCK
            </span>
            <span className="text-xs text-slate-400 font-mono-code">• Zero-Trust Isolation</span>
          </div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Lock className="w-5 h-5 text-rose-400" />
            Quarantined Endpoints & Isolated Processes
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Automatic network severance executed when AI Proxy or HIPS detects ransomware, zero-day or high-threat vectors.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono-code text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-rose-950/50 border border-rose-500/40 text-rose-300 font-bold">
            {hosts.length} Hosts In Enclave
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono-code">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search host, IP or reason..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
          />
        </div>

        <div className="flex items-center gap-1.5">
          {(['ALL', 'ISOLATED', 'SANDBOXED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded text-xs border transition-colors ${
                activeTab === tab
                  ? 'bg-rose-950 border-rose-500 text-rose-300 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Quarantined List */}
      <div className="overflow-x-auto border border-slate-800/80 rounded-lg">
        <table className="w-full text-left font-mono-code text-xs">
          <thead className="bg-slate-900/90 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-2.5 px-3">Hostname</th>
              <th className="py-2.5 px-3">IP / MAC</th>
              <th className="py-2.5 px-3">PID / Target</th>
              <th className="py-2.5 px-3">Source Engine</th>
              <th className="py-2.5 px-3">Isolation Reason</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
            {filteredHosts.map((host) => (
              <tr key={host.id} className="hover:bg-slate-900/50 transition-colors">
                <td className="py-3 px-3">
                  <div className="font-bold text-slate-100 flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-rose-400" />
                    <span>{host.hostname}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">ID: {host.id} • {host.isolatedAt}</span>
                </td>
                <td className="py-3 px-3 whitespace-nowrap">
                  <div className="text-rose-400 font-semibold">{host.ip}</div>
                  <div className="text-[10px] text-slate-500">{host.mac}</div>
                </td>
                <td className="py-3 px-3 whitespace-nowrap">
                  {host.pid ? (
                    <div>
                      <span className="text-amber-400 font-semibold">PID: {host.pid}</span>
                      <div className="text-[10px] text-slate-400 max-w-[150px] truncate">
                        {host.processName}
                      </div>
                    </div>
                  ) : (
                    <span className="text-slate-500">Network Tier</span>
                  )}
                </td>
                <td className="py-3 px-3 whitespace-nowrap">
                  <span className="px-2 py-0.5 rounded text-[10px] border border-slate-700 bg-slate-900 text-slate-300">
                    {host.sourceModule}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <span className="text-slate-300">{host.reason}</span>
                </td>
                <td className="py-3 px-3 whitespace-nowrap">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      host.status === 'ISOLATED'
                        ? 'text-rose-400 bg-rose-950/70 border-rose-500/50'
                        : 'text-amber-400 bg-amber-950/70 border-amber-500/50'
                    }`}
                  >
                    {host.status}
                  </span>
                </td>
                <td className="py-3 px-3 text-right whitespace-nowrap">
                  <button
                    onClick={() => onReleaseHost(host.id)}
                    className="flex items-center gap-1 ml-auto px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 text-[11px] border border-slate-700 transition-colors"
                    title="Release host back to network"
                  >
                    <Unlock className="w-3 h-3" />
                    <span>Release</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
