"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Checkmark,
  DataConnected,
  Locked,
} from "@carbon/icons-react";
import { LandingRoleStage } from "@/components/landing-role-stage";
import { Brand, SiteHeader } from "@/components/site-header";
import { useI18n } from "@/components/locale-provider";

const homeCopy = {
  en: {
    heroEyebrow: "FIELD EVIDENCE OPERATIONS",
    heroLineOne: "Most agents analyze.",
    heroLineTwo: "LRWA investigates.",
    heroDeck:
      "Agents run customer journeys, supplier probes, and competitor checks to find evidence the dataset does not contain.",
    simulate: "Run the field simulation",
    build: "Build an investigation",
    visualStatus: "METHOD PREVIEW",
    zeroActions: "0 NETWORK ACTIONS",
    loading: "STAGING FIELDWORK",
    received: "CLAIM RECEIVED",
    rolesReady: "ROLE MISSIONS STAGED",
    probesReady: "PROBES READY",
    gateLocked: "EVIDENCE GATE LOCKED",
    differenceTitle: "Not another report agent.",
    differenceBody:
      "Most agents explain public data. LRWA turns missing facts into role-based fieldwork and preserves what comes back.",
    passiveLabel: "PASSIVE ANALYSIS",
    passiveTitle: "Reads supplied data",
    suppliedData: "SUPPLIED DATA",
    synthesis: "SYNTHESIS",
    report: "REPORT",
    passiveNote: "The workflow ends where the available data ends.",
    activeLabel: "FIELD EVIDENCE OPERATIONS",
    activeTitle: "Finds what is missing",
    claim: "CLAIM",
    missingFacts: "MISSING FACTS",
    roleMissions: "ROLE MISSIONS",
    probes: "PROBES",
    receipts: "RECEIPTS",
    decisionGate: "DECISION GATE",
    buyer: "BUYER",
    supplier: "SUPPLIER",
    competitor: "COMPETITOR",
    skeptic: "SKEPTIC",
    activeNote:
      "Agents stage different questions, gather traceable receipts through authorized channels, and keep the conclusion locked until evidence arrives.",
    methodTitle: "One claim. Four ways to test it.",
    methodBody:
      "Each role probes a different blind spot before a conclusion is allowed.",
    evidenceEyebrow: "EVIDENCE BEFORE ANSWERS",
    evidenceTitle: "No receipt. No conclusion.",
    evidenceOne: "Preserve the source and capture time",
    evidenceTwo: "Bind every follow-up to its receipt",
    evidenceThree: "Lock the judgment when evidence is missing",
    evidenceNote:
      "Concept visual. It does not represent completed external research.",
    evidenceCta: "Open the evidence room",
    boundaryTitle: "Fieldwork needs boundaries.",
    defaultMode: "DEFAULT MODE",
    assistedTitle: "Human-reviewed fieldwork",
    assistedBody:
      "AI stages the roles and probes. A user reviews every external action before it happens.",
    permissionMode: "WITH PERMISSION",
    connectorTitle: "Authorized connections",
    connectorBody:
      "Use formal APIs, customer-provided data, and public sources that permit access.",
    demoMode: "FOR DEMONSTRATION",
    sandboxTitle: "Local simulation",
    sandboxBody:
      "Synthetic personas and branches stay separate from the real evidence ledger.",
    closingTitle: "Bring us a claim worth testing.",
    footerPurpose: "Evidence operations for commercial diligence",
    footerBoundary: "No live outreach by default",
    heroAlt: "",
    fieldAlt:
      "Concept illustration of an evidence workspace with store records and observation markers",
  },
  zh: {
    heroEyebrow: "主动证据调查",
    heroLineOne: "大多数 AI 只分析。",
    heroLineTwo: "LRWA 会去调查。",
    heroDeck:
      "Agent 以客户路径、供应链追问和竞品核验，寻找数据集里本来不存在的新证据。",
    simulate: "运行调查模拟",
    build: "建立调查",
    visualStatus: "方法预览",
    zeroActions: "0 次真实外联",
    loading: "正在编排调查任务",
    received: "主张已接收",
    rolesReady: "角色任务已建立",
    probesReady: "追问已准备",
    gateLocked: "证据门槛已锁定",
    differenceTitle: "它不是另一个研报 Agent。",
    differenceBody:
      "普通分析解释已有输入，LRWA 则把缺失事实变成主动求证并保存回执的调查流程。",
    passiveLabel: "被动数据分析",
    passiveTitle: "读取已有数据",
    suppliedData: "已有数据",
    synthesis: "归纳",
    report: "报告",
    passiveNote: "已有数据在哪里结束，分析也就在哪里结束。",
    activeLabel: "主动证据调查",
    activeTitle: "寻找缺失事实",
    claim: "商业主张",
    missingFacts: "缺失事实",
    roleMissions: "角色任务",
    probes: "深度追问",
    receipts: "原始回执",
    decisionGate: "决策门槛",
    buyer: "买家",
    supplier: "供应链",
    competitor: "竞品",
    skeptic: "挑战者",
    activeNote:
      "Agent 用不同身份情境组织问题，通过授权渠道取得可追溯回执，并在证据到达前锁住结论。",
    methodTitle: "一个主张，四种求证视角。",
    methodBody: "每个角色负责刺穿一个不同盲区，证据到位后才允许形成判断。",
    evidenceEyebrow: "先有证据，再有答案",
    evidenceTitle: "没有回执，就没有结论。",
    evidenceOne: "保存原始来源与采集时间",
    evidenceTwo: "把每次追问与回执绑定",
    evidenceThree: "证据不足时锁住判断",
    evidenceNote: "概念视觉，不代表已经执行任何外部调查。",
    evidenceCta: "打开证据室",
    boundaryTitle: "主动调查必须有边界。",
    defaultMode: "默认模式",
    assistedTitle: "人工审核调查",
    assistedBody: "AI 编排角色与追问，每次外部行动都先由用户审核。",
    permissionMode: "获得授权时",
    connectorTitle: "授权数据连接",
    connectorBody: "只使用正式 API、客户提供的数据和允许访问的公开来源。",
    demoMode: "演示方法时",
    sandboxTitle: "本地模拟",
    sandboxBody: "合成人物与响应分支始终和真实证据账本隔离。",
    closingTitle: "给我们一个值得被检验的主张。",
    footerPurpose: "面向商业尽调的证据行动系统",
    footerBoundary: "默认不执行真实外联",
    heroAlt: "",
    fieldAlt: "包含门店记录和观察标记的概念化证据工作台插画",
  },
} as const;

function FieldworkLaunchSequence({
  copy,
}: {
  copy: (typeof homeCopy)[keyof typeof homeCopy];
}) {
  return (
    <div className="fieldwork-launch" aria-hidden>
      <div className="fieldwork-launch-panel panel-one" />
      <div className="fieldwork-launch-panel panel-two" />
      <div className="fieldwork-launch-panel panel-three" />
      <div className="fieldwork-launch-panel panel-four" />

      <div className="fieldwork-launch-core">
        <Image alt="" height={48} src="/lrwa-mark.svg" width={48} />
        <span>{copy.loading}</span>
        <div className="fieldwork-launch-routes">
          <i className="route-one" />
          <i className="route-two" />
          <i className="route-three" />
          <i className="route-four" />
        </div>
      </div>

      <div className="fieldwork-launch-manifest">
        <span>{copy.received}</span>
        <span>{copy.rolesReady}</span>
        <span>{copy.probesReady}</span>
        <span>{copy.gateLocked}</span>
      </div>
      <strong>{copy.zeroActions}</strong>
    </div>
  );
}

function EvidenceDifference({
  copy,
}: {
  copy: (typeof homeCopy)[keyof typeof homeCopy];
}) {
  return (
    <section className="evidence-difference" aria-labelledby="difference-title">
      <div
        className="section-backdrop section-backdrop-difference"
        aria-hidden="true"
      >
        <Image
          alt=""
          fill
          sizes="100vw"
          src="/lrwa-analysis-fieldwork-bg.webp"
          unoptimized
        />
      </div>

      <header>
        <h2 id="difference-title">{copy.differenceTitle}</h2>
        <p>{copy.differenceBody}</p>
      </header>

      <div className="difference-map">
        <article className="difference-passive">
          <div>
            <span>{copy.passiveLabel}</span>
            <h3>{copy.passiveTitle}</h3>
          </div>
          <ol>
            <li>{copy.suppliedData}</li>
            <li>{copy.synthesis}</li>
            <li>{copy.report}</li>
          </ol>
          <p>{copy.passiveNote}</p>
        </article>

        <article className="difference-active">
          <div className="difference-active-heading">
            <span>{copy.activeLabel}</span>
            <h3>{copy.activeTitle}</h3>
          </div>

          <div className="difference-field-flow">
            <div className="difference-flow-origin">
              <span>{copy.claim}</span>
              <ArrowRight size={17} aria-hidden />
              <span>{copy.missingFacts}</span>
            </div>

            <div className="difference-role-fanout">
              <strong>{copy.roleMissions}</strong>
              <div>
                <span>{copy.buyer}</span>
                <span>{copy.supplier}</span>
                <span>{copy.competitor}</span>
                <span>{copy.skeptic}</span>
              </div>
            </div>

            <div className="difference-flow-return">
              <span>{copy.probes}</span>
              <ArrowRight size={17} aria-hidden />
              <span>{copy.receipts}</span>
              <ArrowRight size={17} aria-hidden />
              <strong>
                <Locked size={15} aria-hidden />
                {copy.decisionGate}
              </strong>
            </div>
          </div>

          <p>{copy.activeNote}</p>
        </article>
      </div>
    </section>
  );
}

export function HomeExperience() {
  const { locale } = useI18n();
  const copy = homeCopy[locale];

  return (
    <main className="marketing-page" id="main-content">
      <SiteHeader />

      <section className="cinematic-hero" aria-labelledby="hero-title">
        <div className="cinematic-media" aria-hidden="true">
          <Image
            alt={copy.heroAlt}
            className="cinematic-image"
            fill
            priority
            sizes="100vw"
            src="/lrwa-fieldwork-hero.webp"
            unoptimized
          />
        </div>

        <FieldworkLaunchSequence copy={copy} />

        <div className="cinematic-hero-inner">
          <div className="cinematic-copy">
            <p className="hero-field-label">{copy.heroEyebrow}</p>
            <h1 id="hero-title">
              {copy.heroLineOne}
              <span>{copy.heroLineTwo}</span>
            </h1>
            <p className="cinematic-deck">{copy.heroDeck}</p>
            <div className="cinematic-actions">
              <Link
                className="cinematic-primary"
                href="/investigations/example"
              >
                {copy.simulate}
                <ArrowRight size={20} aria-hidden />
              </Link>
              <Link className="cinematic-secondary" href="/investigations">
                {copy.build}
              </Link>
            </div>
          </div>

          <div
            className="fieldwork-visual-status"
            aria-label={copy.zeroActions}
          >
            <DataConnected size={17} aria-hidden />
            <span>{copy.visualStatus}</span>
            <strong>{copy.zeroActions}</strong>
          </div>
        </div>
      </section>

      <EvidenceDifference copy={copy} />

      <section
        className="cinematic-method"
        id="method"
        aria-labelledby="method-title"
      >
        <div
          className="section-backdrop section-backdrop-method"
          aria-hidden="true"
        >
          <Image
            alt=""
            fill
            sizes="100vw"
            src="/lrwa-role-orchestration-bg.webp"
            unoptimized
          />
        </div>

        <div className="cinematic-method-intro">
          <h2 id="method-title">{copy.methodTitle}</h2>
          <p>{copy.methodBody}</p>
        </div>

        <LandingRoleStage />
      </section>

      <section className="cinematic-field" aria-labelledby="field-title">
        <Image
          alt={copy.fieldAlt}
          className="cinematic-field-image"
          fill
          sizes="(max-width: 680px) 100vw, 1280px"
          src="/lrwa-evidence-table.webp"
          unoptimized
        />
        <div className="cinematic-field-shade" aria-hidden />
        <div className="cinematic-field-copy">
          <p className="cinematic-section-label">{copy.evidenceEyebrow}</p>
          <h2 id="field-title">{copy.evidenceTitle}</h2>
          <div className="evidence-principles">
            <div>
              <Checkmark size={18} aria-hidden />
              <span>{copy.evidenceOne}</span>
            </div>
            <div>
              <Checkmark size={18} aria-hidden />
              <span>{copy.evidenceTwo}</span>
            </div>
            <div>
              <Locked size={18} aria-hidden />
              <span>{copy.evidenceThree}</span>
            </div>
          </div>
          <p className="cinematic-field-note">{copy.evidenceNote}</p>
          <Link
            className="cinematic-primary cinematic-field-link"
            href="/investigations/evidence"
          >
            {copy.evidenceCta}
            <ArrowRight size={20} aria-hidden />
          </Link>
        </div>
      </section>

      <section
        className="operating-modes"
        id="boundaries"
        aria-labelledby="boundaries-title"
      >
        <div className="operating-heading">
          <h2 id="boundaries-title">{copy.boundaryTitle}</h2>
        </div>
        <div className="operating-primary">
          <span>{copy.defaultMode}</span>
          <h3>{copy.assistedTitle}</h3>
          <p>{copy.assistedBody}</p>
        </div>
        <div className="operating-stack">
          <article>
            <span>{copy.permissionMode}</span>
            <h3>{copy.connectorTitle}</h3>
            <p>{copy.connectorBody}</p>
          </article>
          <article>
            <span>{copy.demoMode}</span>
            <h3>{copy.sandboxTitle}</h3>
            <p>{copy.sandboxBody}</p>
          </article>
        </div>
      </section>

      <section className="closing-invitation">
        <h2>{copy.closingTitle}</h2>
        <Link className="cinematic-primary" href="/investigations">
          {copy.build}
          <ArrowRight size={20} aria-hidden />
        </Link>
      </section>

      <footer className="cinematic-footer">
        <Brand />
        <p>{copy.footerPurpose}</p>
        <p>{copy.footerBoundary}</p>
      </footer>
    </main>
  );
}
