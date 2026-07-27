import type {
  EvidenceReceipt,
  EvidenceStance,
  InvestigationMode,
  InvestigationRecord,
  RoleId,
} from "./investigation";

const LOCAL_API_URL = "http://localhost:3001/v1";
const CONFIGURED_API_URL =
  process.env.NEXT_PUBLIC_LRWA_API_URL?.trim() || undefined;

function resolveApiUrl() {
  if (CONFIGURED_API_URL) {
    return CONFIGURED_API_URL.replace(/\/+$/, "");
  }

  if (
    typeof window !== "undefined" &&
    ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname)
  ) {
    return LOCAL_API_URL;
  }

  return null;
}

export class EvidenceApiError extends Error {
  constructor(
    message: string,
    public readonly kind: "unavailable" | "rejected" | "unknown",
    public readonly status?: number,
  ) {
    super(message);
    this.name = "EvidenceApiError";
  }
}

interface ServerRecord
  extends Omit<InvestigationRecord, "runtime" | "evidence"> {
  storage: {
    kind: "VOLATILE_IN_MEMORY";
    warning: string;
  };
  externalAccess: {
    state: "NOT_CONFIGURED";
    detail: string;
  };
  planning: {
    engine: "LOCAL_TEMPLATE" | "DEEPSEEK";
    mode: "NOT_REQUESTED" | "LIVE" | "DETERMINISTIC_FALLBACK";
    model?: string;
    reason?: string;
  };
  evidence: Array<Omit<EvidenceReceipt, "integrityAuthority">>;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const apiUrl = resolveApiUrl();
  if (!apiUrl) {
    throw new EvidenceApiError(
      "公开演示未配置远程证据服务，将只建立当前浏览器中的调查草稿。",
      "unavailable",
    );
  }

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 12_000);

  try {
    const response = await fetch(`${apiUrl}${path}`, {
      ...init,
      headers: {
        "content-type": "application/json",
        ...init?.headers,
      },
      signal: controller.signal,
    });
    if (!response.ok) {
      let detail = "";
      try {
        const body = (await response.json()) as { message?: string };
        detail = body.message ?? "";
      } catch {
        detail = "";
      }
      throw new EvidenceApiError(
        detail || `服务拒绝了这次操作（${response.status}）`,
        "rejected",
        response.status,
      );
    }
    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof EvidenceApiError) {
      throw error;
    }
    throw new EvidenceApiError(
      "请求结果未知：服务端可能已执行，但浏览器没有收到确认。请勿据此声称操作失败或重复外部行动。",
      "unknown",
    );
  } finally {
    window.clearTimeout(timeout);
  }
}

function fromServer(record: ServerRecord): InvestigationRecord {
  return {
    version: record.version,
    id: record.id,
    subject: record.subject,
    claim: record.claim,
    sourceNote: record.sourceNote,
    mode: record.mode,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    missions: record.missions,
    evidence: record.evidence.map((evidence) => ({
      ...evidence,
      integrityAuthority: "server",
    })),
    events: record.events,
    runtime: {
      connection: "server_connected",
      storage: "volatile_server",
      externalAccess: "not_configured",
      planning: {
        engine: record.planning.engine,
        mode: record.planning.mode,
        model: record.planning.model,
        reason: record.planning.reason,
      },
    },
  };
}

export async function createServerInvestigation(input: {
  idempotencyKey: string;
  subject: string;
  claim: string;
  sourceNote?: string;
  mode: InvestigationMode;
  roleIds: RoleId[];
  allowModelProcessing: boolean;
}): Promise<InvestigationRecord> {
  const record = await request<ServerRecord>(
    "/evidence-operations/investigations",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
  return fromServer(record);
}

export async function prepareServerMission(
  investigationId: string,
  roleId: RoleId,
): Promise<InvestigationRecord> {
  const record = await request<ServerRecord>(
    `/evidence-operations/investigations/${investigationId}/missions/${roleId}/prepare`,
    {
      method: "POST",
      body: JSON.stringify({ userConfirmedCopy: true }),
    },
  );
  return fromServer(record);
}

export async function confirmServerContact(
  investigationId: string,
  roleId: RoleId,
  channelLabel: string,
): Promise<InvestigationRecord> {
  const record = await request<ServerRecord>(
    `/evidence-operations/investigations/${investigationId}/missions/${roleId}/contact`,
    {
      method: "POST",
      body: JSON.stringify({
        userConfirmedExternalSend: true,
        channelLabel,
      }),
    },
  );
  return fromServer(record);
}

export async function addServerEvidence(
  investigationId: string,
  input: {
    id: string;
    roleId: RoleId;
    sourceLabel: string;
    sourceUrl?: string;
    capturedText: string;
    stance: EvidenceStance;
    capturedAt: string;
  },
): Promise<InvestigationRecord> {
  const record = await request<ServerRecord>(
    `/evidence-operations/investigations/${investigationId}/evidence`,
    {
      method: "POST",
      body: JSON.stringify({
        ...input,
        userConfirmedSource: true,
      }),
    },
  );
  return fromServer(record);
}
