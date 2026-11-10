import React, { useState } from 'react';
import {
  ShieldCheck,
  Plus,
  ToggleLeft,
  ToggleRight,
  Filter,
  CheckCircle,
  Sliders,
  AlertOctagon,
  Trash2,
  X,
} from 'lucide-react';
import { PreventionRule, IPSModuleType, ThreatSeverity } from '../types/cyber';

interface PreventionRulesTabProps {
  rules: PreventionRule[];
  onToggleRule: (ruleId: string) => void;
  onAddRule: (rule: Omit<PreventionRule, 'id' | 'matchCount'>) => void;
}

export const PreventionRulesTab: React.FC<PreventionRulesTabProps> = ({
  rules,
  onToggleRule,
  onAddRule,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<string>('ALL');

  // New rule form state
  const [ruleName, setRuleName] = useState('');
  const [ruleCode, setRuleCode] = useState('');
  const [ruleModule, setRuleModule] = useState<IPSModuleType>('NIPS');
  const [ruleAction, setRuleAction] = useState<PreventionRule['action']>('DROP_INLINE');
  const [ruleSeverity, setRuleSeverity] = useState<ThreatSeverity>('HIGH');
  const [ruleDesc, setRuleDesc] = useState('');

  const filteredRules = rules.filter(
    (r) => selectedModule === 'ALL' || r.module === selectedModule
  );

  const handleSubmitNewRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleName || !ruleCode) return;

    onAddRule({
      code: ruleCode,
      name: ruleName,
      module: ruleModule,
      description: ruleDesc || 'Custom automated mitigation policy.',
      action: ruleAction,
      severity: ruleSeverity,
      enabled: true,
    });

    setIsModalOpen(false);
    setRuleName('');
    setRuleCode('');
    setRuleDesc('');
  };

  return (
    <div className="bg-[#0b1220]/95 border border-slate-800/90 rounded-xl p-4.5 space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Active Prevention Rules
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated enforcement policies applied at Hardware Firewall, AI Proxy & IPS Enclaves
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 border border-cyan-400 text-slate-950 font-bold text-xs font-mono-code transition-colors shadow-[0_0_12px_rgba(6,182,212,0.3)]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom Rule</span>
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex items-center justify-between gap-3 text-xs font-mono-code">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Filter By Engine:</span>
          <div className="flex gap-1.5 flex-wrap">
            {['ALL', 'NIPS', 'HIPS', 'WIPS', 'NBA', 'AI_PROXY'].map((mod) => (
              <button
                key={mod}
                onClick={() => setSelectedModule(mod)}
                className={`px-2.5 py-1 rounded text-[11px] border transition-colors ${
                  selectedModule === mod
                    ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {mod === 'ALL' ? 'All Rules' : mod}
              </button>
            ))}
          </div>
        </div>

        <span className="text-slate-400 text-[11px]">
          {filteredRules.filter((r) => r.enabled).length} Armed / {filteredRules.length} Total
        </span>
      </div>

      {/* Rules Table */}
      <div className="overflow-x-auto border border-slate-800/80 rounded-lg">
        <table className="w-full text-left font-mono-code text-xs">
          <thead className="bg-slate-900/90 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-2.5 px-3">Rule Code</th>
              <th className="py-2.5 px-3">Module</th>
              <th className="py-2.5 px-3">Rule Description</th>
              <th className="py-2.5 px-3">Enforcement Action</th>
              <th className="py-2.5 px-3">Hits</th>
              <th className="py-2.5 px-3 text-right">Arm Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
            {filteredRules.map((rule) => (
              <tr key={rule.id} className="hover:bg-slate-900/50 transition-colors">
                <td className="py-3 px-3 font-bold text-cyan-400 whitespace-nowrap">
                  {rule.code}
                </td>
                <td className="py-3 px-3 whitespace-nowrap">
                  <span className="px-2 py-0.5 rounded border border-slate-700 bg-slate-900 text-slate-300 text-[10px]">
                    {rule.module}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <div className="font-semibold text-slate-200">{rule.name}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{rule.description}</div>
                </td>
                <td className="py-3 px-3 whitespace-nowrap">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      rule.action === 'DROP_INLINE'
                        ? 'text-cyan-300 bg-cyan-950/70 border-cyan-500/40'
                        : rule.action === 'QUARANTINE_HOST'
                        ? 'text-rose-300 bg-rose-950/70 border-rose-500/40'
                        : rule.action === 'AI_SANDBOX'
                        ? 'text-purple-300 bg-purple-950/70 border-purple-500/40'
                        : 'text-amber-300 bg-amber-950/70 border-amber-500/40'
                    }`}
                  >
                    {rule.action}
                  </span>
                </td>
                <td className="py-3 px-3 text-slate-300 font-bold whitespace-nowrap">
                  {rule.matchCount.toLocaleString()}
                </td>
                <td className="py-3 px-3 text-right whitespace-nowrap">
                  <button
                    onClick={() => onToggleRule(rule.id)}
                    className="cursor-pointer text-slate-400 hover:text-white transition-colors"
                  >
                    {rule.enabled ? (
                      <span className="flex items-center justify-end gap-1 text-emerald-400 text-[11px]">
                        <span>ARMED</span>
                        <ToggleRight className="w-5 h-5 text-emerald-400" />
                      </span>
                    ) : (
                      <span className="flex items-center justify-end gap-1 text-slate-500 text-[11px]">
                        <span>DISARMED</span>
                        <ToggleLeft className="w-5 h-5 text-slate-600" />
                      </span>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Custom Rule Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-[#0b1324] border border-cyan-500/40 rounded-xl max-w-lg w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h4 className="font-mono-code font-bold text-slate-100 text-sm">
                Add Custom Prevention Rule
              </h4>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitNewRule} className="space-y-3 font-mono-code text-xs">
              <div>
                <label className="text-slate-300 block mb-1">Rule Identifier / Code:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NIPS-XSS-FILTER-07"
                  value={ruleCode}
                  onChange={(e) => setRuleCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Policy Title:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cross-Site Scripting inline payload stripper"
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">Target Engine:</label>
                  <select
                    value={ruleModule}
                    onChange={(e) => setRuleModule(e.target.value as IPSModuleType)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200"
                  >
                    <option value="NIPS">NIPS (Network)</option>
                    <option value="HIPS">HIPS (Host)</option>
                    <option value="WIPS">WIPS (Wireless)</option>
                    <option value="NBA">NBA (Behavior)</option>
                    <option value="AI_PROXY">AI Intelligence Proxy</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Action:</label>
                  <select
                    value={ruleAction}
                    onChange={(e) => setRuleAction(e.target.value as PreventionRule['action'])}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200"
                  >
                    <option value="DROP_INLINE">DROP_INLINE</option>
                    <option value="QUARANTINE_HOST">QUARANTINE_HOST</option>
                    <option value="DEAUTH_AP">DEAUTH_AP</option>
                    <option value="RESET_CONNECTION">RESET_CONNECTION</option>
                    <option value="AI_SANDBOX">AI_SANDBOX</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Description / Signature Regex:</label>
                <textarea
                  rows={2}
                  placeholder="Filter regex or telemetry condition..."
                  value={ruleDesc}
                  onChange={(e) => setRuleDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold"
                >
                  Arm Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
