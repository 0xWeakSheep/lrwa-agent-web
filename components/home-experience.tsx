"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@carbon/icons-react";
import { LandingRoleStage } from "@/components/landing-role-stage";
import { Brand, SiteHeader } from "@/components/site-header";
import { useI18n } from "@/components/locale-provider";

const homeCopy = {
  en: {
    heroEyebrow: "MULTI-STAGE AGENT FIELDWORK",
    heroLineOne: "Most agents analyze.",
    heroLineTwo: "LRWA investigates.",
    heroBrand: "LRWA",
    heroAction: "investigates.",
    heroDeck:
      "Agents take on customer, supplier, and competitor roles to find evidence public data cannot.",
    simulate: "Run the field simulation",
    build: "Build an investigation",
    zeroActions: "0 NETWORK ACTIONS",
    loading: "STAGING FIELDWORK",
    received: "CLAIM RECEIVED",
    rolesReady: "ROLE MISSIONS STAGED",
    probesReady: "PROBES READY",
    gateLocked: "EVIDENCE GATE LOCKED",
    differenceTitle: "Not another report agent.",
    passiveLabel: "MOST AGENTS",
    passiveTitle: "DATA / SUMMARY / REPORT",
    activeLabel: "LRWA",
    activeTitle: "PERSONA / INTERACTION / RECEIPT",
    buyer: "BUYER",
    supplier: "SUPPLIER",
    competitor: "COMPETITOR",
    skeptic: "SKEPTIC",
    methodTitle: "Four roles. One claim.",
    evidenceTitle: "No receipt. No conclusion.",
    evidenceTrace: "SOURCE / TIME / ORIGINAL RECEIPT",
    evidenceNote: "CONCEPT VISUAL / NO COMPLETED RESEARCH",
    evidenceCta: "Open the evidence room",
    boundaryTitle: "Bounded by design.",
    boundaryOne: "HUMAN APPROVAL",
    boundaryTwo: "AUTHORIZED SOURCES",
    boundaryThree: "SANDBOX ISOLATION",
    closingTitle: "Bring us a claim worth testing.",
    footerPurpose: "Evidence operations for commercial diligence",
    footerBoundary: "No live outreach by default",
    heroAlt: "",
    fieldAlt:
      "Concept illustration of an evidence workspace with store records and observation markers",
  },
  zh: {
    heroEyebrow: "多阶段 AGENT 实地调查",
    heroLineOne: "大多数 AI 只分析。",
    heroLineTwo: "LRWA 会去调查。",
    heroBrand: "LRWA",
    heroAction: "会去调查。",
    heroDeck:
      "Agent 扮演真实客户、供应商与竞品调研者，展开多轮交互，获取公开数据里没有的一手证据。",
    simulate: "运行调查模拟",
    build: "建立调查",
    zeroActions: "0 次真实外联",
    loading: "正在编排调查任务",
    received: "主张已接收",
    rolesReady: "角色任务已建立",
    probesReady: "追问已准备",
    gateLocked: "证据门槛已锁定",
    differenceTitle: "它不是另一个研报 Agent。",
    passiveLabel: "大多数 AGENT",
    passiveTitle: "数据 / 总结 / 报告",
    activeLabel: "LRWA",
    activeTitle: "角色 / 交互 / 回执",
    buyer: "买家",
    supplier: "供应链",
    competitor: "竞品",
    skeptic: "挑战者",
    methodTitle: "四种角色，一条主张。",
    evidenceTitle: "没有回执，就没有结论。",
    evidenceTrace: "来源 / 时间 / 原始回执",
    evidenceNote: "概念视觉 / 未执行外部调查",
    evidenceCta: "打开证据室",
    boundaryTitle: "边界写进系统。",
    boundaryOne: "人工审核",
    boundaryTwo: "授权来源",
    boundaryThree: "沙盒隔离",
    closingTitle: "给我们一个值得被检验的主张。",
    footerPurpose: "面向商业尽调的证据行动系统",
    footerBoundary: "默认不执行真实外联",
    heroAlt: "",
    fieldAlt: "包含门店记录和观察标记的概念化证据工作台插画",
  },
} as const;

function useHomeRevealMotion() {
  useEffect(() => {
    const page = document.querySelector<HTMLElement>(".marketing-page");
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!page || prefersReducedMotion || !("IntersectionObserver" in window)) {
      return;
    }

    const targets =
      page.querySelectorAll<HTMLElement>("[data-home-reveal]");
    page.classList.add("home-motion-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.12,
      },
    );

    targets.forEach((target) => observer.observe(target));

    return () => {
      observer.disconnect();
      page.classList.remove("home-motion-ready");
    };
  }, []);
}

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

      <header data-home-reveal="heading">
        <h2 className="editorial-heading" id="difference-title">
          {copy.differenceTitle}
        </h2>
      </header>

      <div className="difference-map" data-home-reveal="panel">
        <article className="difference-passive">
          <span>{copy.passiveLabel}</span>
          <h3>{copy.passiveTitle}</h3>
        </article>

        <article className="difference-active">
          <span>{copy.activeLabel}</span>
          <h3>{copy.activeTitle}</h3>
          <div className="difference-field-flow">
            <span>{copy.buyer}</span>
            <span>{copy.supplier}</span>
            <span>{copy.competitor}</span>
            <span>{copy.skeptic}</span>
          </div>
        </article>
      </div>
    </section>
  );
}

export function HomeExperience() {
  const { locale } = useI18n();
  const copy = homeCopy[locale];
  useHomeRevealMotion();

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
            <h1
              aria-label={`${copy.heroLineOne} ${copy.heroLineTwo}`}
              id="hero-title"
            >
              <span className="hero-title-line hero-title-line-muted">
                <span>{copy.heroLineOne}</span>
              </span>
              <span className="hero-title-line hero-title-line-action">
                <span>
                  <span
                    className="hero-title-brand"
                    data-text={copy.heroBrand}
                  >
                    {copy.heroBrand}
                  </span>{" "}
                  {copy.heroAction}
                </span>
              </span>
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

        <div className="cinematic-method-intro" data-home-reveal="heading">
          <h2 className="editorial-heading" id="method-title">
            {copy.methodTitle}
          </h2>
        </div>

        <div className="method-stage-reveal" data-home-reveal="panel">
          <LandingRoleStage />
        </div>
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
        <div className="cinematic-field-copy" data-home-reveal="copy">
          <h2 className="editorial-heading" id="field-title">
            {copy.evidenceTitle}
          </h2>
          <p className="evidence-trace">{copy.evidenceTrace}</p>
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
        <div className="operating-backdrop" aria-hidden="true">
          <Image
            alt=""
            fill
            sizes="100vw"
            src="/lrwa-agent-field-map-bg.webp"
            unoptimized
          />
        </div>
        <div className="operating-heading" data-home-reveal="heading">
          <h2 className="editorial-heading" id="boundaries-title">
            {copy.boundaryTitle}
          </h2>
        </div>
        <div className="operating-boundaries" data-home-reveal="panel">
          <p>
            <span>01</span>
            {copy.boundaryOne}
          </p>
          <p>
            <span>02</span>
            {copy.boundaryTwo}
          </p>
          <p>
            <span>03</span>
            {copy.boundaryThree}
          </p>
        </div>
      </section>

      <section className="closing-invitation" data-home-reveal="heading">
        <h2 className="editorial-heading">{copy.closingTitle}</h2>
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
