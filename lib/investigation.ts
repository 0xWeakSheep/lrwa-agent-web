export type RoleId = "buyer" | "supplier" | "competitor" | "skeptic";

export type MissionStatus =
  | "planned"
  | "prepared"
  | "contacted"
  | "evidence_received";

export type InvestigationMode =
  | "assisted_live"
  | "authorized_connector"
  | "simulation_lab";

export type EvidenceStance = "supports" | "contradicts" | "context";

export type RuntimeConnection =
  | "server_connected"
  | "browser_only"
  | "server_sync_failed"
  | "server_sync_unknown";

export type PlanningMode =
  | "LIVE"
  | "DETERMINISTIC_FALLBACK"
  | "NOT_REQUESTED"
  | "LOCAL_ONLY";

export interface RoleBlueprint {
  id: RoleId;
  code: string;
  name: string;
  perspective: string;
  objective: string;
  opening: string;
  followUp: string;
  receipt: string;
  boundary: string;
}

export interface RoleMission extends RoleBlueprint {
  status: MissionStatus;
  preparedAt?: string;
  contactedAt?: string;
  contactChannel?: string;
}

export interface EvidenceReceipt {
  id: string;
  roleId: RoleId;
  sourceLabel: string;
  sourceUrl?: string;
  capturedText: string;
  stance: EvidenceStance;
  capturedAt: string;
  contentHash: string;
  authorization: "user_confirmed";
  recordedAt?: string;
  integrityAuthority: "server" | "browser";
}

export interface InvestigationEvent {
  id: string;
  type:
    | "INVESTIGATION_CREATED"
    | "PLAN_CREATED"
    | "STRATEGY_PREPARED"
    | "CONTACT_CONFIRMED"
    | "EVIDENCE_RECORDED";
  at: string;
  actor: "SYSTEM" | "USER_CONFIRMED";
  roleId?: RoleId;
  message: string;
}

export interface InvestigationRuntime {
  connection: RuntimeConnection;
  storage: "volatile_server" | "browser";
  externalAccess: "not_configured";
  planning: {
    engine: "DEEPSEEK" | "LOCAL_TEMPLATE" | "LOCAL_ONLY";
    mode: PlanningMode;
    model?: string;
    reason?: string;
  };
}

export interface InvestigationRecord {
  version: 2;
  id: string;
  subject: string;
  claim: string;
  sourceNote?: string;
  mode: InvestigationMode;
  createdAt: string;
  updatedAt: string;
  missions: RoleMission[];
  evidence: EvidenceReceipt[];
  events: InvestigationEvent[];
  runtime: InvestigationRuntime;
}

export const INVESTIGATION_STORAGE_KEY = "lrwa-investigation-v2";

export const roleBlueprints: RoleBlueprint[] = [
  {
    id: "buyer",
    code: "BUYER",
    name: "买家视角",
    perspective: "从真实购买旅程验证可售、交付与售后",
    objective: "确认公开承诺在实际咨询路径中是否成立。",
    opening:
      "我正在评估购买或到店体验，想确认目前实际可购买的产品、覆盖范围和高峰期可用情况。",
    followUp:
      "如果只得到模板回复，追问具体门店、时间窗口、交付限制和例外情况。",
    receipt: "客服原文、可用性页面、时间戳与对应入口",
    boundary: "使用真实主体和授权账号，不虚构个人资料。",
  },
  {
    id: "supplier",
    code: "SUPPLY",
    name: "供应链视角",
    perspective: "从合作前置问题验证补货、覆盖与产能",
    objective: "寻找经营规模与供应链能力之间能否相互解释。",
    opening:
      "我们正在评估潜在供货合作，想了解当前覆盖区域、补货频率、交付批次和验收流程。",
    followUp:
      "把模糊的规模表述落到频率、区域、最小批次和异常处理方式。",
    receipt: "授权沟通记录、公开合作条款或客户提供的供应资料",
    boundary: "涉及合作身份时必须由真实企业主体发起。",
  },
  {
    id: "competitor",
    code: "PEER",
    name: "同类样本",
    perspective: "用同一口径比较公开门店、价格与履约",
    objective: "建立可重复的同类样本，避免只看目标公司的自述。",
    opening:
      "按同一时间窗口和同一地理范围记录目标与同类品牌的公开可见信息。",
    followUp:
      "对缺失或冲突字段保留未知状态，不用行业均值自动补齐。",
    receipt: "公开页面快照、检索条件、采集时间与字段口径",
    boundary: "只使用允许访问的公开页面或正式数据接口。",
  },
  {
    id: "skeptic",
    code: "SKEPTIC",
    name: "财务挑战者",
    perspective: "主动寻找能推翻当前判断的替代解释",
    objective: "让每个差异都对应一个可被证伪的替代假设。",
    opening:
      "哪些未覆盖渠道、季节因素或会计口径，可能让现有证据低估或误解这项主张？",
    followUp:
      "把每个替代解释转成下一条证据请求，而不是直接写进结论。",
    receipt: "替代假设、所需原始凭证和可改变决策的阈值",
    boundary: "不把缺失证据当作负面证据。",
  },
];

export const modeLabels: Record<InvestigationMode, string> = {
  assisted_live: "人工协作调查",
  authorized_connector: "授权数据连接",
  simulation_lab: "方法模拟实验",
};

export const missionStatusLabels: Record<MissionStatus, string> = {
  planned: "策略待审核",
  prepared: "文本已准备",
  contacted: "用户确认已发送",
  evidence_received: "已录入回执",
};

export const stanceLabels: Record<EvidenceStance, string> = {
  supports: "支持主张",
  contradicts: "与主张冲突",
  context: "补充背景",
};

export function createInvestigationRecord(input: {
  subject: string;
  claim: string;
  sourceNote?: string;
  mode: InvestigationMode;
  roleIds: RoleId[];
  runtime?: InvestigationRuntime;
}): InvestigationRecord {
  const now = new Date().toISOString();
  const selected = new Set(input.roleIds);

  return {
    version: 2,
    id: crypto.randomUUID(),
    subject: input.subject.trim(),
    claim: input.claim.trim(),
    sourceNote: input.sourceNote?.trim() || undefined,
    mode: input.mode,
    createdAt: now,
    updatedAt: now,
    missions: roleBlueprints
      .filter((role) => selected.has(role.id))
      .map((role) => ({ ...role, status: "planned" })),
    evidence: [],
    events: [],
    runtime: input.runtime ?? {
      connection: "browser_only",
      storage: "browser",
      externalAccess: "not_configured",
      planning: {
        engine: "LOCAL_ONLY",
        mode: "LOCAL_ONLY",
      },
    },
  };
}

export function loadInvestigationRecord(): InvestigationRecord | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(INVESTIGATION_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as Partial<InvestigationRecord>;
    if (
      parsed.version !== 2 ||
      typeof parsed.id !== "string" ||
      typeof parsed.subject !== "string" ||
      typeof parsed.claim !== "string" ||
      parsed.mode === "authorized_connector" ||
      !Array.isArray(parsed.missions) ||
      !Array.isArray(parsed.evidence)
    ) {
      return null;
    }
    const record = parsed as InvestigationRecord;
    const hasReceiptWithoutConfirmedContact = record.evidence.some(
      (evidence) =>
        !record.missions.find(
          (mission) =>
            mission.id === evidence.roleId && Boolean(mission.contactedAt),
        ),
    );
    if (hasReceiptWithoutConfirmedContact) {
      return null;
    }
    return {
      ...record,
      evidence: record.evidence.map((evidence) => ({
        ...evidence,
        integrityAuthority: evidence.integrityAuthority ?? "browser",
      })),
      events: Array.isArray(record.events) ? record.events : [],
      runtime: record.runtime ?? {
        connection: "browser_only",
        storage: "browser",
        externalAccess: "not_configured",
        planning: {
          engine: "LOCAL_ONLY",
          mode: "LOCAL_ONLY",
        },
      },
    };
  } catch {
    return null;
  }
}

export function saveInvestigationRecord(
  record: InvestigationRecord,
): InvestigationRecord {
  const next = { ...record, updatedAt: new Date().toISOString() };
  window.localStorage.setItem(
    INVESTIGATION_STORAGE_KEY,
    JSON.stringify(next),
  );
  window.dispatchEvent(new Event("lrwa-investigation-updated"));
  return next;
}

export function clearInvestigationRecord() {
  window.localStorage.removeItem(INVESTIGATION_STORAGE_KEY);
  window.dispatchEvent(new Event("lrwa-investigation-updated"));
}

export async function hashEvidencePayload(payload: {
  roleId: RoleId;
  sourceLabel: string;
  sourceUrl?: string;
  capturedText: string;
  stance: EvidenceStance;
  capturedAt: string;
}): Promise<string> {
  const bytes = new TextEncoder().encode(JSON.stringify(payload));
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  const hash = Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  return `sha256:${hash}`;
}
