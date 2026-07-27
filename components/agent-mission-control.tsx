"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, DataConnected, Flow, Locked } from "@carbon/icons-react";
import { useI18n } from "@/components/locale-provider";
import { localizeScenario } from "@/lib/simulation-copy";
import scenario from "@/lib/simulation-scenario.json";

type AgentState = "queued" | "active" | "presented";

const nodePositions = [
  { x: 13, y: 16 },
  { x: 34, y: 11 },
  { x: 11, y: 35 },
  { x: 66, y: 11 },
  { x: 87, y: 16 },
  { x: 89, y: 35 },
  { x: 89, y: 65 },
  { x: 87, y: 84 },
  { x: 66, y: 89 },
  { x: 34, y: 89 },
  { x: 13, y: 84 },
  { x: 11, y: 65 },
] as const;

const factAnchors = {
  "F-01": { x: 45, y: 42 },
  "F-02": { x: 55, y: 42 },
  "F-03": { x: 45, y: 58 },
  "F-04": { x: 55, y: 58 },
} as const;

const factCoverage: Record<string, Array<keyof typeof factAnchors>> = {
  "P-01": ["F-02", "F-03"],
  "P-02": ["F-03"],
  "P-03": ["F-03"],
  "P-04": ["F-04"],
  "P-05": ["F-01"],
  "P-06": ["F-01", "F-02"],
  "P-07": ["F-04"],
  "P-08": ["F-04"],
  "P-09": ["F-03", "F-04"],
  "P-10": ["F-03", "F-04"],
  "P-11": ["F-01", "F-04"],
  "P-12": ["F-02", "F-03"],
};

const surveyMarks = Array.from({ length: 36 }, (_, index) => ({
  x: 0.04 + (((index * 37 + 11) % 91) / 100) * 0.92,
  y: 0.05 + (((index * 53 + 7) % 89) / 100) * 0.9,
  length: 4 + (index % 4) * 3,
  vertical: index % 3 === 0,
  alpha: 0.025 + (index % 5) * 0.008,
}));

type AgentFieldCanvasProps = Readonly<{
  activeIndex: number;
  revealedCount: number;
  selectedIndex: number;
}>;

function AgentFieldCanvas({
  activeIndex,
  revealedCount,
  selectedIndex,
}: AgentFieldCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawRef = useRef<((timestamp: number) => void) | null>(null);
  const latestStateRef = useRef({
    activeIndex,
    revealedCount,
    selectedIndex,
  });

  useEffect(() => {
    latestStateRef.current = {
      activeIndex,
      revealedCount,
      selectedIndex,
    };
    drawRef.current?.(performance.now());
  }, [activeIndex, revealedCount, selectedIndex]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const topology = canvas.parentElement;
    if (!topology) {
      return;
    }
    const resolvedContext = canvas.getContext("2d");
    if (!resolvedContext) {
      return;
    }
    const canvasElement: HTMLCanvasElement = canvas;
    const context: CanvasRenderingContext2D = resolvedContext;
    const topologyElement: HTMLElement = topology;

    let width = 1;
    let height = 1;
    let dpr = 1;
    let animationFrame = 0;
    let lastFrame = 0;
    let isRunning = false;
    let isIntersecting = true;
    let isPageVisible = document.visibilityState === "visible";
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let prefersReducedMotion = motionQuery.matches;

    function pointAt(position: { x: number; y: number }) {
      return {
        x: (position.x / 100) * width,
        y: (position.y / 100) * height,
      };
    }

    function drawCornerBrackets(
      centerX: number,
      centerY: number,
      color: string,
    ) {
      const halfWidth = 88;
      const halfHeight = 51;
      const cornerLength = 13;
      context.strokeStyle = color;
      context.lineWidth = 0.8;
      context.setLineDash([]);

      for (const [xDirection, yDirection] of [
        [-1, -1],
        [1, -1],
        [1, 1],
        [-1, 1],
      ] as const) {
        const x = centerX + halfWidth * xDirection;
        const y = centerY + halfHeight * yDirection;
        context.beginPath();
        context.moveTo(x - cornerLength * xDirection, y);
        context.lineTo(x, y);
        context.lineTo(x, y - cornerLength * yDirection);
        context.stroke();
      }
    }

    function draw(timestamp: number) {
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);
      context.lineCap = "square";
      context.lineJoin = "miter";

      for (const mark of surveyMarks) {
        const x = mark.x * width;
        const y = mark.y * height;
        context.strokeStyle = `rgba(210, 197, 152, ${mark.alpha})`;
        context.lineWidth = 0.6;
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(
          x + (mark.vertical ? 0 : mark.length),
          y + (mark.vertical ? mark.length : 0),
        );
        context.stroke();

        if (mark.length > 9) {
          context.fillStyle = `rgba(210, 197, 152, ${mark.alpha * 0.8})`;
          context.fillRect(x - 1, y - 1, 2, 2);
        }
      }

      const centerX = width / 2;
      const centerY = height / 2;
      const elapsed = prefersReducedMotion ? 0 : timestamp / 1000;
      const scanAngle = -1.2 + elapsed * 0.11;

      context.save();
      context.translate(centerX, centerY);
      context.setLineDash([2, 9]);
      for (let index = 0; index < 3; index += 1) {
        context.strokeStyle = `rgba(213, 139, 112, ${0.035 + index * 0.012})`;
        context.lineWidth = 0.7;
        context.beginPath();
        context.arc(
          0,
          0,
          Math.min(width, height) * (0.15 + index * 0.055),
          scanAngle + index * 0.72,
          scanAngle + index * 0.72 + 0.66,
        );
        context.stroke();
      }
      context.restore();
      context.setLineDash([]);

      const state = latestStateRef.current;
      const activePosition = pointAt(nodePositions[state.activeIndex]);

      for (let ringIndex = 0; ringIndex < 2; ringIndex += 1) {
        const progress = prefersReducedMotion
          ? 0.32 + ringIndex * 0.22
          : (timestamp / 3800 + ringIndex * 0.5) % 1;
        context.strokeStyle = `rgba(255, 107, 53, ${0.16 * (1 - progress)})`;
        context.lineWidth = 0.8;
        context.beginPath();
        context.arc(
          activePosition.x,
          activePosition.y,
          16 + progress * 48,
          0,
          Math.PI * 2,
        );
        context.stroke();
      }

      const activeAgent = scenario.personas[state.activeIndex];
      const activeCoverage = factCoverage[activeAgent.id] ?? [];
      activeCoverage.forEach((factId, index) => {
        const target = pointAt(factAnchors[factId]);
        const progress = prefersReducedMotion
          ? 0.58
          : (timestamp / 2300 + index * 0.31) % 1;
        const eased = progress * progress * (3 - 2 * progress);
        const x = activePosition.x + (target.x - activePosition.x) * eased;
        const y = activePosition.y + (target.y - activePosition.y) * eased;

        context.fillStyle = `rgba(255, 107, 53, ${0.28 + (1 - progress) * 0.22})`;
        context.beginPath();
        context.arc(x, y, 1.6, 0, Math.PI * 2);
        context.fill();
      });

      const selectedPosition = pointAt(nodePositions[state.selectedIndex]);
      const selectedColor =
        state.selectedIndex === state.activeIndex
          ? "rgba(255, 107, 53, 0.42)"
          : state.selectedIndex < state.revealedCount
            ? "rgba(143, 125, 61, 0.28)"
            : "rgba(190, 190, 184, 0.14)";
      drawCornerBrackets(selectedPosition.x, selectedPosition.y, selectedColor);
    }

    function resizeCanvas() {
      const bounds = topologyElement.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvasElement.width = Math.round(width * dpr);
      canvasElement.height = Math.round(height * dpr);
      draw(performance.now());
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

    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(topologyElement);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isIntersecting = entry?.isIntersecting ?? false;
      updateAnimation();
    });
    intersectionObserver.observe(canvasElement);

    function handleVisibilityChange() {
      isPageVisible = document.visibilityState === "visible";
      updateAnimation();
    }

    function handleMotionChange(event: MediaQueryListEvent) {
      prefersReducedMotion = event.matches;
      updateAnimation();
    }

    window.addEventListener("resize", resizeCanvas);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    motionQuery.addEventListener("change", handleMotionChange);

    drawRef.current = draw;
    resizeCanvas();
    updateAnimation();

    return () => {
      isRunning = false;
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("resize", resizeCanvas);
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
      className="agent-topology-canvas"
      ref={canvasRef}
    />
  );
}

function stateFor(index: number, currentIndex: number): AgentState {
  if (index < currentIndex) {
    return "presented";
  }
  if (index === currentIndex) {
    return "active";
  }
  return "queued";
}

function stateLabel(state: AgentState, variable: string, isEnglish: boolean) {
  if (state === "presented") {
    return isEnglish ? "Draft presented · not sent" : "草案已呈现 · 未发送";
  }
  if (state === "active") {
    return isEnglish
      ? `Turning “${variable}” into a verification question`
      : `正在把「${variable}」转成验证问句`;
  }
  return isEnglish ? "Waiting for local orchestration" : "等待进入本地编排";
}

function nodeActionLabel(
  state: AgentState,
  variable: string,
  isEnglish: boolean,
) {
  if (state === "presented") {
    return isEnglish ? "Draft presented · not sent" : "草案已呈现 · 未发送";
  }
  if (state === "active") {
    return isEnglish ? `Processing: ${variable}` : `处理：${variable}`;
  }
  return isEnglish ? "Waiting" : "等待编排";
}

function stageClass(stage: "frame" | "draft" | "gate", state: AgentState) {
  if (state === "presented") {
    return "complete";
  }
  if (state === "active") {
    return stage === "frame" ? "complete" : stage === "draft" ? "active" : "";
  }
  return "";
}

export function AgentMissionControl({
  onAdvance,
  revealedCount,
}: {
  onAdvance: () => void;
  revealedCount: number;
}) {
  const { choose, locale } = useI18n();
  const localizedScenario = localizeScenario(locale);
  const isEnglish = locale === "en";
  const currentIndex = Math.max(
    0,
    Math.min(revealedCount - 1, scenario.personas.length - 1),
  );
  const [pinnedIndex, setPinnedIndex] = useState<number | null>(null);
  const selectedIndex = pinnedIndex ?? currentIndex;
  const selectedAgent = localizedScenario.personas[selectedIndex];
  const selectedState = stateFor(selectedIndex, currentIndex);
  const selectedCoverage = factCoverage[selectedAgent.id] ?? [];
  const hasMoreAgents = revealedCount < scenario.personas.length;
  const nextAgent = localizedScenario.personas[revealedCount];

  function advanceFromField() {
    setPinnedIndex(null);
    onAdvance();
  }

  return (
    <section
      className="agent-command"
      data-network-actions="0"
      aria-labelledby="agent-command-title"
    >
      <header className="agent-command-header">
        <div>
          <p>AGENT FIELD · LOCAL REPLAY</p>
          <h2 id="agent-command-title">
            {choose(
              "Twelve agents. One investigation map.",
              "十二个 Agent，一张调查作战图。",
            )}
          </h2>
          <span>
            {choose(
              "Lines show which fact gaps each question covers. Nodes produce local drafts only and do not contact any store.",
              "线路表示问句覆盖的事实缺口。节点只在本地形成草案，不代表正在联系门店。",
            )}
          </span>
        </div>
        <dl aria-label={choose("Agent orchestration status", "Agent 编排状态")}>
          <div>
            <dt>{choose("Local agents", "本地 Agent")}</dt>
            <dd>12</dd>
          </div>
          <div>
            <dt>{choose("Current wave", "当前 Wave")}</dt>
            <dd>0{scenario.personas[currentIndex].wave}</dd>
          </div>
          <div>
            <dt>{choose("Orchestrated", "进入编排")}</dt>
            <dd>{String(revealedCount).padStart(2, "0")}</dd>
          </div>
          <div className="truth">
            <dt>{choose("Real outreach", "真实外联")}</dt>
            <dd>0</dd>
          </div>
        </dl>
      </header>

      <div className="agent-command-grid">
        <div className="agent-topology">
          <Image
            alt=""
            aria-hidden
            className="agent-topology-image"
            fill
            sizes="(max-width: 960px) 100vw, 900px"
            src="/lrwa-agent-field-map-bg.webp"
            unoptimized
          />
          <div className="agent-topology-shade" aria-hidden />
          <AgentFieldCanvas
            activeIndex={currentIndex}
            revealedCount={revealedCount}
            selectedIndex={selectedIndex}
          />

          <div className="agent-wave-label wave-1" aria-hidden>
            <span>WAVE 01</span>
            <small>{choose("Timing & fulfillment", "时间与履约")}</small>
          </div>
          <div className="agent-wave-label wave-2" aria-hidden>
            <span>WAVE 02</span>
            <small>{choose("Identity & payment", "身份与付款")}</small>
          </div>
          <div className="agent-wave-label wave-3" aria-hidden>
            <span>WAVE 03</span>
            <small>{choose("Mix & pickup route", "组合与动线")}</small>
          </div>
          <div className="agent-wave-label wave-4" aria-hidden>
            <span>WAVE 04</span>
            <small>{choose("Urgency & repeat orders", "应急与复购")}</small>
          </div>

          <svg
            aria-hidden
            className="agent-connections"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            {scenario.personas.flatMap((agent, index) => {
              const state = stateFor(index, currentIndex);
              const isSelected = index === selectedIndex;
              return (factCoverage[agent.id] ?? []).map((factId) => (
                <line
                  className={`${state}${isSelected ? " selected" : ""}`}
                  key={`${agent.id}-${factId}`}
                  x1={nodePositions[index].x}
                  x2={factAnchors[factId].x}
                  y1={nodePositions[index].y}
                  y2={factAnchors[factId].y}
                />
              ));
            })}
          </svg>

          <div className="agent-mission-core">
            <div className="agent-core-orbit" aria-hidden />
            <header>
              <Flow size={17} aria-hidden />
              <span>MISSION CORE</span>
              <small>{choose("Conclusion locked", "结论锁定")}</small>
            </header>
            <strong>{localizedScenario.subject}</strong>
            <p>
              {choose(
                "Four fact gaps await real receipts",
                "四个事实缺口等待真实回执",
              )}
            </p>
            <div className="agent-fact-anchors">
              {localizedScenario.facts.map((fact) => (
                <div
                  className={
                    selectedCoverage.includes(
                      fact.id as keyof typeof factAnchors,
                    )
                      ? "covered"
                      : ""
                  }
                  key={fact.id}
                >
                  <span>{fact.id}</span>
                  <small>{fact.label}</small>
                </div>
              ))}
            </div>
          </div>

          <div className="agent-node-layer">
            {localizedScenario.personas.map((agent, index) => {
              const state = stateFor(index, currentIndex);
              const isSelected = index === selectedIndex;
              return (
                <button
                  aria-label={`${agent.id} ${agent.cohort}${choose(
                    ", ",
                    "，",
                  )}${stateLabel(state, agent.variable, isEnglish)}`}
                  aria-pressed={isSelected}
                  className={`agent-field-node position-${index + 1} ${state}${
                    isSelected ? " selected" : ""
                  }`}
                  id={`simulation-inquiry-${agent.id}`}
                  key={agent.id}
                  onClick={() => setPinnedIndex(index)}
                  type="button"
                >
                  <span className="agent-node-code">{agent.id}</span>
                  <small>W0{agent.wave}</small>
                  <strong>{agent.cohort}</strong>
                  <em>{nodeActionLabel(state, agent.variable, isEnglish)}</em>
                  <i aria-hidden />
                </button>
              );
            })}
          </div>

          <div className="agent-topology-legend">
            <span>
              <i className="active" aria-hidden />
              {choose("Orchestrating", "正在编排")}
            </span>
            <span>
              <i className="presented" aria-hidden />
              {choose("Presented", "已呈现")}
            </span>
            <span>
              <i className="queued" aria-hidden />
              {choose("Waiting", "等待")}
            </span>
          </div>
        </div>

        <aside
          className={`agent-dossier ${selectedState}`}
          aria-atomic="true"
          aria-live="polite"
        >
          <header>
            <div>
              <p>AGENT DOSSIER</p>
              <span>{selectedAgent.id}</span>
            </div>
            <button
              onClick={() => setPinnedIndex(null)}
              type="button"
              disabled={pinnedIndex === null}
            >
              {pinnedIndex === null
                ? choose("Following current", "跟随当前")
                : choose("Return to current", "回到当前")}
            </button>
          </header>

          <div className="agent-dossier-title">
            <span>
              {choose("SYNTHETIC PERSONA", "合成人物")} · WAVE 0
              {selectedAgent.wave}
            </span>
            <h3>{selectedAgent.cohort}</h3>
            <p>
              {stateLabel(selectedState, selectedAgent.variable, isEnglish)}
            </p>
          </div>

          <div className="agent-local-activity">
            <DataConnected size={18} aria-hidden />
            <div>
              <span>CURRENT LOCAL ACTION</span>
              <strong>
                {stateLabel(selectedState, selectedAgent.variable, isEnglish)}
              </strong>
            </div>
          </div>

          <dl className="agent-dossier-meta">
            <div>
              <dt>{choose("Business context", "业务情境")}</dt>
              <dd>{selectedAgent.context}</dd>
            </div>
            <div>
              <dt>{choose("Differentiating variable", "差异变量")}</dt>
              <dd>{selectedAgent.variable}</dd>
            </div>
            <div>
              <dt>{choose("Covered gaps", "覆盖缺口")}</dt>
              <dd>{selectedCoverage.join(" / ")}</dd>
            </div>
            <div>
              <dt>{choose("Network actions", "网络动作")}</dt>
              <dd className="disabled">
                {choose("Disabled · 0 sends", "禁用 · 0 次发送")}
              </dd>
            </div>
          </dl>

          <div className="agent-draft">
            <span>{choose("Inquiry draft", "询问草案")}</span>
            {selectedState === "queued" ? (
              <p className="agent-draft-locked">
                <Locked size={16} aria-hidden />
                {choose(
                  "This agent has not entered the current wave. Select next to reveal its question.",
                  "该 Agent 尚未进入本轮编排。点击下一步后展开问句。",
                )}
              </p>
            ) : (
              <blockquote>{selectedAgent.inquiryDraft}</blockquote>
            )}
          </div>

          <ol
            className="agent-mini-trace"
            aria-label={choose(
              "Current agent local steps",
              "当前 Agent 本地步骤",
            )}
          >
            <li className={stageClass("frame", selectedState)}>
              <span>01</span>
              <div>
                <strong>{choose("Model variables", "变量建模")}</strong>
                <small>
                  {choose(
                    "Read the context and differentiating variable",
                    "读取情境与差异变量",
                  )}
                </small>
              </div>
            </li>
            <li className={stageClass("draft", selectedState)}>
              <span>02</span>
              <div>
                <strong>{choose("Draft question", "形成问句")}</strong>
                <small>
                  {choose(
                    "Align with the fact gap under test",
                    "对齐需要验证的事实缺口",
                  )}
                </small>
              </div>
            </li>
            <li className={stageClass("gate", selectedState)}>
              <span>03</span>
              <div>
                <strong>{choose("Await authorization", "等待授权")}</strong>
                <small>
                  {choose(
                    "This page never sends on the user’s behalf",
                    "页面不会代替用户发送",
                  )}
                </small>
              </div>
            </li>
          </ol>
        </aside>
      </div>

      <footer className="agent-command-next">
        <div>
          <span>{hasMoreAgents ? "NEXT AGENT" : "NEXT STAGE"}</span>
          <strong>
            {hasMoreAgents
              ? `${nextAgent.id} · ${nextAgent.cohort}`
              : choose("Open response branches", "进入响应分支")}
          </strong>
          <small>
            {choose(
              "Everything remains inside the local sandbox",
              "所有内容仍停留在本地沙盒",
            )}
          </small>
        </div>
        <button onClick={advanceFromField} type="button">
          {hasMoreAgents
            ? choose("Next agent", "下一个 Agent")
            : choose("Open response branches", "进入响应分支")}
          <ArrowRight size={18} aria-hidden />
        </button>
      </footer>
    </section>
  );
}
