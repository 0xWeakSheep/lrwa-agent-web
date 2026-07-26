"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, ProgressBar } from "@carbon/react";
import {
  Activity,
  ArrowRight,
  Checkmark,
  CircleDash,
  DataConnected,
  PauseFilled,
  PlayFilledAlt,
  Renew,
  WarningAlt,
} from "@carbon/icons-react";
import { createLocalDemoEvents, demoCase } from "@/lib/demo-data";
import { getEventStreamUrl } from "@/lib/api";
import type {
  InvestigationEvent,
  InvestigationMetrics,
} from "@/lib/types";
import { StoreField } from "./store-field";

type FeedMode = "connecting" | "api" | "local";

interface BackendEvent {
  id?: string;
  sequence?: number;
  type?: string;
  at?: string;
  agentRole?: string;
  message?: string;
  data?: Record<string, string | number | boolean>;
}

const backendEventTypes = [
  "CASE_CREATED",
  "PLAN_PROPOSED",
  "PLAN_APPROVED",
  "INVESTIGATION_STARTED",
  "AGENT_DISPATCHED",
  "TOOL_POLICY_CHECKED",
  "EVIDENCE_CAPTURED",
  "AGENT_TASK_COMPLETED",
  "EVIDENCE_AUDITED",
  "ESTIMATE_COMPUTED",
  "FINDING_COMPUTED",
  "INVESTIGATION_COMPLETED",
  "REPLAY_CREATED",
  "HYPOTHESIS_RAISED",
  "REPLAY_STARTED",
];

const agents = [
  ["Mission Orchestrator", "Supervisor"],
  ["Geo Observer", "Storefront"],
  ["Demand Observer", "Consumer panel"],
  ["Channel Auditor", "Digital channels"],
  ["Supply Observer", "Capacity"],
  ["Operations Observer", "Staffing"],
  ["Evidence Verifier", "Audit ledger"],
  ["Statistician", "Scenario bands"],
  ["Skeptic Agent", "Counterfactual"],
];

function mergeMetrics(
  current: InvestigationMetrics,
  patch?: Partial<InvestigationMetrics>,
): InvestigationMetrics {
  return patch ? { ...current, ...patch } : current;
}

function formatMillions(value: number) {
  return `¥${(value / 1_000_000).toFixed(2)}m`;
}

function mapBackendEvent(
  raw: BackendEvent,
  index: number,
  completedProbes: number,
): InvestigationEvent {
  const localFrames = createLocalDemoEvents();
  const type = raw.type ?? "";
  const progress =
    type === "INVESTIGATION_COMPLETED"
      ? 1
      : Math.min(1, Math.max(0, completedProbes / 1024));
  const frameIndex =
    type === "INVESTIGATION_COMPLETED"
      ? localFrames.length - 1
      : Math.min(localFrames.length - 2, Math.floor(progress * 6));
  const frame = localFrames[frameIndex] ?? localFrames[0];
  const apiMetrics: Partial<InvestigationMetrics> = {};
  const metricKeys = [
    "estimatedMonthlyGmv",
    "lowerBound",
    "upperBound",
    "confidence",
  ] as const;
  metricKeys.forEach((key) => {
    const value = raw.data?.[key];
    if (typeof value === "number") {
      apiMetrics[key] = value;
    }
  });

  const mappedType: InvestigationEvent["type"] =
    type === "INVESTIGATION_COMPLETED"
      ? "investigation.completed"
      : type === "HYPOTHESIS_RAISED"
        ? "hypothesis.raised"
        : type === "TOOL_POLICY_CHECKED" ||
            type === "EVIDENCE_CAPTURED"
          ? "evidence.verified"
        : type === "EVIDENCE_AUDITED"
          ? "evidence.verified"
        : type === "FINDING_COMPUTED" || type === "ESTIMATE_COMPUTED"
          ? "estimate.updated"
          : type === "REPLAY_CREATED"
            ? "replay.started"
            : type === "AGENT_TASK_COMPLETED"
              ? "probe.batch.completed"
              : "investigation.started";

  return {
    id: raw.id ?? `api-event-${index}`,
    sequence: raw.sequence ?? index + 1,
    type: mappedType,
    occurredAt: raw.at ?? new Date().toISOString(),
    agent: raw.agentRole?.replaceAll("_", " ") ?? "Supervisor",
    message: raw.message ?? "Verified API event received.",
    metrics:
      type === "INVESTIGATION_COMPLETED"
        ? demoCase.finalMetrics
        : {
            ...frame?.metrics,
            ...apiMetrics,
            completedProbes,
          },
  };
}

export function LiveMission() {
  const [events, setEvents] = useState<InvestigationEvent[]>([]);
  const [metrics, setMetrics] = useState(demoCase.baselineMetrics);
  const [feedMode, setFeedMode] = useState<FeedMode>("connecting");
  const [isPaused, setIsPaused] = useState(false);
  const [runKey, setRunKey] = useState(0);
  const [estimateHistory, setEstimateHistory] = useState<number[]>([
    demoCase.baselineMetrics.estimatedMonthlyGmv,
  ]);
  const timersRef = useRef<number[]>([]);
  const pendingRef = useRef<InvestigationEvent[]>([]);
  const isPausedRef = useRef(false);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  }, []);

  const appendEvent = useCallback((event: InvestigationEvent) => {
    setEvents((current) => {
      if (current.some((item) => item.id === event.id)) {
        return current;
      }
      return [...current, event].sort((a, b) => a.sequence - b.sequence);
    });
    setMetrics((current) => {
      const next = mergeMetrics(current, event.metrics);
      if (
        event.metrics?.estimatedMonthlyGmv !== undefined &&
        event.metrics.estimatedMonthlyGmv !==
          current.estimatedMonthlyGmv
      ) {
        setEstimateHistory((history) => [
          ...history,
          event.metrics?.estimatedMonthlyGmv ??
            current.estimatedMonthlyGmv,
        ]);
      }
      return next;
    });
  }, []);

  const scheduleFeed = useCallback(
    (items: InvestigationEvent[], mode: Exclude<FeedMode, "connecting">) => {
      clearTimers();
      setFeedMode(mode);
      pendingRef.current = items;
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const cadence = reduceMotion ? 30 : 760;
      items.forEach((event, index) => {
        const timer = window.setTimeout(() => {
          if (isPausedRef.current) {
            pendingRef.current = items.slice(index);
            return;
          }
          appendEvent(event);
          pendingRef.current = items.slice(index + 1);
        }, index * cadence);
        timersRef.current.push(timer);
      });
    },
    [appendEvent, clearTimers],
  );

  useEffect(() => {
    const localEvents = createLocalDemoEvents();
    const params = new URLSearchParams(window.location.search);
    const investigationId =
      params.get("investigationId") ??
      window.localStorage.getItem("lrwa-investigation-id") ??
      "demo-investigation";
    const apiMode =
      window.localStorage.getItem("lrwa-api-mode") === "api" &&
      investigationId !== "demo-investigation";

    if (!apiMode) {
      const localTimer = window.setTimeout(
        () => scheduleFeed(localEvents, "local"),
        0,
      );
      timersRef.current.push(localTimer);
      return clearTimers;
    }

    const source = new EventSource(getEventStreamUrl(investigationId));
    const apiEvents: InvestigationEvent[] = [];
    let completedProbes = 0;
    let received = false;
    let fallbackScheduled = false;

    const handleApiEvent = (message: MessageEvent<string>) => {
      try {
        received = true;
        const raw = JSON.parse(message.data) as BackendEvent;
        if (
          raw.type === "AGENT_TASK_COMPLETED" &&
          typeof raw.data?.sampleSize === "number"
        ) {
          completedProbes = Math.min(
            1024,
            completedProbes + raw.data.sampleSize,
          );
        } else if (raw.type === "INVESTIGATION_COMPLETED") {
          completedProbes = 1024;
        }
        apiEvents.push(
          mapBackendEvent(raw, apiEvents.length, completedProbes),
        );
      } catch {
        // An invalid event is ignored; the deterministic fallback stays armed.
      }
    };

    source.onmessage = handleApiEvent;
    backendEventTypes.forEach((eventType) => {
      source.addEventListener(eventType, handleApiEvent as EventListener);
    });

    const settleTimer = window.setTimeout(() => {
      source.close();
      if (fallbackScheduled) {
        return;
      }
      if (apiEvents.length > 0) {
        scheduleFeed(apiEvents, "api");
      } else {
        fallbackScheduled = true;
        scheduleFeed(localEvents, "local");
      }
    }, 1100);
    timersRef.current.push(settleTimer);

    source.onerror = () => {
      source.close();
      if (!received && !fallbackScheduled) {
        fallbackScheduled = true;
        scheduleFeed(localEvents, "local");
      }
    };

    return () => {
      source.close();
      clearTimers();
    };
  }, [clearTimers, runKey, scheduleFeed]);

  function togglePause() {
    if (!isPaused) {
      clearTimers();
      isPausedRef.current = true;
      setIsPaused(true);
      return;
    }

    isPausedRef.current = false;
    setIsPaused(false);
    const remainder = pendingRef.current;
    window.setTimeout(() => scheduleFeed(remainder, feedMode === "api" ? "api" : "local"), 0);
  }

  function restart() {
    clearTimers();
    isPausedRef.current = false;
    setIsPaused(false);
    setFeedMode("connecting");
    setEvents([]);
    setMetrics(demoCase.baselineMetrics);
    setEstimateHistory([demoCase.baselineMetrics.estimatedMonthlyGmv]);
    setRunKey((value) => value + 1);
  }

  const progress = metrics.completedProbes / metrics.totalProbes;
  const complete =
    events.some((event) => event.type === "investigation.completed") ||
    metrics.completedProbes >= metrics.totalProbes;
  const activeAgentCount = complete
    ? 0
    : Math.min(agents.length, Math.ceil(progress * agents.length));
  const chartPoints = estimateHistory.map((value, index) => {
    const width = 300;
    const height = 86;
    const x =
      estimateHistory.length === 1
        ? 0
        : (index / (estimateHistory.length - 1)) * width;
    const min = 1_600_000;
    const max = 3_400_000;
    const y = height - ((value - min) / (max - min)) * height;
    return `${x},${Math.max(2, Math.min(height - 2, y))}`;
  });

  return (
    <div className="live-layout">
      <section className="live-primary" aria-label="Live mission control">
        <div className="live-toolbar">
          <div className="runtime-state">
            <span className={complete ? "runtime-pulse complete" : "runtime-pulse"} />
            <div>
              <strong>{complete ? "Mission complete" : "Mission running"}</strong>
              <small>
                {feedMode === "connecting"
                  ? "Connecting to event stream"
                  : feedMode === "api"
                    ? "Backend SSE event stream"
                    : "Deterministic local fallback"}
              </small>
            </div>
          </div>
          <div className="live-controls">
            <Button
              hasIconOnly
              iconDescription={isPaused ? "Resume mission" : "Pause mission"}
              kind="ghost"
              onClick={togglePause}
              renderIcon={isPaused ? PlayFilledAlt : PauseFilled}
              size="sm"
            />
            <Button
              hasIconOnly
              iconDescription="Restart deterministic mission"
              kind="ghost"
              onClick={restart}
              renderIcon={Renew}
              size="sm"
            />
          </div>
        </div>

        <div className="map-panel">
          <div className="map-panel-head">
            <div>
              <p className="mono-label">SHANGHAI / 48 DECLARED LOCATIONS</p>
              <h2>Synthetic observation field</h2>
            </div>
            <div className="probe-count">
              <strong>{metrics.completedProbes.toLocaleString("en-US")}</strong>
              <span>/ 1,024 planned quota</span>
            </div>
          </div>
          <StoreField stores={demoCase.stores} progress={progress} />
          <ProgressBar
            hideLabel
            label="Mission progress"
            max={metrics.totalProbes}
            size="small"
            status={complete ? "finished" : "active"}
            value={metrics.completedProbes}
          />
        </div>

        <div className="agent-grid" aria-label="Agent status">
          {agents.map(([name, role], index) => {
            const completed = complete || progress > (index + 1) / agents.length;
            const active = !complete && index === activeAgentCount - 1;
            return (
              <div
                className={active ? "agent-row active" : "agent-row"}
                key={name}
              >
                <span className="agent-status-icon">
                  {completed ? (
                    <Checkmark size={16} aria-label="Complete" />
                  ) : active ? (
                    <Activity size={16} aria-label="Running" />
                  ) : (
                    <CircleDash size={16} aria-label="Queued" />
                  )}
                </span>
                <div>
                  <strong>{name}</strong>
                  <small>{role}</small>
                </div>
                <span>{completed ? "Verified" : active ? "Running" : "Queued"}</span>
              </div>
            );
          })}
        </div>
      </section>

      <aside className="live-rail">
        <section className="estimate-panel" aria-labelledby="estimate-title">
          <div className="estimate-header">
            <div>
              <p className="mono-label">LIVE ESTIMATE / JUNE GMV</p>
              <h2 id="estimate-title">
                {formatMillions(metrics.estimatedMonthlyGmv)}
              </h2>
            </div>
            <span className="confidence-value">
              {metrics.confidence.toFixed(2)}
              <small>policy score</small>
            </span>
          </div>
          <div className="estimate-chart">
            <svg
              aria-label="GMV estimate converging as evidence is collected"
              preserveAspectRatio="none"
              role="img"
              viewBox="0 0 300 90"
            >
              <line x1="0" x2="300" y1="4" y2="4" className="claim-line" />
              <polyline points={chartPoints.join(" ")} />
              {chartPoints.length > 0 && (
                <circle
                  cx={chartPoints.at(-1)?.split(",")[0]}
                  cy={chartPoints.at(-1)?.split(",")[1]}
                  r="4"
                />
              )}
            </svg>
            <span className="chart-claim-label">Claim ¥3.33m</span>
          </div>
          <div className="estimate-range">
            <span>
              Scenario band
              <strong>
                {formatMillions(metrics.lowerBound)} to{" "}
                {formatMillions(metrics.upperBound)}
              </strong>
            </span>
            <span>
              Reality gap
              <strong>{(metrics.realityGap * 100).toFixed(1)}%</strong>
            </span>
          </div>
        </section>

        <section className="event-panel" aria-labelledby="events-title">
          <div className="panel-heading compact">
            <div>
              <p className="mono-label">AUDITABLE EVENT STREAM</p>
              <h2 id="events-title">Agent activity</h2>
            </div>
            <DataConnected size={20} aria-hidden />
          </div>
          <ol className="event-list" aria-live="polite">
            {events.length === 0 && (
              <li className="event-empty">
                <span className="event-loader" aria-hidden />
                Waiting for the first recorded event
              </li>
            )}
            {[...events].reverse().slice(0, 7).map((event) => (
              <li key={event.id}>
                <span className="event-sequence">
                  {String(event.sequence).padStart(2, "0")}
                </span>
                <div>
                  <strong>{event.agent}</strong>
                  <p>{event.message}</p>
                  <time dateTime={event.occurredAt}>
                    {new Intl.DateTimeFormat("en", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: false,
                      timeZone: "Asia/Shanghai",
                    }).format(new Date(event.occurredAt))}
                  </time>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {events.some((event) => event.type === "hypothesis.raised") && (
          <section className="skeptic-alert">
            <WarningAlt size={20} aria-hidden />
            <div>
              <p className="mono-label">SKEPTIC AGENT / HYPOTHESIS 01</p>
              <strong>Could corporate orders explain the gap?</strong>
              <p>
                The current consumer panel may miss an off-platform order
                channel. Test a 20% allowance before deciding.
              </p>
            </div>
          </section>
        )}

        {complete && (
          <Link className="primary-link findings-link" href="/cases/morrow-coffee/findings">
            Review evidence and findings
            <ArrowRight size={20} aria-hidden />
          </Link>
        )}
      </aside>
    </div>
  );
}
