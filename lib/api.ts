export const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "";

type RuntimeMode = "api" | "local";

interface BackendInvestigation {
  id: string;
  status: "DRAFT" | "PLANNED" | "APPROVED" | "RUNNING" | "COMPLETED";
  replayOf?: string;
}

interface BackendDemoBundle {
  case: unknown;
  investigation: BackendInvestigation;
}

export interface DemoSession {
  id: string;
  mode: RuntimeMode;
  status: BackendInvestigation["status"] | "COMPLETED";
}

export interface ReplaySession {
  id: string;
  mode: RuntimeMode;
  status: "RUNNING" | "COMPLETED";
  finding: ReplayFinding;
}

export interface ReplayFinding {
  estimatedValue: number;
  lowerBound: number;
  upperBound: number;
  gapPercent: number;
  confidence: number;
}

const localReplayFinding: ReplayFinding = {
  estimatedValue: 2_400_000,
  lowerBound: 2_115_600,
  upperBound: 2_717_800,
  gapPercent: 27.9,
  confidence: 0.82,
};

interface BackendFinding extends ReplayFinding {
  reportedValue: number;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!apiBaseUrl) {
    throw new Error("No LRWA API URL is configured");
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      accept: "application/json",
      ...(init?.body ? { "content-type": "application/json" } : {}),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`LRWA API returned ${response.status}`);
  }

  return (await response.json()) as T;
}

function post<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, {
    method: "POST",
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

export async function launchDemoInvestigation(): Promise<DemoSession> {
  if (!apiBaseUrl) {
    return {
      id: "demo-investigation",
      mode: "local",
      status: "COMPLETED",
    };
  }

  try {
    const bundle = await post<BackendDemoBundle>("/demo/cases", {
      seed: "240727",
    });
    let investigation = bundle.investigation;

    if (investigation.status === "DRAFT") {
      investigation = await post<BackendInvestigation>(
        `/investigations/${investigation.id}/plan`,
      );
    }
    if (investigation.status === "PLANNED") {
      investigation = await post<BackendInvestigation>(
        `/investigations/${investigation.id}/approve`,
      );
    }
    if (investigation.status === "APPROVED") {
      investigation = await post<BackendInvestigation>(
        `/investigations/${investigation.id}/start`,
      );
    }

    return {
      id: investigation.id,
      mode: "api",
      status: investigation.status,
    };
  } catch {
    return {
      id: "demo-investigation",
      mode: "local",
      status: "COMPLETED",
    };
  }
}

export async function replayInvestigation(
  investigationId: string,
  corporateOrderShare: number,
): Promise<ReplaySession> {
  if (investigationId === "demo-investigation") {
    return {
      id: "demo-replay-20",
      mode: "local",
      status: "COMPLETED",
      finding: localReplayFinding,
    };
  }

  try {
    const replay = await post<BackendInvestigation>(
      `/investigations/${investigationId}/replay`,
      { corporateOrderShare },
    );
    const findings = await request<BackendFinding[]>(
      `/investigations/${replay.id}/findings`,
    );
    const finding =
      findings.find((item) => item.reportedValue === 3_330_000) ??
      localReplayFinding;
    return {
      id: replay.id,
      mode: "api",
      status: replay.status === "COMPLETED" ? "COMPLETED" : "RUNNING",
      finding,
    };
  } catch {
    return {
      id: "demo-replay-20",
      mode: "local",
      status: "COMPLETED",
      finding: localReplayFinding,
    };
  }
}

export function getEventStreamUrl(investigationId: string): string {
  return `${apiBaseUrl}/investigations/${encodeURIComponent(investigationId)}/events`;
}
