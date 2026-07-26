export type EvidenceChannel =
  | "storefront"
  | "demand"
  | "support"
  | "supply"
  | "staffing";

export type InvestigationStatus =
  | "draft"
  | "planned"
  | "approved"
  | "running"
  | "challenging"
  | "completed";

export interface BusinessClaim {
  id: string;
  label: string;
  metricKey: string;
  claimedValue: number;
  unit: string;
  period: string;
  materiality: "high" | "medium";
}

export interface InvestigationPlan {
  caseId: string;
  probeCount: number;
  storeCount: number;
  dayCount: number;
  timeSlotCount: number;
  personaCount: number;
  channels: EvidenceChannel[];
  seed: number;
  budgetCredits: number;
}

export interface StoreSignal {
  id: string;
  name: string;
  district: string;
  x: number;
  y: number;
  status: "pending" | "verified" | "attention" | "closed";
  probes: number;
}

export interface EvidenceArtifact {
  id: string;
  claimId: string;
  title: string;
  channel: EvidenceChannel;
  stance: "supports" | "contradicts" | "context";
  sourceLabel: string;
  observedAt: string;
  permission: "SIMULATED";
  hash: string;
  agent: string;
  tool: string;
  summary: string;
}

export interface InvestigationMetrics {
  completedProbes: number;
  totalProbes: number;
  activeStores: number;
  estimatedMonthlyGmv: number;
  lowerBound: number;
  upperBound: number;
  confidence: number;
  realityGap: number;
}

export interface InvestigationEvent {
  id: string;
  sequence: number;
  type:
    | "investigation.started"
    | "probe.batch.completed"
    | "evidence.verified"
    | "estimate.updated"
    | "hypothesis.raised"
    | "replay.started"
    | "investigation.completed";
  occurredAt: string;
  agent: string;
  message: string;
  metrics?: Partial<InvestigationMetrics>;
  evidence?: EvidenceArtifact;
}

export interface Finding {
  id: string;
  claimId: string;
  verdict: "supported" | "contradicted" | "insufficient";
  headline: string;
  summary: string;
  claimedValue: number;
  estimatedValue: number;
  lowerBound: number;
  upperBound: number;
  unit: string;
  confidence: number;
  alternativeHypotheses: string[];
  nextActions: string[];
}

export interface DemoCase {
  id: string;
  companyName: string;
  companyNameZh: string;
  stage: string;
  sector: string;
  scenarioLabel: string;
  summary: string;
  status: InvestigationStatus;
  claims: BusinessClaim[];
  plan: InvestigationPlan;
  stores: StoreSignal[];
  baselineMetrics: InvestigationMetrics;
  finalMetrics: InvestigationMetrics;
  evidence: EvidenceArtifact[];
  finding: Finding;
}
