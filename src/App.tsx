import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  Layers,
  Network,
  Server,
  Wifi,
  LineChart,
  Cpu,
  Lock,
  ShieldAlert,
  Sliders,
  Zap,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

import { Header } from './components/Header';
import { MetricCards } from './components/MetricCards';
import { AttackSimulator } from './components/AttackSimulator';
import { VolumetricChart, ThroughputDataPoint } from './components/VolumetricChart';
import { MitigationDonut } from './components/MitigationDonut';
import { ModuleCards } from './components/ModuleCards';
import { TopologyView } from './components/TopologyView';
import { ThreatFeedTab } from './components/ThreatFeedTab';
import { QuarantineTab } from './components/QuarantineTab';
import { PreventionRulesTab } from './components/PreventionRulesTab';
import { ModuleDetailsTab } from './components/ModuleDetailsTab';
import { AIProxyInspector } from './components/AIProxyInspector';
import { SOCCopilotWidget } from './components/SOCCopilotWidget';
import { Footer } from './components/Footer';

import {
  initialMetrics,
  initialThreatFeed,
  initialQuarantinedHosts,
  initialPreventionRules,
  simulationPresets,
} from './data/initialData';
import {
  MetricTelemetry,
  ThreatEvent,
  QuarantinedHost,
  PreventionRule,
  IPSModuleType,
} from './types/cyber';

type ActiveTab =
  | 'overview'
  | 'topology'
  | 'nips'
  | 'hips'
  | 'wips'
  | 'nba'
  | 'ai_proxy'
  | 'threats'
  | 'quarantine'
  | 'rules';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [metrics, setMetrics] = useState<MetricTelemetry>(initialMetrics);
  const [threatFeed, setThreatFeed] = useState<ThreatEvent[]>(initialThreatFeed);
  const [quarantinedHosts, setQuarantinedHosts] = useState<QuarantinedHost[]>(initialQuarantinedHosts);
  const [rules, setRules] = useState<PreventionRule[]>(initialPreventionRules);
  const [isEngineActive, setIsEngineActive] = useState<boolean>(true);
  const [showTopologyDrawer, setShowTopologyDrawer] = useState<boolean>(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);

  // Simulation state
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [activeAttackId, setActiveAttackId] = useState<string | undefined>();
  const [activeAttackName, setActiveAttackName] = useState<string | undefined>();
  const [activeAttackModule, setActiveAttackModule] = useState<IPSModuleType | null>(null);

  // Volumetric Throughput Chart Data (15 seconds historical)
  const [chartData, setChartData] = useState<ThroughputDataPoint[]>([
    { timeLabel: '15s ago', trafficMbps: 450, threatMbps: 25 },
    { timeLabel: '14s ago', trafficMbps: 460, threatMbps: 20 },
    { timeLabel: '13s ago', trafficMbps: 455, threatMbps: 22 },
    { timeLabel: '12s ago', trafficMbps: 470, threatMbps: 28 },
    { timeLabel: '11s ago', trafficMbps: 465, threatMbps: 24 },
    { timeLabel: '10s ago', trafficMbps: 480, threatMbps: 30 },
    { timeLabel: '9s ago', trafficMbps: 490, threatMbps: 26 },
    { timeLabel: '8s ago', trafficMbps: 505, threatMbps: 35 },
    { timeLabel: '7s ago', trafficMbps: 510, threatMbps: 32 },
    { timeLabel: '6s ago', trafficMbps: 500, threatMbps: 28 },
    { timeLabel: '5s ago', trafficMbps: 495, threatMbps: 25 },
    { timeLabel: '4s ago', trafficMbps: 480, threatMbps: 30 },
    { timeLabel: '3s ago', trafficMbps: 470, threatMbps: 22 },
    { timeLabel: '2s ago', trafficMbps: 490, threatMbps: 25 },
    { timeLabel: '1s ago', trafficMbps: 485, threatMbps: 24 },
    { timeLabel: 'now', trafficMbps: 488, threatMbps: 26 },
  ]);

  const currentTraffic = chartData[chartData.length - 1]?.trafficMbps || 488;
  const currentThreat = chartData[chartData.length - 1]?.threatMbps || 26;

  // Real-time engine heartbeat
  useEffect(() => {
    if (!isEngineActive) return;

    const interval = setInterval(() => {
      // Natural jitter for metrics
      setMetrics((prev) => {
        const ppsDelta = Math.floor((Math.random() - 0.5) * 8);
        const newEvents = Math.max(145, Math.min(165, prev.eventsPerSec + ppsDelta));
        return {
          ...prev,
          eventsPerSec: newEvents,
        };
      });

      // Shift chart data smoothly
      setChartData((prev) => {
        const last = prev[prev.length - 1];
        let baseTraffic = 475 + Math.sin(Date.now() / 4000) * 35;
        let baseThreat = 20 + Math.sin(Date.now() / 3000) * 8;

        if (isSimulating) {
          baseTraffic += 90;
          baseThreat += 70;
        }

        const nextPoint: ThroughputDataPoint = {
          timeLabel: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }),
          trafficMbps: Math.round(baseTraffic),
          threatMbps: Math.round(baseThreat),
        };

        return [...prev.slice(1), nextPoint];
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [isEngineActive, isSimulating]);

  // Handle live test vector triggers from the simulator
  const handleTriggerAttack = (preset: typeof simulationPresets[0]) => {
    setIsSimulating(true);
    setActiveAttackId(preset.id);
    setActiveAttackName(preset.label);
    setActiveAttackModule(preset.module);

    // Update metrics: increment threats prevented
    setMetrics((prev) => {
      let drops = prev.nipsPacketDrops;
      let isolatedPids = prev.hipsIsolatedPids;
      let rogueAps = prev.wipsRogueAps;
      let quHosts = prev.hostQuarantines;

      if (preset.module === 'NIPS') drops += 15;
      if (preset.module === 'HIPS') {
        isolatedPids += 1;
        quHosts += 1;
      }
      if (preset.module === 'WIPS') rogueAps = Math.max(rogueAps, 2);
      if (preset.module === 'AI_PROXY') quHosts += 1;

      return {
        ...prev,
        threatsPrevented: prev.threatsPrevented + 1,
        nipsPacketDrops: drops,
        hipsIsolatedPids: isolatedPids,
        wipsRogueAps: rogueAps,
        hostQuarantines: quHosts,
        globalThreatStatus: 'ELEVATED',
      };
    });

    // Spike chart data
    setChartData((prev) => {
      const copy = [...prev];
      const lastIndex = copy.length - 1;
      copy[lastIndex] = {
        ...copy[lastIndex],
        trafficMbps: copy[lastIndex].trafficMbps + preset.trafficSpike,
        threatMbps: copy[lastIndex].threatMbps + preset.threatSpike,
      };
      return copy;
    });

    // Create realistic threat log event
    const nowStr = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const newThreatEvent: ThreatEvent = {
      id: `EVT-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: nowStr,
      module: preset.module,
      title: `${preset.title} Dropped & Neutralized`,
      attackType: preset.label,
      sourceIp: `198.51.100.${Math.floor(10 + Math.random() * 200)}`,
      targetIp: '10.0.1.45',
      port: preset.module === 'NIPS' ? 443 : preset.module === 'NBA' ? 53 : 8080,
      payload: `[VECTOR INTERCEPT] ${preset.description}`,
      severity: 'CRITICAL',
      status: preset.module === 'HIPS' ? 'QUARANTINED' : 'DROPPED',
      heuristicScore: preset.heuristicScore,
      zeroDayProb: preset.zeroDayProb,
      aiVerdict: `AI Intelligence Proxy routed this ${preset.module} payload based on DPI heuristic score (${preset.heuristicScore}/100).`,
      actionTaken:
        preset.module === 'HIPS'
          ? 'HOST_QUARANTINE_ISOLATE'
          : preset.module === 'WIPS'
          ? 'DEAUTH_MITIGATION_ACTIVE'
          : preset.module === 'NBA'
          ? 'DNS_SINKHOLE_APPLIED'
          : 'INLINE_PACKET_DROP',
    };

    setThreatFeed((prev) => [newThreatEvent, ...prev]);

    // If HIPS or AI_PROXY, also isolate host into Quarantine Enclave
    if (preset.module === 'HIPS' || preset.module === 'AI_PROXY') {
      const newQuarantinedHost: QuarantinedHost = {
        id: `Q-${String(quarantinedHosts.length + 1).padStart(2, '0')}`,
        hostname: `ENDPOINT-${Math.floor(100 + Math.random() * 899)}`,
        ip: newThreatEvent.sourceIp,
        mac: `00:50:56:C0:${Math.floor(10 + Math.random() * 89)}:${Math.floor(10 + Math.random() * 89)}`,
        pid: Math.floor(1000 + Math.random() * 8000),
        processName: preset.module === 'HIPS' ? 'vssadmin.exe' : 'polymorphic_shell.bin',
        isolatedAt: nowStr,
        reason: `${preset.title} intercepted by AI Proxy`,
        sourceModule: preset.module,
        threatScore: preset.heuristicScore,
        status: 'ISOLATED',
      };
      setQuarantinedHosts((prev) => [newQuarantinedHost, ...prev]);
    }

    // Finish simulation burst after 3 seconds
    setTimeout(() => {
      setIsSimulating(false);
      setActiveAttackId(undefined);
      setActiveAttackName(undefined);
      setActiveAttackModule(null);
      setMetrics((prev) => ({
        ...prev,
        globalThreatStatus: 'MODERATE',
      }));
    }, 3200);
  };

  const handleResetBaseline = () => {
    setMetrics(initialMetrics);
    setThreatFeed(initialThreatFeed);
    setQuarantinedHosts(initialQuarantinedHosts);
    setIsSimulating(false);
    setActiveAttackId(undefined);
    setActiveAttackName(undefined);
    setActiveAttackModule(null);
  };

  const handleToggleRule = (ruleId: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handleAddRule = (newRuleData: Omit<PreventionRule, 'id' | 'matchCount'>) => {
    const newRule: PreventionRule = {
      ...newRuleData,
      id: `RULE-${Date.now().toString().slice(-3)}`,
      matchCount: 0,
    };
    setRules((prev) => [newRule, ...prev]);
  };

  const handleReleaseHost = (hostId: string) => {
    setQuarantinedHosts((prev) => prev.filter((h) => h.id !== hostId));
    setMetrics((prev) => ({
      ...prev,
      hostQuarantines: Math.max(0, prev.hostQuarantines - 1),
    }));
  };

  const handleSandboxHost = (hostId: string) => {
    setQuarantinedHosts((prev) =>
      prev.map((h) => (h.id === hostId ? { ...h, status: 'SANDBOXED' } : h))
    );
  };

  const navTabs: { id: ActiveTab; label: string; count?: number; badgeColor?: string }[] = [
    { id: 'overview', label: 'SOC Overview' },
    { id: 'topology', label: 'Network Topology (AI Proxy Layer)', badgeColor: 'text-cyan-400 bg-cyan-950/80 border-cyan-500/40' },
    { id: 'nips', label: '1. NIPS (Network)' },
    { id: 'hips', label: '2. HIPS (Host)' },
    { id: 'wips', label: '3. WIPS (Wireless)' },
    { id: 'nba', label: '4. NBA (Behavior)' },
    { id: 'ai_proxy', label: 'AI Proxy & DPI Engine' },
    { id: 'threats', label: 'Real-Time Threat Feed', count: threatFeed.length },
    { id: 'quarantine', label: 'Quarantine Enclave', count: quarantinedHosts.length, badgeColor: 'text-rose-400 bg-rose-950/80 border-rose-500/40' },
    { id: 'rules', label: 'Active Prevention Rules', count: rules.length },
  ];

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Header matching PNG */}
      <Header
        threatStatus={metrics.globalThreatStatus}
        isEngineActive={isEngineActive}
        onToggleEngine={() => setIsEngineActive(!isEngineActive)}
        onResetData={handleResetBaseline}
        activeSimulating={isSimulating}
        activeAttackName={activeAttackName}
      />

      {/* Navigation Tabs Bar matching PNG */}
      <div className="w-full bg-[#090f1d] border-b border-slate-800/80 px-4 lg:px-6 py-2 overflow-x-auto scrollbar-none sticky top-[61px] z-30">
        <div className="flex items-center gap-1.5 min-w-max">
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono-code transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/15 border border-cyan-500/60 text-cyan-300 font-bold shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded border ${
                      tab.badgeColor || 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content View Container */}
      <main className="flex-1 p-4 lg:p-6 max-w-[1600px] w-full mx-auto space-y-5">
        {/* TAB 1: SOC OVERVIEW (EXACT SCREENSHOT LAYOUT) */}
        {activeTab === 'overview' && (
          <div className="space-y-5">
            {/* 1. Top 4 Metric Cards */}
            <MetricCards
              metrics={metrics}
              onNavigateToQuarantine={() => setActiveTab('quarantine')}
              onNavigateToFeed={() => setActiveTab('threats')}
            />

            {/* 2. Attack Simulator Panel */}
            <AttackSimulator
              onTriggerAttack={handleTriggerAttack}
              activeAttackId={activeAttackId}
              isSimulating={isSimulating}
            />

            {/* Topology Flow Banner (Adapting topologi_aplikasi_eea8c7c4.txt directly into the overview) */}
            <div className="bg-gradient-to-r from-cyan-950/50 via-slate-900/90 to-blue-950/40 border border-cyan-500/30 rounded-xl p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono-code text-cyan-300">
                      AI INTELLIGENCE PROXY TOPOLOGY PIPELINE
                    </span>
                    <span className="text-[10px] font-mono-code px-2 py-0.2 rounded bg-cyan-950 border border-cyan-500/50 text-cyan-300">
                      POSISI BARU
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Trafik Masuk &rarr; [Hardware Firewall L3/L4] &rarr; [AI Intelligence Proxy: DPI & Heuristic Scoring] &rarr; Bersih ke [Modul IPS] vs Anomali ke [Automated Quarantine].
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('topology')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-900/50 text-xs font-mono-code transition-colors"
                >
                  <span>Open Full Interactive Map</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 3. Middle Section: Dual Charts Row (Volumetric Chart ~65% + Mitigation Donut ~35%) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-8">
                <VolumetricChart
                  data={chartData}
                  currentTraffic={currentTraffic}
                  currentThreat={currentThreat}
                />
              </div>

              <div className="lg:col-span-4">
                <MitigationDonut
                  onSelectModule={(mod) => {
                    if (mod === 'NIPS') setActiveTab('nips');
                    else if (mod === 'HIPS') setActiveTab('hips');
                    else if (mod === 'WIPS') setActiveTab('wips');
                    else if (mod === 'NBA') setActiveTab('nba');
                  }}
                  totalThreats={metrics.threatsPrevented}
                />
              </div>
            </div>

            {/* 4. Bottom Row: 4 IPS Module Cards (NIPS, HIPS, WIPS, NBA) */}
            <ModuleCards
              metrics={metrics}
              onSelectModule={(mod) => {
                if (mod === 'NIPS') setActiveTab('nips');
                else if (mod === 'HIPS') setActiveTab('hips');
                else if (mod === 'WIPS') setActiveTab('wips');
                else if (mod === 'NBA') setActiveTab('nba');
              }}
              activeAttackModule={activeAttackModule}
            />
          </div>
        )}

        {/* TAB 2: NETWORK TOPOLOGY (AI PROXY LAYER - From txt file) */}
        {activeTab === 'topology' && (
          <TopologyView
            onInjectThreat={(type) => {
              // trigger corresponding attack
              const preset = simulationPresets.find((p) => p.module === 'AI_PROXY') || simulationPresets[0];
              handleTriggerAttack(preset);
            }}
            isEngineActive={isEngineActive}
          />
        )}

        {/* TAB 3: NIPS DETAILS */}
        {activeTab === 'nips' && (
          <ModuleDetailsTab
            module="NIPS"
            metrics={metrics}
            onTriggerAttack={handleTriggerAttack}
          />
        )}

        {/* TAB 4: HIPS DETAILS */}
        {activeTab === 'hips' && (
          <ModuleDetailsTab
            module="HIPS"
            metrics={metrics}
            onTriggerAttack={handleTriggerAttack}
          />
        )}

        {/* TAB 5: WIPS DETAILS */}
        {activeTab === 'wips' && (
          <ModuleDetailsTab
            module="WIPS"
            metrics={metrics}
            onTriggerAttack={handleTriggerAttack}
          />
        )}

        {/* TAB 6: NBA DETAILS */}
        {activeTab === 'nba' && (
          <ModuleDetailsTab
            module="NBA"
            metrics={metrics}
            onTriggerAttack={handleTriggerAttack}
          />
        )}

        {/* TAB 7: AI PROXY & DPI ENGINE */}
        {activeTab === 'ai_proxy' && (
          <AIProxyInspector
            onQuarantineVerdict={(payload, score) => {
              setMetrics((prev) => ({
                ...prev,
                threatsPrevented: prev.threatsPrevented + 1,
                hostQuarantines: prev.hostQuarantines + 1,
              }));
              const newHost: QuarantinedHost = {
                id: `Q-${String(quarantinedHosts.length + 1).padStart(2, '0')}`,
                hostname: `DPI-FLAGGED-HOST-${Math.floor(100 + Math.random() * 899)}`,
                ip: `198.51.100.${Math.floor(10 + Math.random() * 200)}`,
                mac: '52:54:00:12:34:56',
                isolatedAt: new Date().toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                }),
                reason: 'DPI Heuristic Score Exceeded Safe Threshold',
                sourceModule: 'AI_PROXY',
                threatScore: score,
                status: 'ISOLATED',
              };
              setQuarantinedHosts((prev) => [newHost, ...prev]);
            }}
          />
        )}

        {/* TAB 8: REAL-TIME THREAT FEED */}
        {activeTab === 'threats' && <ThreatFeedTab threats={threatFeed} />}

        {/* TAB 9: QUARANTINE ENCLAVE (18 HOSTS) */}
        {activeTab === 'quarantine' && (
          <QuarantineTab
            hosts={quarantinedHosts}
            onReleaseHost={handleReleaseHost}
            onSandboxHost={handleSandboxHost}
          />
        )}

        {/* TAB 10: ACTIVE PREVENTION RULES */}
        {activeTab === 'rules' && (
          <PreventionRulesTab
            rules={rules}
            onToggleRule={handleToggleRule}
            onAddRule={handleAddRule}
          />
        )}
      </main>

      {/* Floating Groq SOC Copilot Button */}
      <button
        onClick={() => setIsCopilotOpen(!isCopilotOpen)}
        className="fixed bottom-12 right-6 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-slate-950 font-bold font-mono-code text-xs shadow-[0_0_20px_rgba(6,182,212,0.4)] border border-cyan-300 cursor-pointer transition-all hover:scale-105"
        title="Open SOC Copilot (Groq LPU)"
      >
        <Zap className="w-4 h-4 fill-slate-950" />
        <span>SOC Copilot (Groq)</span>
        <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
      </button>

      {/* SOC Copilot Modal */}
      <SOCCopilotWidget
        metrics={metrics}
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
      />

      {/* Footer matching PNG */}
      <Footer />
    </div>
  );
}
