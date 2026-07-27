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
import exampleResult from "@/lib/simulation-example-result.json";
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
    <div className="simulation-stage-content simulation-gate-stage">
      <div
        className="simulation-gate-summary"
        data-artifact-kind={exampleResult.artifactKind}
        data-generated-by-live-run={String(exampleResult.generatedByLiveRun)}
        data-ledger-write={String(exampleResult.ledgerWrite)}
        data-truth-bearing={String(exampleResult.truthBearing)}
      >
        <section className="simulation-gate-summary-head">
          <div>
            <span>ILLUSTRATIVE RESULT / PREBUILT DEMO</span>
            <h2>
              {choose(
                "The prebuilt report specimen is ready.",
                "预制完整报告样张已就绪。",
              )}
            </h2>
            <p>
              {choose(
                "This is a prebuilt demonstration, not the result of this replay. No store, customer service channel, supplier, or external platform was contacted.",
                "这是预制演示，不是本次回放真实跑出的结果。系统没有联系门店、客服、供应商或任何外部平台。",
              )}
            </p>
          </div>
          <dl>
            <div>
              <dt>{choose("Example decision", "示例判断")}</dt>
              <dd>{choose("Conditionally executable", "有条件可执行")}</dd>
            </div>
            <div>
              <dt>{choose("Real evidence", "真实证据")}</dt>
              <dd>0</dd>
            </div>
            <div>
              <dt>{choose("Typical real run", "真实执行周期")}</dt>
              <dd>{choose("Days to months", "数天至数月")}</dd>
            </div>
          </dl>
        </section>

        <section className="simulation-gate-decision">
          <div>
            <p>EXAMPLE DECISION / NOT OBSERVED</p>
            <h3>{choose("Conditionally executable.", "示例判断：有条件可执行。")}</h3>
            <span>
              {choose(
                "Fictional Candidate A is the conditional first choice inside this specimen. Candidate B is a fallback. Neither label maps to either named real store.",
                "仅在这份样张内部，虚构候选 A 是有条件首选，候选 B 是备选；两个标签均未映射到任何一家真实门店。",
              )}
            </span>
          </div>
          <div className="simulation-gate-facts">
            {exampleResult.facts.map((fact) => (
              <article key={fact.id}>
                <span>{fact.id}</span>
                <strong>{choose(fact.label.en, fact.label.zh)}</strong>
                <small>{choose(fact.status.en, fact.status.zh)}</small>
              </article>
            ))}
          </div>
        </section>

        <section className="simulation-gate-actions">
          <Locked size={28} aria-hidden />
          <div>
            <p>REAL-WORLD GATE · STILL LOCKED</p>
            <h3>
              {choose(
                "The real finding has not been produced.",
                "真实结论尚未产生。",
              )}
            </h3>
            <span>
              {choose(
                "Publishing a real result requires authorized outreach, original replies, source identity, timestamps, conflict checks, and human review. Depending on scope and response speed, that work can take days to months.",
                "要发布真实结论，仍需经过授权外联、取得原始回复、核验来源身份与时间戳、处理冲突并完成人工复核。根据范围和响应速度，通常需要数天至数月。",
              )}
            </span>
          </div>
          <Link
            className="cinematic-primary"
            href="/investigations/simulation/report"
          >
            {choose("Open complete report", "查看完整报告")}
            <ArrowRight size={20} aria-hidden />
          </Link>
        </section>
      </div>
    </div>
  );
}

function phaseIndexForId(phaseId?: string) {
  const index = scenario.phases.findIndex((phase) => phase.id === phaseId);
  return index >= 0 ? index : 0;
}

function resetSimulationStageScroll() {
  window.requestAnimationFrame(() => {
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches
      ? "auto"
      : "smooth";
    const frame = document.querySelector<HTMLElement>("#simulation-frame");

    if (window.matchMedia("(max-width: 960px)").matches) {
      frame?.scrollIntoView({ behavior, block: "start" });
      return;
    }

    document
      .querySelector<HTMLElement>("#simulation-frame .simulation-stage-content")
      ?.scrollTo({ behavior, top: 0 });
    document
      .querySelector<HTMLElement>("#simulation-frame .agent-command")
      ?.scrollTo({ behavior, top: 0 });
  });
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
        resetSimulationStageScroll();
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
    resetSimulationStageScroll();
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
      resetSimulationStageScroll();
      return;
    }
    setActivePhaseIndex((current) => Math.min(current + 1, lastPhaseIndex));
    resetSimulationStageScroll();
  }

  function retreat() {
    setIsPlaying(false);
    if (isInquiryPhase && revealedInquiryCount > 1) {
      setRevealedInquiryCount((current) => Math.max(current - 1, 1));
      return;
    }
    setActivePhaseIndex((current) => Math.max(current - 1, 0));
    resetSimulationStageScroll();
  }

  function togglePlayback() {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }
    if (activePhaseIndex === lastPhaseIndex) {
      setActivePhaseIndex(initialPhaseIndex);
      setRevealedInquiryCount(1);
      resetSimulationStageScroll();
    }
    setIsPlaying(true);
  }

  function resetPlayback() {
    setIsPlaying(false);
    setActivePhaseIndex(initialPhaseIndex);
    setRevealedInquiryCount(1);
    resetSimulationStageScroll();
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
                  {activePhaseIndex === lastPhaseIndex ? "REPORT" : "NEXT STEP"}
                </span>
                <strong>
                  {activePhaseIndex === lastPhaseIndex
                    ? choose("Open the complete report", "打开完整报告")
                    : nextPhase?.label}
                </strong>
              </div>
              {activePhaseIndex === lastPhaseIndex ? (
                <Link href="/investigations/simulation/report">
                  {choose("Open report", "查看报告")}
                  <ArrowRight size={18} aria-hidden />
                </Link>
              ) : (
                <button onClick={advance} type="button">
                  {choose("Next step", "下一步")}
                  <ArrowRight size={18} aria-hidden />
                </button>
              )}
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
                          ? activePhase.id === "gate"
                            ? choose(
                                "Presenting a prebuilt sample",
                                "正在展示预制结果",
                              )
                            : choose("Presenting locally", "正在本地呈现")
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
                {activePhase.id === "gate"
                  ? choose(
                      "Real finding locked · result panel is illustrative",
                      "真实结论锁定 · 左侧仅为结果示例",
                    )
                  : choose(
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
