import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  X,
  Sparkles,
  Shield,
  Zap,
  Terminal,
  RefreshCw,
  MessageSquare,
  ChevronDown,
} from 'lucide-react';
import { MetricTelemetry } from '../types/cyber';

interface SOCCopilotWidgetProps {
  metrics: MetricTelemetry;
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'copilot';
  text: string;
  timestamp: string;
  latencyMs?: number;
}

export const SOCCopilotWidget: React.FC<SOCCopilotWidgetProps> = ({
  metrics,
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-0',
      sender: 'copilot',
      text: 'Halo! Saya adalah AEGIS SOC Copilot Agent yang ditenagai oleh Groq LPU (copilot-agent). Saya siap membantu Anda melakukan investigasi insiden, analisis log forensik, serta rekomendasi tindakan mitigasi untuk NIPS, HIPS, WIPS, NBA, dan AI Proxy.',
      timestamp: 'Just now',
      latencyMs: 14,
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'Bagaimana cara mitigasi Ransomware pada host terisolasi?',
    'Analisis efektivitas drop inline pada NIPS (45.2k pps).',
    'Jelaskan pemisahan trafik di AI Intelligence Proxy.',
    'Apa rekomendasi penanganan Rogue AP (WIPS)?',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (queryText = input) => {
    if (!queryText.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const contextSummary = `Events: ${metrics.eventsPerSec} pps, Threats Prevented: ${metrics.threatsPrevented}, Quarantined Hosts: ${metrics.hostQuarantines}, NIPS Drops: ${metrics.nipsPacketDrops}, HIPS Isolated PIDs: ${metrics.hipsIsolatedPids}, WIPS Flagged: ${metrics.wipsRogueAps}, NBA Score: ${metrics.nbaAnomalyScore}/100.`;

      const res = await fetch('/api/copilot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: queryText, context: contextSummary }),
      });

      if (res.ok) {
        const data = await res.json();
        const copilotMsg: ChatMessage = {
          id: `cop-${Date.now()}`,
          sender: 'copilot',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          latencyMs: data.latencyMs,
        };
        setMessages((prev) => [...prev, copilotMsg]);
        setLoading(false);
        return;
      }
    } catch (e) {
      // fallback
    }

    // Local fallback reply
    setMessages((prev) => [
      ...prev,
      {
        id: `cop-${Date.now()}`,
        sender: 'copilot',
        text: 'Insiden dicatat. Rekomendasi mitigasi prioritas: Pertahankan isolasi host pada Automated Quarantine Enclave, validasi payload pada ingress NIPS, dan periksa process tree di endpoint HIPS.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        latencyMs: 5,
      },
    ]);
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-md sm:max-w-lg bg-[#0a1120] border border-cyan-500/40 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col h-[560px]">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950/60 to-slate-900 border-b border-slate-800 p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
            <Zap className="w-4 h-4 fill-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold font-mono-code text-slate-100">
                AEGIS SOC Copilot Agent
              </h3>
              <span className="text-[9px] font-mono-code font-bold px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-400/40 text-cyan-300">
                GROQ LPU
              </span>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>copilot-agent Online • Sub-20ms Latency</span>
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages area */}
      <div className="flex-1 p-3.5 overflow-y-auto space-y-3 font-mono-code text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-xl p-3 leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-cyan-600 text-slate-950 font-medium'
                  : 'bg-slate-900/90 border border-slate-800 text-slate-200 shadow-md'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>
            </div>

            <div className="flex items-center gap-2 mt-1 px-1 text-[10px] text-slate-500">
              <span>{msg.timestamp}</span>
              {msg.latencyMs !== undefined && (
                <span className="text-cyan-400 font-semibold">{msg.latencyMs}ms (Groq LPU)</span>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-cyan-400 text-xs py-2 px-1">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Groq copilot-agent sedang menganalisis telemetri...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="px-3 py-1.5 bg-slate-950/70 border-t border-slate-800/80 overflow-x-auto flex gap-1.5 scrollbar-none">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="shrink-0 text-[10px] font-mono-code px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors whitespace-nowrap"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input row */}
      <div className="p-3 bg-slate-950 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tanyakan copilot: investigasi serangan, isolasi, aturan IPS..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono-code text-slate-200 focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 disabled:opacity-50 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
