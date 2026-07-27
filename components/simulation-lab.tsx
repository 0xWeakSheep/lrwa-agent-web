"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  DataConnected,
  Flow,
  Locked,
  Pause,
  Play,
  Reset,
} from "@carbon/icons-react";
import { AgentMissionControl } from "@/components/agent-mission-control";
import { useI18n } from "@/components/locale-provider";
import { localizeScenario } from "@/lib/simulation-copy";
import scenario from "@/lib/simulation-scenario.json";

const lastPhaseIndex = scenario.phases.length - 1;

function PublicInputStage() {
  const { choose, locale } = useI18n();
  const localizedScenario = localizeScenario(locale);

  return (
    <div className="simulation-stage-content">
      <div className="simulation-stage-heading">
        <p>REAL SUBJECT · PUBLIC CLUES</p>
        <h2>
          {choose(
            "Start with a real subject, but never mistake public fields for answers.",
            "从真实对象开始，但不把公开字段当答案。",
          )}
        </h2>
        <span>
          {choose(
            "These three sources establish investigation entry points only. A listing, address, or phone field cannot prove that a store is operating now or can accept a bulk order.",
            "这三项来源只负责建立调查入口。页面列名、地址或电话不能证明门店现在营业，也不能证明能接下批量订单。",
          )}
        </span>
      </div>

      <div className="simulation-claim-block">
        <span>{choose("CLAIM UNDER TEST", "待验证命题")}</span>
        <blockquote>{localizedScenario.claim}</blockquote>
        <small>
          {choose(
            "This is an investigation question, not an established fact.",
            "以上是调查问题，不是既定事实。",
          )}
        </small>
      </div>

      <div className="simulation-source-list">
        {localizedScenario.sources.map((source) => (
          <article key={source.id}>
            <span>{source.id}</span>
            <div>
              <h3>{source.label}</h3>
              <p>{source.observedText}</p>
              <small>{source.boundary}</small>
            </div>
            <a
              href={source.url}
              rel="noreferrer"
              target="_blank"
              aria-label={choose(`Open ${source.label}`, `打开${source.label}`)}
            >
              {choose("Public source", "公开来源")}
              <ArrowRight size={16} aria-hidden />
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}

function ClaimMapStage() {
  const { choose, locale } = useI18n();
  const localizedScenario = localizeScenario(locale);

  return (
    <div className="simulation-stage-content">
      <div className="simulation-stage-heading">
        <p>CLAIM MAP · NO INFERENCE YET</p>
        <h2>
          {choose(
            "Split one sentence into four gaps that must be verified separately.",
            "先把一句话拆成四个必须分别求证的缺口。",
          )}
        </h2>
        <span>
          {choose(
            "Every later question must target at least one gap. The model cannot fill unknown fields with common-sense assumptions.",
            "后续每条问句都必须命中至少一个缺口。模型不能用常识自动补齐未知字段。",
          )}
        </span>
      </div>

      <div className="simulation-fact-grid">
        {localizedScenario.facts.map((fact, index) => (
          <article key={fact.id}>
            <div>
              <span>{fact.id}</span>
              <small>{choose("UNVERIFIED", "待求证")}</small>
            </div>
            <strong>{fact.label}</strong>
            <p>{fact.question}</p>
            <footer>
              <Locked size={14} aria-hidden />
              {choose("Real evidence 0", "真实证据 0")}
            </footer>
            <span className="simulation-fact-index" aria-hidden>
              {String(index + 1).padStart(2, "0")}
            </span>
          </article>
        ))}
      </div>
    </div>
  );
}

function PersonaCohortStage() {
  const { choose, locale } = useI18n();
  const localizedScenario = localizeScenario(locale);

  return (
    <div className="simulation-stage-content">
      <div className="simulation-stage-heading">
        <p>PERSONA COHORT · LOCAL SYNTHESIS</p>
        <h2>
          {choose(
            "Place the same question in twelve realistic buying contexts.",
            "同一个问题，放进十二种真实购买情境。",
          )}
        </h2>
        <span>
          {choose(
            "These are local synthetic personas with no names, accounts, or real identities. Their differences come from business variables such as timing, pickup, payment, and drink mix.",
            "这些是本地合成人物，没有姓名、账号或真实身份。差异来自时间、取货、付款和饮品组合等业务变量。",
          )}
        </span>
      </div>

      <div className="simulation-persona-grid">
        {localizedScenario.personas.map((persona) => (
          <article key={persona.id}>
            <header>
              <span>{persona.id}</span>
              <small>{choose("SYNTHETIC PERSONA", "合成人物")}</small>
            </header>
            <strong>{persona.cohort}</strong>
            <p>{persona.context}</p>
            <footer>
              <span>{choose("VARIABLE", "变量")}</span>
              <b>{persona.variable}</b>
            </footer>
          </article>
        ))}
      </div>
    </div>
  );
}

function InquiryWaveStage({
  onAdvance,
  revealedInquiryCount,
}: {
  onAdvance: () => void;
  revealedInquiryCount: number;
}) {
  return (
    <div className="simulation-stage-content agent-field-stage">
      <AgentMissionControl
        onAdvance={onAdvance}
        revealedCount={revealedInquiryCount}
      />
    </div>
  );
}

function ResponseBranchStage() {
  const { choose, locale } = useI18n();
  const localizedScenario = localizeScenario(locale);

  return (
    <div className="simulation-stage-content">
      <div className="simulation-stage-heading">
        <p>HYPOTHESIS TREE · NOT CUSTOMER SERVICE REPLIES</p>
        <h2>
          {choose(
            "Do not fabricate support replies. Model only the branch an answer might enter.",
            "不编造客服原话，只预演回答可能落入哪一种分支。",
          )}
        </h2>
        <span>
          {choose(
            "Branches decide the next question. In a real run, only original replies with sources and timestamps can replace these system hypotheses.",
            "分支用于决定下一问。真正运行时，只有带来源和时间戳的原始回复才能替换这些系统假设。",
          )}
        </span>
      </div>

      <div className="simulation-branch-list">
        {localizedScenario.responseBranches.map((branch) => (
          <article key={branch.id}>
            <header>
              <span>{branch.id}</span>
              <small>
                {choose(
                  "SYSTEM HYPOTHESIS · NOT A REAL REPLY",
                  "系统假设 · 非真实回复",
                )}
              </small>
            </header>
            <h3>{branch.label}</h3>
            <dl>
              <div>
                <dt>{choose("Trigger condition", "触发条件")}</dt>
                <dd>{branch.condition}</dd>
              </div>
              <div>
                <dt>{choose("Next probe", "下一轮追问")}</dt>
                <dd>{branch.nextProbe}</dd>
              </div>
              <div>
                <dt>{choose("Evidence required", "解锁所需")}</dt>
                <dd>{branch.evidenceNeeded}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </div>
  );
}

function EvidenceGateStage() {
  const { choose } = useI18n();

  return (
    <div className="simulation-stage-content">
      <div className="simulation-gate">
        <div className="simulation-gate-icon">
          <Locked size={34} aria-hidden />
        </div>
        <p>EVIDENCE GATE · LOCKED</p>
        <h2>
          {choose(
            "The walkthrough is complete. The factual finding is still empty.",
            "演示走完了，事实判断仍然为空。",
          )}
        </h2>
        <span>
          {choose(
            "Without real receipts, we cannot determine whether the stores are separate, whether they are operating, or which one can accept the order.",
            "没有真实回执，不能判断两个门店是否独立、是否营业，也不能判断哪家能够承接订单。",
          )}
        </span>
        <div className="simulation-gate-checks">
          <div>
            <span>{choose("Real requests", "真实请求")}</span>
            <strong>0</strong>
          </div>
          <div>
            <span>{choose("Real replies", "真实回复")}</span>
            <strong>0</strong>
          </div>
          <div>
            <span>{choose("Real receipts", "真实回执")}</span>
            <strong>0</strong>
          </div>
        </div>
        <Link className="cinematic-primary" href="/investigations">
          {choose("Build a real investigation", "建立真实调查")}
          <ArrowRight size={20} aria-hidden />
        </Link>
      </div>
    </div>
  );
}

function phaseIndexForId(phaseId?: string) {
  const index = scenario.phases.findIndex((phase) => phase.id === phaseId);
  return index >= 0 ? index : 0;
}

function SimulationStage({
  onAdvance,
  phaseId,
  revealedInquiryCount,
}: {
  onAdvance: () => void;
  phaseId: string;
  revealedInquiryCount: number;
}) {
  switch (phaseId) {
    case "decompose":
      return <ClaimMapStage />;
    case "personas":
      return <PersonaCohortStage />;
    case "inquiries":
      return (
        <InquiryWaveStage
          onAdvance={onAdvance}
          revealedInquiryCount={revealedInquiryCount}
        />
      );
    case "branches":
      return <ResponseBranchStage />;
    case "gate":
      return <EvidenceGateStage />;
    default:
      return <PublicInputStage />;
  }
}

export function SimulationLab({ initialPhaseId }: { initialPhaseId?: string }) {
  const { choose, locale } = useI18n();
  const localizedScenario = localizeScenario(locale);
  const initialPhaseIndex = phaseIndexForId(initialPhaseId);
  const [activePhaseIndex, setActivePhaseIndex] = useState(initialPhaseIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [revealedInquiryCount, setRevealedInquiryCount] = useState(1);
  const activePhase = localizedScenario.phases[activePhaseIndex];
  const isInquiryPhase = activePhase.id === "inquiries";
  const hasMoreInquiries =
    isInquiryPhase && revealedInquiryCount < scenario.personas.length;
  const nextPhase = localizedScenario.phases[activePhaseIndex + 1];

  useEffect(() => {
    if (!isPlaying) {
      return;
    }
    if (activePhaseIndex >= lastPhaseIndex) {
      return;
    }

    const timer = window.setTimeout(
      () => {
        if (
          activePhase.id === "inquiries" &&
          revealedInquiryCount < scenario.personas.length
        ) {
          const nextPersona = scenario.personas[revealedInquiryCount];
          setRevealedInquiryCount((current) =>
            Math.min(current + 1, scenario.personas.length),
          );
          window.requestAnimationFrame(() => {
            document
              .getElementById(`simulation-inquiry-${nextPersona.id}`)
              ?.scrollIntoView({ block: "center" });
          });
          return;
        }

        const nextPhaseIndex = Math.min(activePhaseIndex + 1, lastPhaseIndex);
        setActivePhaseIndex(nextPhaseIndex);
        window.requestAnimationFrame(() => {
          document
            .getElementById("simulation-frame")
            ?.scrollIntoView({ block: "start" });
        });
        if (nextPhaseIndex === lastPhaseIndex) {
          setIsPlaying(false);
        }
      },
      activePhase.id === "inquiries" ? 1400 : 2400,
    );

    return () => window.clearTimeout(timer);
  }, [activePhase.id, activePhaseIndex, isPlaying, revealedInquiryCount]);

  function selectPhase(index: number) {
    setIsPlaying(false);
    setActivePhaseIndex(index);
  }

  function scrollToFrame() {
    window.requestAnimationFrame(() => {
      document
        .getElementById("simulation-frame")
        ?.scrollIntoView({ block: "start" });
    });
  }

  function showNextInquiry() {
    const nextPersona = scenario.personas[revealedInquiryCount];
    setRevealedInquiryCount((current) =>
      Math.min(current + 1, scenario.personas.length),
    );
    window.requestAnimationFrame(() => {
      document
        .getElementById(`simulation-inquiry-${nextPersona.id}`)
        ?.scrollIntoView({ block: "center" });
    });
  }

  function advance() {
    setIsPlaying(false);
    if (hasMoreInquiries) {
      showNextInquiry();
      return;
    }
    if (activePhaseIndex === lastPhaseIndex) {
      setActivePhaseIndex(initialPhaseIndex);
      setRevealedInquiryCount(1);
      scrollToFrame();
      return;
    }
    setActivePhaseIndex((current) => Math.min(current + 1, lastPhaseIndex));
    scrollToFrame();
  }

  function retreat() {
    setIsPlaying(false);
    if (isInquiryPhase && revealedInquiryCount > 1) {
      setRevealedInquiryCount((current) => Math.max(current - 1, 1));
      return;
    }
    setActivePhaseIndex((current) => Math.max(current - 1, 0));
    scrollToFrame();
  }

  function togglePlayback() {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }
    if (activePhaseIndex === lastPhaseIndex) {
      setActivePhaseIndex(initialPhaseIndex);
      setRevealedInquiryCount(1);
    }
    setIsPlaying(true);
  }

  function resetPlayback() {
    setIsPlaying(false);
    setActivePhaseIndex(initialPhaseIndex);
    setRevealedInquiryCount(1);
    scrollToFrame();
  }

  return (
    <div
      className="simulation-lab"
      data-environment="sandbox"
      data-real-receipts={scenario.metrics.realReceipts}
      data-real-replies={scenario.metrics.realReplies}
      data-real-sends={scenario.metrics.realSends}
    >
      <section
        className="simulation-disclosure"
        aria-label={choose("Simulation lab boundary", "模拟实验边界")}
      >
        <div>
          <DataConnected size={19} aria-hidden />
          <span>SANDBOX ONLY</span>
        </div>
        <p>
          {choose(
            `Sandbox simulation · ${scenario.metrics.simulatedPersonas} synthetic personas · no external connection · nothing sent`,
            `沙盒模拟 · ${scenario.metrics.simulatedPersonas} 个合成人物 · 未连接外部平台 · 未真实发送`,
          )}
        </p>
        <strong>0 REAL ACTIONS</strong>
      </section>

      <section className="brief-truth-bar simulation-truth-bar">
        <div>
          <span>{choose("Real requests", "真实请求")}</span>
          <strong>0</strong>
        </div>
        <div>
          <span>{choose("Real replies", "真实回复")}</span>
          <strong>0</strong>
        </div>
        <div>
          <span>{choose("Real receipts", "真实回执")}</span>
          <strong>0</strong>
        </div>
        <div>
          <span>{choose("Finding status", "判断状态")}</span>
          <strong>{choose("Conclusion locked", "结论锁定")}</strong>
        </div>
      </section>

      <section
        className="simulation-playback"
        aria-label={choose("Simulation playback controls", "模拟回放控制")}
      >
        <div className="runtime-state">
          <span
            className={`runtime-pulse${isPlaying ? "" : " paused"}`}
            aria-hidden
          />
          <div aria-atomic="true" aria-live="polite">
            <strong>
              STEP {activePhase.code} /{" "}
              {String(scenario.phases.length).padStart(2, "0")} ·{" "}
              {activePhase.label}
            </strong>
            <small>
              {isPlaying
                ? choose("Replaying the local experiment", "正在回放本地实验")
                : choose("Waiting for user control", "等待用户控制")}
            </small>
          </div>
        </div>

        <div className="simulation-controls">
          <button
            disabled={
              activePhaseIndex === 0 &&
              (!isInquiryPhase || revealedInquiryCount === 1)
            }
            onClick={retreat}
            type="button"
          >
            <ChevronLeft size={17} aria-hidden />
            {choose("Previous", "上一步")}
          </button>
          <button
            aria-pressed={isPlaying}
            className="simulation-play-button"
            onClick={togglePlayback}
            type="button"
          >
            {isPlaying ? (
              <Pause size={17} aria-hidden />
            ) : (
              <Play size={17} aria-hidden />
            )}
            {isPlaying
              ? choose("Pause", "暂停")
              : choose("Play full walkthrough", "播放全过程")}
          </button>
          <button
            disabled={activePhaseIndex === lastPhaseIndex}
            onClick={advance}
            type="button"
          >
            {hasMoreInquiries
              ? choose("Next inquiry", "下一个询问")
              : choose("Next step", "下一步")}
            <ChevronRight size={17} aria-hidden />
          </button>
          <Link
            className="simulation-agent-field-link"
            href="/investigations/simulation?start=inquiries"
          >
            <Flow size={17} aria-hidden />
            {choose("Agent field", "Agent 全景")}
          </Link>
          <button onClick={resetPlayback} type="button">
            <Reset size={17} aria-hidden />
            {choose("Reset", "重置")}
          </button>
        </div>
      </section>

      <nav
        className="simulation-stage-track"
        aria-label={choose("Simulation lab steps", "模拟实验步骤")}
      >
        {localizedScenario.phases.map((phase, index) => (
          <button
            aria-current={index === activePhaseIndex ? "step" : undefined}
            className={
              index === activePhaseIndex
                ? "active"
                : index < activePhaseIndex
                  ? "viewed"
                  : ""
            }
            key={phase.id}
            onClick={() => selectPhase(index)}
            type="button"
          >
            <span>{phase.code}</span>
            <div>
              <strong>{phase.label}</strong>
              <small>{phase.protocol}</small>
            </div>
          </button>
        ))}
      </nav>

      <div
        className={`simulation-layout${isInquiryPhase ? " agent-field-layout" : ""}`}
      >
        <section
          className={`simulation-frame${isInquiryPhase ? " agent-field-frame" : ""}`}
          id="simulation-frame"
          aria-labelledby="simulation-frame-title"
        >
          <header>
            <div>
              <p>{activePhase.protocol}</p>
              <h2 id="simulation-frame-title">{activePhase.label}</h2>
            </div>
            <span>{activePhase.description}</span>
          </header>
          <SimulationStage
            onAdvance={advance}
            phaseId={activePhase.id}
            revealedInquiryCount={revealedInquiryCount}
          />
          {!isInquiryPhase && (
            <footer className="simulation-stage-navigation">
              <div>
                <span>
                  {activePhaseIndex === lastPhaseIndex ? "REPLAY" : "NEXT STEP"}
                </span>
                <strong>
                  {activePhaseIndex === lastPhaseIndex
                    ? choose("Restart from the claim map", "从命题拆解重新开始")
                    : nextPhase?.label}
                </strong>
              </div>
              <button onClick={advance} type="button">
                {activePhaseIndex === lastPhaseIndex
                  ? choose("Replay", "从头再看")
                  : choose("Next step", "下一步")}
                <ArrowRight size={18} aria-hidden />
              </button>
            </footer>
          )}
        </section>

        {!isInquiryPhase && (
          <aside className="simulation-ledger">
            <header>
              <p>LOCAL EVENT TRACE</p>
              <h2>{choose("Process monitor", "过程监视器")}</h2>
            </header>
            <ol>
              {localizedScenario.phases.map((phase, index) => {
                const isCurrent = index === activePhaseIndex;
                const isViewed = index < activePhaseIndex;
                return (
                  <li
                    className={isCurrent ? "current" : isViewed ? "viewed" : ""}
                    key={phase.id}
                  >
                    <span>{phase.code}</span>
                    <div>
                      <strong>{phase.label}</strong>
                      <p>
                        {isCurrent
                          ? choose("Presenting locally", "正在本地呈现")
                          : isViewed
                            ? choose(
                                "Viewed in this replay",
                                "已在本次回放中查看",
                              )
                            : choose("Not viewed yet", "尚未查看")}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
            <div className="simulation-ledger-boundary">
              <Flow size={18} aria-hidden />
              <div>
                <strong>
                  {choose(
                    "Sandbox events never enter the evidence ledger",
                    "沙盒事件不进入证据账本",
                  )}
                </strong>
                <p>
                  {choose(
                    "This page writes no send confirmations, real replies, or evidence receipts.",
                    "页面不会写入发送确认、真实回复或证据回执。",
                  )}
                </p>
              </div>
            </div>
            <div className="simulation-ledger-lock">
              <Locked size={18} aria-hidden />
              <span>
                {choose(
                  "The real conclusion remains locked",
                  "真实结论持续锁定",
                )}
              </span>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
