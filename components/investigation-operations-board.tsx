"use client";

import Image from "next/image";
import {
  Archive,
  ArrowRight,
  Branch,
  Compare,
  DataCheck,
  DataConnected,
  DataReference,
  Debug,
  Edit,
  Locked,
  NotSent,
  Plan,
  Roadmap,
  Search,
  TaskApproved,
  Time,
  UserRole,
  VisualInspection,
} from "@carbon/icons-react";
import {
  type CSSProperties,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useI18n } from "@/components/locale-provider";
import { localizeScenario } from "@/lib/simulation-copy";
import {
  type SimulationOperation,
  type SimulationOperationKind,
  type SimulationSpriteMode,
  type SimulationStationId,
  simulationOperationKindLabels,
  simulationOperations,
  simulationStationById,
  simulationStations,
} from "@/lib/simulation-operations";

type FieldAgentState = "active" | "complete" | "queued";

type FieldPosition = Readonly<{
  x: number;
  y: number;
}>;

const operationIconByKind = {
  search: Search,
  inspect: VisualInspection,
  plan: Plan,
  "assume-role": UserRole,
  route: Roadmap,
  compose: Edit,
  stage: NotSent,
  wait: Time,
  "model-branch": Branch,
  extract: DataReference,
  compare: Compare,
  deduplicate: DataCheck,
  challenge: Debug,
  approval: TaskApproved,
  archive: Archive,
  lock: Locked,
} satisfies Record<SimulationOperationKind, typeof Search>;

const stationIconById = {
  sources: Search,
  claims: Plan,
  roles: UserRole,
  channels: Roadmap,
  outreach: NotSent,
  branches: Branch,
  verification: Compare,
  review: TaskApproved,
  vault: Locked,
} satisfies Record<SimulationStationId, typeof Search>;

const stationOffsets: readonly FieldPosition[] = [
  { x: -4.6, y: 5.6 },
  { x: 0, y: 5.6 },
  { x: 4.6, y: 5.6 },
  { x: -4.6, y: -3.5 },
  { x: 0, y: -3.5 },
  { x: 4.6, y: -3.5 },
] as const;

const standbyPositions: readonly FieldPosition[] = Array.from(
  { length: 12 },
  (_, index) => ({
    x: 7.5 + index * 7.65,
    y: 94,
  }),
);

const spriteSheetCount = 6;

function latestOperationForAgent(agentId: string, activeIndex: number) {
  for (let index = activeIndex; index >= 0; index -= 1) {
    if (simulationOperations[index]?.agentId === agentId) {
      return { index, operation: simulationOperations[index] };
    }
  }
  return null;
}

function nextOperationForAgent(agentId: string, activeIndex: number) {
  for (
    let index = activeIndex + 1;
    index < simulationOperations.length;
    index += 1
  ) {
    if (simulationOperations[index]?.agentId === agentId) {
      return { index, operation: simulationOperations[index] };
    }
  }
  return null;
}

function fieldStateForAgent(agentId: string, activeIndex: number) {
  if (simulationOperations[activeIndex]?.agentId === agentId) {
    return "active" as const;
  }
  if (latestOperationForAgent(agentId, activeIndex)) {
    return "complete" as const;
  }
  return "queued" as const;
}

function positionForAgent(
  agentId: string,
  agentIndex: number,
  activeIndex: number,
) {
  const latestOperation = latestOperationForAgent(agentId, activeIndex);
  if (!latestOperation) {
    return standbyPositions[agentIndex];
  }

  const station = simulationStationById(latestOperation.operation.stationId);
  const offset = stationOffsets[agentIndex % stationOffsets.length];
  return {
    x: station.x + offset.x,
    y: station.y + offset.y,
  };
}

function spriteClass(
  state: FieldAgentState,
  activeMode: SimulationSpriteMode,
) {
  if (state !== "active") {
    return "sprite-idle";
  }
  return `sprite-${activeMode}`;
}

function routePoint(stationId: SimulationStationId, width: number, height: number) {
  const station = simulationStationById(stationId);
  return {
    x: (station.x / 100) * width,
    y: (station.y / 100) * height,
  };
}

function InvestigationRouteCanvas({
  activeOperationIndex,
}: {
  activeOperationIndex: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawRef = useRef<((timestamp: number) => void) | null>(null);
  const activeIndexRef = useRef(activeOperationIndex);

  useEffect(() => {
    activeIndexRef.current = activeOperationIndex;
    drawRef.current?.(performance.now());
  }, [activeOperationIndex]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const floor = canvas?.parentElement;
    const context = canvas?.getContext("2d");
    if (!canvas || !floor || !context) {
      return;
    }
    const canvasElement: HTMLCanvasElement = canvas;
    const context2d: CanvasRenderingContext2D = context;
    const floorElement: HTMLElement = floor;

    let width = 1;
    let height = 1;
    let dpr = 1;
    let animationFrame = 0;
    let lastFrame = 0;
    let resizeFrame = 0;
    let isRunning = false;
    let isIntersecting = true;
    let isPageVisible = document.visibilityState === "visible";
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let prefersReducedMotion = motionQuery.matches;

    function draw(timestamp: number) {
      context2d.setTransform(dpr, 0, 0, dpr, 0, 0);
      context2d.clearRect(0, 0, width, height);
      context2d.lineCap = "square";
      context2d.lineJoin = "miter";

      const gridSize = 34;
      context2d.lineWidth = 0.55;
      for (let x = gridSize; x < width; x += gridSize) {
        context2d.strokeStyle = "rgba(231, 219, 185, 0.028)";
        context2d.beginPath();
        context2d.moveTo(x, 0);
        context2d.lineTo(x, height);
        context2d.stroke();
      }
      for (let y = gridSize; y < height; y += gridSize) {
        context2d.strokeStyle = "rgba(231, 219, 185, 0.028)";
        context2d.beginPath();
        context2d.moveTo(0, y);
        context2d.lineTo(width, y);
        context2d.stroke();
      }

      const activeIndex = activeIndexRef.current;
      for (let index = 1; index < simulationOperations.length; index += 1) {
        const from = routePoint(
          simulationOperations[index - 1].stationId,
          width,
          height,
        );
        const to = routePoint(
          simulationOperations[index].stationId,
          width,
          height,
        );
        if (from.x === to.x && from.y === to.y) {
          continue;
        }

        const isComplete = index <= activeIndex;
        const isCurrent = index === activeIndex;
        context2d.strokeStyle = isCurrent
          ? "rgba(255, 107, 53, 0.82)"
          : isComplete
            ? "rgba(181, 153, 74, 0.28)"
            : "rgba(214, 205, 181, 0.07)";
        context2d.lineWidth = isCurrent ? 1.35 : 0.75;
        context2d.setLineDash(
          isCurrent ? [6, 6] : isComplete ? [] : [2, 7],
        );
        context2d.beginPath();
        context2d.moveTo(from.x, from.y);
        context2d.lineTo(to.x, to.y);
        context2d.stroke();
      }
      context2d.setLineDash([]);

      const currentOperation = simulationOperations[activeIndex];
      const previousOperation = simulationOperations[Math.max(0, activeIndex - 1)];
      const from = routePoint(previousOperation.stationId, width, height);
      const to = routePoint(currentOperation.stationId, width, height);
      const progress = prefersReducedMotion
        ? 1
        : (timestamp / 1800) % 1;
      const easedProgress =
        progress * progress * (3 - 2 * progress);
      const pulseX = from.x + (to.x - from.x) * easedProgress;
      const pulseY = from.y + (to.y - from.y) * easedProgress;

      context2d.fillStyle = "rgba(255, 107, 53, 0.9)";
      context2d.shadowBlur = 18;
      context2d.shadowColor = "rgba(255, 107, 53, 0.48)";
      context2d.beginPath();
      context2d.arc(pulseX, pulseY, 2.3, 0, Math.PI * 2);
      context2d.fill();
      context2d.shadowBlur = 0;

      const activeStation = routePoint(currentOperation.stationId, width, height);
      const ringProgress = prefersReducedMotion
        ? 0.35
        : (timestamp / 2400) % 1;
      context2d.strokeStyle = `rgba(255, 107, 53, ${
        0.32 * (1 - ringProgress)
      })`;
      context2d.lineWidth = 1;
      context2d.beginPath();
      context2d.arc(
        activeStation.x,
        activeStation.y,
        20 + ringProgress * 42,
        0,
        Math.PI * 2,
      );
      context2d.stroke();
    }

    function resizeCanvas() {
      const bounds = floorElement.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvasElement.width = Math.round(width * dpr);
      canvasElement.height = Math.round(height * dpr);
      draw(performance.now());
    }

    function queueResizeCanvas() {
      window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(resizeCanvas);
    }

    function frame(timestamp: number) {
      if (!isRunning) {
        return;
      }
      if (timestamp - lastFrame >= 1000 / 30) {
        lastFrame = timestamp;
        draw(timestamp);
      }
      animationFrame = window.requestAnimationFrame(frame);
    }

    function updateAnimation() {
      const shouldRun =
        isIntersecting && isPageVisible && !prefersReducedMotion;
      if (shouldRun && !isRunning) {
        isRunning = true;
        animationFrame = window.requestAnimationFrame(frame);
      } else if (!shouldRun && isRunning) {
        isRunning = false;
        window.cancelAnimationFrame(animationFrame);
        draw(performance.now());
      } else if (!shouldRun) {
        draw(performance.now());
      }
    }

    function handleVisibilityChange() {
      isPageVisible = document.visibilityState === "visible";
      updateAnimation();
    }

    function handleMotionChange(event: MediaQueryListEvent) {
      prefersReducedMotion = event.matches;
      updateAnimation();
    }

    const resizeObserver = new ResizeObserver(queueResizeCanvas);
    resizeObserver.observe(floorElement);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isIntersecting = entry?.isIntersecting ?? false;
      updateAnimation();
    });
    intersectionObserver.observe(canvasElement);
    window.addEventListener("resize", queueResizeCanvas);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    motionQuery.addEventListener("change", handleMotionChange);

    drawRef.current = draw;
    queueResizeCanvas();
    updateAnimation();

    return () => {
      isRunning = false;
      window.cancelAnimationFrame(animationFrame);
      window.cancelAnimationFrame(resizeFrame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("resize", queueResizeCanvas);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      motionQuery.removeEventListener("change", handleMotionChange);
      drawRef.current = null;
      canvasElement.width = 0;
      canvasElement.height = 0;
    };
  }, []);

  return (
    <canvas
      aria-hidden="true"
      className="investigation-route-canvas"
      ref={canvasRef}
    />
  );
}

function eventWindow(activeIndex: number) {
  const maxStart = Math.max(0, simulationOperations.length - 5);
  const start = Math.min(maxStart, Math.max(0, activeIndex - 2));
  return simulationOperations.slice(start, start + 5);
}

function selectedOperationForAgent(agentId: string, activeIndex: number) {
  return (
    latestOperationForAgent(agentId, activeIndex) ??
    nextOperationForAgent(agentId, activeIndex)
  );
}

function localizedOperationLabel(
  operation: SimulationOperation,
  locale: "en" | "zh",
) {
  return operation.label[locale];
}

export function InvestigationOperationsBoard({
  onAdvance,
  revealedCount,
}: {
  onAdvance: () => void;
  revealedCount: number;
}) {
  const { choose, locale } = useI18n();
  const localizedScenario = localizeScenario(locale);
  const activeOperationIndex = Math.max(
    0,
    Math.min(revealedCount - 1, simulationOperations.length - 1),
  );
  const activeOperation = simulationOperations[activeOperationIndex];
  const [pinnedAgentId, setPinnedAgentId] = useState<string | null>(null);
  const selectedAgentId = pinnedAgentId ?? activeOperation.agentId;
  const selectedAgentIndex = localizedScenario.personas.findIndex(
    (persona) => persona.id === selectedAgentId,
  );
  const selectedAgent = localizedScenario.personas[selectedAgentIndex];
  const selectedOperationRecord = selectedOperationForAgent(
    selectedAgentId,
    activeOperationIndex,
  )!;
  const selectedOperation = selectedOperationRecord.operation;
  const SelectedOperationIcon = operationIconByKind[selectedOperation.kind];
  const selectedStation = simulationStationById(selectedOperation.stationId);
  const visibleEvents = useMemo(
    () => eventWindow(activeOperationIndex),
    [activeOperationIndex],
  );
  const hasMoreOperations =
    activeOperationIndex < simulationOperations.length - 1;
  const nextOperation = simulationOperations[activeOperationIndex + 1];

  function advanceFromBoard() {
    setPinnedAgentId(null);
    onAdvance();
  }

  return (
    <section
      aria-labelledby="investigation-operations-title"
      className="investigation-operations-board"
      data-hardcoded-replay="true"
      data-network-actions="0"
    >
      <header className="operations-board-header">
        <div>
          <p>FIELD OPERATIONS · HARDCODED SANDBOX</p>
          <h2 id="investigation-operations-title">
            {choose(
              "Watch the investigation move, not just the final answer.",
              "直接看见调查如何一步步发生。",
            )}
          </h2>
          <span>
            {choose(
              "Each character moves through a different operation: search, role framing, routing, inquiry staging, comparison, challenge, approval, and evidence lock.",
              "每个角色会经过不同动作：检索、装载角色、选择渠道、暂存询问、交叉对照、设计追问、人工审批和证据锁定。",
            )}
          </span>
        </div>

        <dl aria-label={choose("Sandbox operation status", "沙盒操作状态")}>
          <div>
            <dt>{choose("Local agents", "本地 Agent")}</dt>
            <dd>12</dd>
          </div>
          <div>
            <dt>{choose("Operation types", "操作类型")}</dt>
            <dd>16</dd>
          </div>
          <div>
            <dt>{choose("Current event", "当前事件")}</dt>
            <dd>
              {activeOperation.code}/{simulationOperations.length}
            </dd>
          </div>
          <div className="truth">
            <dt>{choose("Real outreach", "真实外联")}</dt>
            <dd>0</dd>
          </div>
        </dl>
      </header>

      <div className="operations-board-grid">
        <div className="operations-floor">
          <Image
            alt=""
            aria-hidden
            className="operations-floor-image"
            fill
            sizes="(max-width: 960px) 100vw, 980px"
            src="/lrwa-agent-field-map-bg.webp"
            unoptimized
          />
          <div className="operations-floor-shade" aria-hidden />
          <InvestigationRouteCanvas
            activeOperationIndex={activeOperationIndex}
          />

          <div className="operations-floor-status">
            <DataConnected size={15} aria-hidden />
            <div>
              <span>
                OP {activeOperation.code} ·{" "}
                {simulationOperationKindLabels[activeOperation.kind][locale]}
              </span>
              <strong>{localizedOperationLabel(activeOperation, locale)}</strong>
            </div>
            <small>{choose("LOCAL REPLAY", "本地回放")}</small>
          </div>

          {simulationStations.map((station) => {
            const StationIcon = stationIconById[station.id];
            const isActive = station.id === activeOperation.stationId;
            const hasCompletedOperation = simulationOperations.some(
              (operation, index) =>
                index < activeOperationIndex &&
                operation.stationId === station.id,
            );
            return (
              <div
                className={`operation-station${isActive ? " active" : ""}${
                  hasCompletedOperation ? " visited" : ""
                }`}
                data-station={station.id}
                key={station.id}
                style={
                  {
                    "--station-x": `${station.x}%`,
                    "--station-y": `${station.y}%`,
                  } as CSSProperties
                }
              >
                <StationIcon size={14} aria-hidden />
                <div>
                  <span>{station.shortLabel[locale]}</span>
                  <strong>{station.label[locale]}</strong>
                </div>
              </div>
            );
          })}

          <div className="operations-standby-label" aria-hidden>
            <span>STANDBY DECK</span>
            <small>{choose("Agents awaiting a local event", "等待本地事件的 Agent")}</small>
          </div>

          <div className="field-agent-layer">
            {localizedScenario.personas.map((agent, agentIndex) => {
              const state = fieldStateForAgent(
                agent.id,
                activeOperationIndex,
              );
              const position = positionForAgent(
                agent.id,
                agentIndex,
                activeOperationIndex,
              );
              const isSelected = agent.id === selectedAgentId;
              const latestOperation = latestOperationForAgent(
                agent.id,
                activeOperationIndex,
              );
              const upcomingOperation = nextOperationForAgent(
                agent.id,
                activeOperationIndex,
              );
              const displayedOperation =
                latestOperation?.operation ?? upcomingOperation?.operation;
              const actionLabel = displayedOperation
                ? localizedOperationLabel(displayedOperation, locale)
                : choose("No assigned event", "暂无分配事件");
              const mode =
                state === "active"
                  ? activeOperation.spriteMode
                  : ("wait" as const);

              return (
                <button
                  aria-label={`${agent.id} ${agent.cohort}${choose(
                    ", ",
                    "，",
                  )}${actionLabel}`}
                  aria-pressed={isSelected}
                  className={`field-agent ${state}${
                    isSelected ? " selected" : ""
                  }`}
                  id={`simulation-inquiry-${agent.id}`}
                  key={agent.id}
                  onClick={() => setPinnedAgentId(agent.id)}
                  style={
                    {
                      "--agent-x": `${position.x}%`,
                      "--agent-y": `${position.y}%`,
                    } as CSSProperties
                  }
                  type="button"
                >
                  <span className="field-agent-code">{agent.id}</span>
                  <span
                    aria-hidden
                    className={`field-agent-sprite ${spriteClass(state, mode)}`}
                    style={{
                      backgroundImage: `url("/pixel-agents/char_${
                        agentIndex % spriteSheetCount
                      }.png")`,
                    }}
                  />
                  {state === "active" && (
                    <span className="field-agent-action">
                      {
                        simulationOperationKindLabels[activeOperation.kind][
                          locale
                        ]
                      }
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="operations-floor-boundary">
            <Locked size={14} aria-hidden />
            <span>
              {choose(
                "Characters and events are a prebuilt local replay. No store or platform is contacted.",
                "角色和事件均为预制本地回放，不会联系任何门店或平台。",
              )}
            </span>
          </div>
        </div>

        <aside
          aria-atomic="true"
          aria-live="polite"
          className="operation-dossier"
        >
          <header>
            <div>
              <p>FIELD EVENT</p>
              <span>
                {selectedOperation.id} / {simulationOperations.length}
              </span>
            </div>
            <button
              disabled={pinnedAgentId === null}
              onClick={() => setPinnedAgentId(null)}
              type="button"
            >
              {pinnedAgentId === null
                ? choose("Following current", "跟随当前")
                : choose("Follow current", "回到当前")}
            </button>
          </header>

          <div className="operation-dossier-title">
            <span>
              {simulationOperationKindLabels[selectedOperation.kind][locale]} ·{" "}
              {selectedStation.shortLabel[locale]}
            </span>
            <small>
              {selectedOperationRecord.index <= activeOperationIndex
                ? choose("VIEWED IN REPLAY", "已在回放中呈现")
                : choose("UPCOMING EVENT", "后续事件")}
            </small>
          </div>

          <div className="operation-dossier-heading">
            <SelectedOperationIcon size={24} aria-hidden />
            <div>
              <h3>{localizedOperationLabel(selectedOperation, locale)}</h3>
              <p>
                {selectedAgent.id} · {selectedAgent.cohort}
              </p>
            </div>
          </div>

          <p className="operation-dossier-detail">
            {selectedOperation.detail[locale]}
          </p>

          <dl className="operation-dossier-meta">
            <div>
              <dt>{choose("Station", "所在工作站")}</dt>
              <dd>{selectedStation.label[locale]}</dd>
            </div>
            <div>
              <dt>{choose("Fact gaps", "覆盖缺口")}</dt>
              <dd>{selectedOperation.factIds.join(" / ")}</dd>
            </div>
            <div>
              <dt>{choose("Evidence state", "证据状态")}</dt>
              <dd className="warning">
                {selectedOperation.evidenceState[locale]}
              </dd>
            </div>
            <div>
              <dt>{choose("Network action", "网络动作")}</dt>
              <dd className="disabled">
                {choose("Disabled · 0 sends", "禁用 · 0 次发送")}
              </dd>
            </div>
          </dl>

          <section className="operation-artifact">
            <span>{choose("LOCAL OUTPUT", "本地产物")}</span>
            <strong>{selectedOperation.output[locale]}</strong>
          </section>

          <section className="operation-next-condition">
            <ArrowRight size={16} aria-hidden />
            <div>
              <span>{choose("NEXT CONDITION", "下一条件")}</span>
              <p>{selectedOperation.nextCondition[locale]}</p>
            </div>
          </section>

          <div className="operation-dossier-lock">
            <Locked size={15} aria-hidden />
            <span>
              {choose(
                "Sandbox event · not evidence",
                "沙盒事件 · 不构成证据",
              )}
            </span>
          </div>
        </aside>
      </div>

      <footer className="operations-event-rail">
        <ol aria-label={choose("Operation event window", "操作事件窗口")}>
          {visibleEvents.map((operation) => {
            const operationIndex = simulationOperations.indexOf(operation);
            const OperationIcon = operationIconByKind[operation.kind];
            const state =
              operationIndex === activeOperationIndex
                ? "current"
                : operationIndex < activeOperationIndex
                  ? "complete"
                  : "queued";
            return (
              <li className={state} key={operation.id}>
                <OperationIcon size={15} aria-hidden />
                <span>{operation.code}</span>
                <div>
                  <strong>
                    {simulationOperationKindLabels[operation.kind][locale]}
                  </strong>
                  <small>{localizedOperationLabel(operation, locale)}</small>
                </div>
              </li>
            );
          })}
        </ol>

        <button onClick={advanceFromBoard} type="button">
          <span>
            {hasMoreOperations
              ? choose("Next operation", "下一操作")
              : choose("Open response branches", "进入响应分支")}
          </span>
          <small>
            {hasMoreOperations
              ? `${nextOperation.code} · ${localizedOperationLabel(
                  nextOperation,
                  locale,
                )}`
              : choose("Continue the sandbox", "继续沙盒流程")}
          </small>
          <ArrowRight size={18} aria-hidden />
        </button>
      </footer>
    </section>
  );
}
