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
  simulationOperationsPerWave,
  simulationOperationWaveCount,
  simulationOperations,
  simulationStationById,
  simulationStations,
} from "@/lib/simulation-operations";

type FieldAgentState = "active" | "complete" | "queued" | "working";
type FieldAgentFacing = "down" | "left" | "right" | "up";

type FieldPosition = Readonly<{
  x: number;
  y: number;
}>;

type CanvasPoint = Readonly<{
  x: number;
  y: number;
}>;

type RouteCurve = Readonly<{
  control: CanvasPoint;
  from: CanvasPoint;
  to: CanvasPoint;
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
const agentTravelDurationMs = 2400;
const agentTravelLeadInMs = 650;
const agentTravelStaggerMs = 260;

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

function previousOperationForAgent(agentId: string, activeIndex: number) {
  for (let index = activeIndex - 1; index >= 0; index -= 1) {
    if (simulationOperations[index]?.agentId === agentId) {
      return { index, operation: simulationOperations[index] };
    }
  }
  return null;
}

function operationWaveRecords(waveStartIndex: number) {
  return simulationOperations
    .slice(waveStartIndex, waveStartIndex + simulationOperationsPerWave)
    .map((operation, offset) => ({
      index: waveStartIndex + offset,
      operation,
    }));
}

function concurrentOperationForAgent(
  agentId: string,
  waveStartIndex: number,
) {
  return (
    operationWaveRecords(waveStartIndex).find(
      ({ operation }) => operation.agentId === agentId,
    ) ?? null
  );
}

function previousWaveRecords(waveStartIndex: number) {
  const segmentIndex = Math.floor(
    waveStartIndex / simulationOperationsPerWave,
  );
  if (
    waveStartIndex < simulationOperationsPerWave ||
    segmentIndex % 2 === 0
  ) {
    return [];
  }
  return operationWaveRecords(
    waveStartIndex - simulationOperationsPerWave,
  );
}

function workingOperationForAgent(
  agentId: string,
  waveStartIndex: number,
) {
  return (
    previousWaveRecords(waveStartIndex).find(
      ({ operation }) => operation.agentId === agentId,
    ) ?? null
  );
}

function fieldStateForAgent(agentId: string, waveStartIndex: number) {
  if (concurrentOperationForAgent(agentId, waveStartIndex)) {
    return "active" as const;
  }
  if (workingOperationForAgent(agentId, waveStartIndex)) {
    return "working" as const;
  }
  if (latestOperationForAgent(agentId, waveStartIndex - 1)) {
    return "complete" as const;
  }
  return "queued" as const;
}

function stationPositionForAgent(
  stationId: SimulationStationId,
  agentIndex: number,
) {
  const station = simulationStationById(stationId);
  const offset = stationOffsets[agentIndex % stationOffsets.length];
  return {
    x: station.x + offset.x,
    y: station.y + offset.y,
  };
}

function operationAgentIndex(operation: SimulationOperation) {
  const numericId = Number(operation.agentId.replace("P-", ""));
  return Math.max(0, Math.min(standbyPositions.length - 1, numericId - 1));
}

function operationOriginPosition(operationIndex: number) {
  const operation = simulationOperations[operationIndex];
  const agentIndex = operationAgentIndex(operation);
  const previousOperation = previousOperationForAgent(
    operation.agentId,
    operationIndex,
  );

  return previousOperation
    ? stationPositionForAgent(previousOperation.operation.stationId, agentIndex)
    : standbyPositions[agentIndex];
}

function operationDestinationPosition(operationIndex: number) {
  const operation = simulationOperations[operationIndex];
  return stationPositionForAgent(
    operation.stationId,
    operationAgentIndex(operation),
  );
}

function positionForAgent(
  agentId: string,
  agentIndex: number,
  waveStartIndex: number,
) {
  const concurrentOperation = concurrentOperationForAgent(
    agentId,
    waveStartIndex,
  );
  if (concurrentOperation) {
    return operationDestinationPosition(concurrentOperation.index);
  }

  const latestOperation = latestOperationForAgent(
    agentId,
    waveStartIndex - 1,
  );
  if (!latestOperation) {
    return standbyPositions[agentIndex];
  }

  return stationPositionForAgent(
    latestOperation.operation.stationId,
    agentIndex,
  );
}

function facingForAgent(
  agentId: string,
  waveStartIndex: number,
  state: FieldAgentState,
): FieldAgentFacing {
  if (state !== "active") {
    return "down";
  }

  const operationRecord = concurrentOperationForAgent(
    agentId,
    waveStartIndex,
  );
  if (!operationRecord) {
    return "down";
  }

  const from = operationOriginPosition(operationRecord.index);
  const to = operationDestinationPosition(operationRecord.index);
  const deltaX = to.x - from.x;
  const deltaY = to.y - from.y;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    return deltaX < 0 ? "left" : "right";
  }
  return deltaY < 0 ? "up" : "down";
}

function spriteClass(
  state: FieldAgentState,
  activeMode: SimulationSpriteMode,
) {
  if (state === "working") {
    return `sprite-work-${activeMode}`;
  }
  if (state !== "active") {
    return "sprite-idle";
  }
  return `sprite-${activeMode}`;
}

function routePoint(position: FieldPosition, width: number, height: number) {
  return {
    x: (position.x / 100) * width,
    y: (position.y / 100) * height,
  };
}

function routeCurve(
  from: CanvasPoint,
  to: CanvasPoint,
  operationIndex: number,
): RouteCurve {
  const deltaX = to.x - from.x;
  const deltaY = to.y - from.y;
  const distance = Math.max(1, Math.hypot(deltaX, deltaY));
  const direction = operationIndex % 2 === 0 ? 1 : -1;
  const bend = Math.min(52, Math.max(16, distance * 0.11)) * direction;

  return {
    from,
    to,
    control: {
      x: (from.x + to.x) / 2 - (deltaY / distance) * bend,
      y: (from.y + to.y) / 2 + (deltaX / distance) * bend,
    },
  };
}

function traceRoute(
  context: CanvasRenderingContext2D,
  curve: RouteCurve,
) {
  context.beginPath();
  context.moveTo(curve.from.x, curve.from.y);
  context.quadraticCurveTo(
    curve.control.x,
    curve.control.y,
    curve.to.x,
    curve.to.y,
  );
}

function pointOnRoute(curve: RouteCurve, progress: number) {
  const inverse = 1 - progress;
  return {
    x:
      inverse * inverse * curve.from.x +
      2 * inverse * progress * curve.control.x +
      progress * progress * curve.to.x,
    y:
      inverse * inverse * curve.from.y +
      2 * inverse * progress * curve.control.y +
      progress * progress * curve.to.y,
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
  const operationStartedAtRef = useRef(0);

  useEffect(() => {
    activeIndexRef.current = activeOperationIndex;
    operationStartedAtRef.current = performance.now();
    drawRef.current?.(operationStartedAtRef.current);
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
      const historyStart = Math.max(0, activeIndex - 7);
      for (let index = historyStart; index < activeIndex; index += 1) {
        const historyCurve = routeCurve(
          routePoint(operationOriginPosition(index), width, height),
          routePoint(operationDestinationPosition(index), width, height),
          index,
        );
        context2d.strokeStyle = `rgba(181, 153, 74, ${
          0.07 + ((index - historyStart + 1) / 8) * 0.12
        })`;
        context2d.lineWidth = index === activeIndex - 1 ? 1 : 0.7;
        context2d.setLineDash(index === activeIndex - 1 ? [] : [2, 8]);
        traceRoute(context2d, historyCurve);
        context2d.stroke();
      }

      const currentWave = operationWaveRecords(activeIndex);
      const routeColors = [
        {
          line: "rgba(255, 107, 53, 0.72)",
          point: "#ff6b35",
          shadow: "rgba(255, 107, 53, 0.42)",
        },
        {
          line: "rgba(221, 183, 96, 0.58)",
          point: "#d8b35f",
          shadow: "rgba(216, 179, 95, 0.28)",
        },
        {
          line: "rgba(214, 205, 181, 0.44)",
          point: "#c7bfa9",
          shadow: "rgba(199, 191, 169, 0.22)",
        },
        {
          line: "rgba(167, 142, 88, 0.52)",
          point: "#a78e58",
          shadow: "rgba(167, 142, 88, 0.24)",
        },
      ] as const;

      currentWave.forEach(({ index, operation }, waveOrder) => {
        const currentCurve = routeCurve(
          routePoint(operationOriginPosition(index), width, height),
          routePoint(operationDestinationPosition(index), width, height),
          index,
        );
        const travelDuration = agentTravelDurationMs;
        const elapsed = Math.max(
          0,
          timestamp -
            operationStartedAtRef.current -
            (prefersReducedMotion
              ? 0
              : agentTravelLeadInMs + waveOrder * agentTravelStaggerMs),
        );
        const travelProgress = prefersReducedMotion
          ? 1
          : Math.min(1, elapsed / travelDuration);
        const easedProgress =
          travelProgress * travelProgress * (3 - 2 * travelProgress);
        const routeColor = routeColors[waveOrder % routeColors.length];

        context2d.strokeStyle = routeColor.line;
        context2d.lineWidth = waveOrder === 0 ? 1.35 : 0.95;
        context2d.setLineDash(waveOrder === 0 ? [8, 7] : [3, 8]);
        context2d.lineDashOffset = prefersReducedMotion
          ? 0
          : -elapsed * (waveOrder === 0 ? 0.008 : 0.0055);
        traceRoute(context2d, currentCurve);
        context2d.stroke();
        context2d.setLineDash([]);
        context2d.lineDashOffset = 0;

        for (let trailIndex = 4; trailIndex >= 0; trailIndex -= 1) {
          const trailProgress = Math.max(
            0,
            easedProgress - trailIndex * 0.035,
          );
          const trailPoint = pointOnRoute(currentCurve, trailProgress);
          context2d.globalAlpha =
            (1 - trailIndex / 5) * (waveOrder === 0 ? 0.9 : 0.67);
          context2d.fillStyle = routeColor.point;
          context2d.shadowBlur =
            trailIndex === 0 ? (waveOrder === 0 ? 17 : 10) : 4;
          context2d.shadowColor = routeColor.shadow;
          context2d.beginPath();
          context2d.arc(
            trailPoint.x,
            trailPoint.y,
            trailIndex === 0 ? (waveOrder === 0 ? 2.8 : 2.1) : 1.15,
            0,
            Math.PI * 2,
          );
          context2d.fill();
        }
        context2d.globalAlpha = 1;
        context2d.shadowBlur = 0;

        const activeStation = simulationStationById(operation.stationId);
        const activeStationPoint = routePoint(activeStation, width, height);
        const ringElapsed = Math.max(0, elapsed - travelDuration);
        const ringProgress = prefersReducedMotion
          ? 0.35
          : (ringElapsed / (2600 + waveOrder * 180)) % 1;
        const ringAlpha =
          travelProgress < 1
            ? 0.09
            : (waveOrder === 0 ? 0.34 : 0.2) * (1 - ringProgress);
        context2d.strokeStyle =
          waveOrder === 0
            ? `rgba(255, 107, 53, ${ringAlpha})`
            : `rgba(218, 190, 121, ${ringAlpha})`;
        context2d.lineWidth = waveOrder === 0 ? 1 : 0.75;
        context2d.beginPath();
        context2d.arc(
          activeStationPoint.x,
          activeStationPoint.y,
          16 + ringProgress * (waveOrder === 0 ? 46 : 34),
          0,
          Math.PI * 2,
        );
        context2d.stroke();
      });
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
  return operationWaveRecords(activeIndex).map(({ operation }) => operation);
}

function selectedOperationForAgent(agentId: string, activeIndex: number) {
  return (
    concurrentOperationForAgent(agentId, activeIndex) ??
    latestOperationForAgent(agentId, activeIndex - 1) ??
    nextOperationForAgent(
      agentId,
      activeIndex + simulationOperationsPerWave - 1,
    )
  );
}

function localizedOperationLabel(
  operation: SimulationOperation,
  locale: "en" | "zh",
) {
  return operation.label[locale];
}

export function InvestigationOperationsBoard({
  isPlaying,
  onAdvance,
  revealedCount,
}: {
  isPlaying: boolean;
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
  const activeWaveOperations = operationWaveRecords(activeOperationIndex);
  const workingWaveOperations = previousWaveRecords(activeOperationIndex);
  const engagedWaveOperations = [
    ...workingWaveOperations,
    ...activeWaveOperations,
  ];
  const activeWaveNumber =
    Math.floor(activeOperationIndex / simulationOperationsPerWave) + 1;
  const parentModuleNumber = Math.floor(activeOperationIndex / 4) + 1;
  const parentModulePass =
    Math.floor(activeOperationIndex / simulationOperationsPerWave) % 2 ===
    0
      ? "A"
      : "B";
  const activeStation = simulationStationById(activeOperation.stationId);
  const ActiveOperationIcon = operationIconByKind[activeOperation.kind];
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
  const selectedIsLive = activeWaveOperations.some(
    ({ index }) => index === selectedOperationRecord.index,
  );
  const selectedIsWorking = workingWaveOperations.some(
    ({ index }) => index === selectedOperationRecord.index,
  );
  const SelectedOperationIcon = operationIconByKind[selectedOperation.kind];
  const selectedStation = simulationStationById(selectedOperation.stationId);
  const visibleEvents = useMemo(
    () => eventWindow(activeOperationIndex),
    [activeOperationIndex],
  );
  const hasMoreOperations =
    activeOperationIndex + simulationOperationsPerWave <
    simulationOperations.length;
  const nextOperation =
    simulationOperations[
      activeOperationIndex + simulationOperationsPerWave
    ];

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
      data-playing={isPlaying ? "true" : "false"}
    >
      <header className="operations-board-header">
        <div>
          <p>FIELD OPERATIONS · HARDCODED SANDBOX</p>
          <h2 id="investigation-operations-title">
            {choose(
              "Smaller waves. Continuous investigation.",
              "更细波次，持续调查。",
            )}
          </h2>
          <span>
            {choose(
              "Each original four-agent module is split into two overlapping passes. Two agents move while the previous pair keeps working. This is a local replay, not live outreach.",
              "每个原四 Agent 模块拆成两个重叠小段：两名 Agent 缓慢进入，上一组继续工作。这里是本地回放，不是真实外联。",
            )}
          </span>
        </div>

        <dl aria-label={choose("Sandbox operation status", "沙盒操作状态")}>
          <div>
            <dt>{choose("Agents moving", "行进 Agent")}</dt>
            <dd>{simulationOperationsPerWave}</dd>
          </div>
          <div>
            <dt>{choose("Agents working", "工作中 Agent")}</dt>
            <dd>{workingWaveOperations.length}</dd>
          </div>
          <div>
            <dt>{choose("Current segment", "当前细分段")}</dt>
            <dd className="operations-current-count" key={activeOperation.id}>
              {String(activeWaveNumber).padStart(2, "0")}/
              {String(simulationOperationWaveCount).padStart(2, "0")}
            </dd>
          </div>
          <div className="truth">
            <dt>{choose("Real outreach", "真实外联")}</dt>
            <dd>0</dd>
          </div>
        </dl>
      </header>

      <div className="operations-board-grid">
        <div
          className="operations-floor"
          style={
            {
              "--focus-x": `${activeStation.x}%`,
              "--focus-y": `${activeStation.y}%`,
            } as CSSProperties
          }
        >
          <Image
            alt=""
            aria-hidden
            className="operations-floor-image"
            fill
            sizes="(max-width: 960px) 100vw, 980px"
            src="/lrwa-virtual-store-comic.webp"
            unoptimized
          />
          <div className="operations-floor-shade" aria-hidden />
          <div className="operations-comic-ink" aria-hidden />
          <InvestigationRouteCanvas
            activeOperationIndex={activeOperationIndex}
          />
          <div
            aria-hidden
            className="operation-panel-cut"
            key={`panel-cut-${activeOperation.id}`}
          >
            <i />
            <i />
            <i />
          </div>
          <div className="virtual-store-caption">
            <span>{choose("ILLUSTRATIVE STORE TWIN", "示例门店孪生体")}</span>
            <strong>
              {choose(
                "Starbucks · Jing'an Kerry Centre",
                "星巴克 · 上海静安嘉里中心",
              )}
            </strong>
            <small>{choose("No live store data", "不含实时门店数据")}</small>
          </div>

          <div
            className="operations-floor-status"
            key={`floor-status-${activeOperation.id}`}
          >
            <ActiveOperationIcon size={15} aria-hidden />
            <div>
              <span>
                SEGMENT {String(activeWaveNumber).padStart(2, "0")} ·{" "}
                {simulationOperationsPerWave}{" "}
                {choose("AGENTS MOVING", "个 AGENT 行进")}
              </span>
              <strong>{localizedOperationLabel(activeOperation, locale)}</strong>
            </div>
            <small>
              {choose("MODULE", "模块")}{" "}
              {String(parentModuleNumber).padStart(2, "0")}
              {parentModulePass}
            </small>
          </div>

          {simulationStations.map((station) => {
            const StationIcon = stationIconById[station.id];
            const activeStationOperationCount = engagedWaveOperations.filter(
              ({ operation }) => operation.stationId === station.id,
            ).length;
            const isActive = activeStationOperationCount > 0;
            const isFocused = station.id === activeOperation.stationId;
            const hasCompletedOperation = simulationOperations.some(
              (operation, index) =>
                index < activeOperationIndex &&
                operation.stationId === station.id,
            );
            return (
              <div
                className={`operation-station${isActive ? " active" : ""}${
                  isFocused ? " focused" : ""
                }${
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
                {activeStationOperationCount > 1 && (
                  <em aria-label={`${activeStationOperationCount} agents`}>
                    {activeStationOperationCount}×
                  </em>
                )}
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
              const concurrentOperation = concurrentOperationForAgent(
                agent.id,
                activeOperationIndex,
              );
              const workingOperation = workingOperationForAgent(
                agent.id,
                activeOperationIndex,
              );
              const latestOperation = latestOperationForAgent(
                agent.id,
                activeOperationIndex - 1,
              );
              const upcomingOperation = nextOperationForAgent(
                agent.id,
                activeOperationIndex + simulationOperationsPerWave - 1,
              );
              const displayedOperation =
                concurrentOperation?.operation ??
                workingOperation?.operation ??
                latestOperation?.operation ??
                upcomingOperation?.operation;
              const actionLabel = displayedOperation
                ? localizedOperationLabel(displayedOperation, locale)
                : choose("No assigned event", "暂无分配事件");
              const engagedOperation =
                concurrentOperation ?? workingOperation;
              const mode =
                engagedOperation?.operation.spriteMode ?? "wait";
              const AgentOperationIcon = engagedOperation
                ? operationIconByKind[engagedOperation.operation.kind]
                : DataConnected;
              const facing = facingForAgent(
                agent.id,
                activeOperationIndex,
                state,
              );
              const waveOrder = concurrentOperation
                ? concurrentOperation.index - activeOperationIndex
                : 0;
              const originPosition = concurrentOperation
                ? operationOriginPosition(concurrentOperation.index)
                : position;
              const travelDuration = agentTravelDurationMs;

              return (
                <button
                  aria-label={`${agent.id} ${agent.cohort}${choose(
                    ", ",
                    "，",
                  )}${actionLabel}`}
                  aria-pressed={isSelected}
                  className={`field-agent ${state}${
                    isSelected ? " selected" : ""
                  }${position.x > 78 ? " label-left" : ""} facing-${facing}`}
                  data-operation-kind={
                    engagedOperation?.operation.kind
                  }
                  data-wave-active={concurrentOperation ? "true" : undefined}
                  data-wave-working={workingOperation ? "true" : undefined}
                  id={`simulation-inquiry-${agent.id}`}
                  key={`${agent.id}-${
                    engagedOperation?.operation.id ?? state
                  }`}
                  onClick={() => setPinnedAgentId(agent.id)}
                  style={
                    {
                      "--agent-delay": `${
                        agentTravelLeadInMs +
                        waveOrder * agentTravelStaggerMs
                      }ms`,
                      "--agent-from-x": `${originPosition.x}cqw`,
                      "--agent-from-y": `${originPosition.y}cqh`,
                      "--agent-hue": `${
                        ((agentIndex % spriteSheetCount) -
                          (spriteSheetCount - 1) / 2) *
                          6 +
                        Math.floor(agentIndex / spriteSheetCount) * 32
                      }deg`,
                      "--agent-travel-duration": `${travelDuration}ms`,
                      "--agent-x": `${position.x}cqw`,
                      "--agent-y": `${position.y}cqh`,
                    } as CSSProperties
                  }
                  type="button"
                >
                  <span className="field-agent-code">{agent.id}</span>
                  <span
                    aria-hidden
                    className="field-agent-effect"
                    key={`effect-${
                      engagedOperation?.operation.id ?? state
                    }`}
                  />
                  <span
                    aria-hidden
                    className={`field-agent-sprite ${spriteClass(state, mode)}`}
                    key={`sprite-${
                      engagedOperation?.operation.id ?? state
                    }`}
                    style={{
                      backgroundImage: `url("/pixel-agents/char_${
                        agentIndex % spriteSheetCount
                      }.png")`,
                    }}
                  />
                  {engagedOperation && (
                    <span
                      className={`field-agent-action${
                        workingOperation ? " continuing" : ""
                      }`}
                    >
                      <AgentOperationIcon size={11} aria-hidden />
                      {workingOperation
                        ? choose("WORKING", "工作中")
                        :
                        simulationOperationKindLabels[
                          engagedOperation.operation.kind
                        ][locale]}
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
                "The store twin, characters, and events are illustrative. No store or platform is contacted.",
                "门店孪生体、角色和事件均为示例，不会联系任何真实门店或平台。",
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

          <div
            className="operation-dossier-live"
            key={`${selectedOperation.id}-${activeOperation.id}-${
              pinnedAgentId ?? "follow"
            }`}
          >
            <div className="operation-dossier-title">
              <span>
                {simulationOperationKindLabels[selectedOperation.kind][locale]}{" "}
                · {selectedStation.shortLabel[locale]}
              </span>
              <small>
                {selectedIsLive
                  ? choose("MOVING IN CURRENT SEGMENT", "当前细分段行进")
                  : selectedIsWorking
                    ? choose("WORKING FROM PRIOR PASS", "上一小段继续工作")
                  : selectedOperationRecord.index < activeOperationIndex
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
          </div>

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
                : operation.id === selectedOperation.id
                  ? "live selected"
                  : "live";
            return (
              <li
                className={state}
                data-operation-kind={operation.kind}
                key={operation.id}
              >
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
              ? choose("Next segment", "下一细分段")
              : choose("Open response branches", "进入响应分支")}
          </span>
          <small>
            {hasMoreOperations
              ? `${choose("Segment", "细分段")} ${String(
                  activeWaveNumber + 1,
                ).padStart(2, "0")} · ${localizedOperationLabel(
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
