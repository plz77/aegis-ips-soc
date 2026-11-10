export type IPSModuleType = 'NIPS' | 'HIPS' | 'WIPS' | 'NBA' | 'AI_PROXY';

export type ThreatSeverity = 'CRITICAL' | 'ELEVATED' | 'HIGH' | 'MODERATE' | 'LOW';

export type MitigationStatus = 'DROPPED' | 'QUARANTINED' | 'BLOCKED' | 'MITIGATED' | 'ANALYZING' | 'ALLOWED';

export interface ThreatEvent {
  id: string;
  timestamp: string;
  module: IPSModuleType;
  title: string;
  attackType: string;
  sourceIp: string;
  targetIp: string;
  port?: number;
  payload: string;
  severity: ThreatSeverity;
  status: MitigationStatus;
  heuristicScore: number; // 0 - 100
  zeroDayProb: number; // 0 - 100%
  aiVerdict?: string;
  actionTaken: string;
}

export interface QuarantinedHost {
  id: string;
  hostname: string;
  ip: string;
  mac: string;
  pid?: number;
  processName?: string;
  isolatedAt: string;
  reason: string;
  sourceModule: IPSModuleType;
  threatScore: number;
  status: 'ISOLATED' | 'SANDBOXED' | 'RELEASED';
}

export interface PreventionRule {
  id: string;
  code: string;
  name: string;
  module: IPSModuleType;
  description: string;
  action: 'DROP_INLINE' | 'QUARANTINE_HOST' | 'DEAUTH_AP' | 'RESET_CONNECTION' | 'RATE_LIMIT' | 'AI_SANDBOX';
  severity: ThreatSeverity;
  enabled: boolean;
  matchCount: number;
}

export interface MetricTelemetry {
  eventsPerSec: number;
  threatsPrevented: number;
  hostQuarantines: number;
  engineHealth: number;
  globalThreatStatus: 'LOW' | 'MODERATE' | 'ELEVATED' | 'CRITICAL';
  
  // NIPS metrics
  nipsThroughput: number; // pps
  nipsPacketDrops: number;
  nipsActiveRules: number;
  
  // HIPS metrics
  hipsMonitoredPids: number;
  hipsSystemCallsSecured: boolean;
  hipsIsolatedPids: number;
  
  // WIPS metrics
  wipsMonitoredAps: number;
  wipsRogueAps: number;
  wipsDeauthMitigation: boolean;
  
  // NBA metrics
  nbaBaselineDev: number; // percentage (+1.2%)
  nbaAnomalyScore: number; // 24 / 100
  nbaDnsTunnelShield: boolean;

  // AI Proxy metrics (Topology Position)
  aiProxyDpiInspectedCount: number;
  aiProxyZeroDayIntercepts: number;
  aiProxyAverageHeuristicScore: number;
  aiProxyDynamicTrafficShapingRate: number; // Mbps
}

export interface TopologyNode {
  id: string;
  name: string;
  layer: string;
  badge?: string;
  type: 'WAN' | 'FIREWALL' | 'AI_PROXY' | 'IPS_CLUSTER' | 'QUARANTINE';
  description: string;
  subItems: string[];
  status: 'ACTIVE' | 'PROCESSING' | 'ALERT' | 'STANDBY';
  packetsHandled: number;
  threatsDetected: number;
}

export interface LivePacket {
  id: string;
  currentStep: 'WAN' | 'FIREWALL' | 'AI_PROXY' | 'CLEAN_IPS' | 'QUARANTINE';
  source: string;
  dest: string;
  attackVector?: string;
  payload: string;
  isThreat: boolean;
  moduleTarget?: IPSModuleType;
  heuristicScore: number;
  mlZeroDayRisk: number;
  trafficBandwidthMbps: number;
}
