"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Locked } from "@carbon/icons-react";
import { useI18n } from "@/components/locale-provider";
import { localizeScenario } from "@/lib/simulation-copy";
import exampleResult from "@/lib/simulation-example-result.json";
import scenario from "@/lib/simulation-scenario.json";

const reportSections = [
  { id: "summary", en: "Summary", zh: "摘要" },
  { id: "findings", en: "Findings", zh: "事实判断" },
  { id: "evidence", en: "Evidence", zh: "证据矩阵" },
  { id: "method", en: "Method", zh: "调查方法" },
  { id: "sources", en: "Sources", zh: "来源登记" },
  { id: "logic", en: "Logic", zh: "响应逻辑" },
  { id: "appendix", en: "Appendix", zh: "附录" },
] as const;

export function SimulationReport() {
  const { choose, locale } = useI18n();
  const localizedScenario = localizeScenario(locale);

  return (
    <div
      className="example-report"
      data-artifact-kind={exampleResult.artifactKind}
      data-generated-by-live-run={String(exampleResult.generatedByLiveRun)}
      data-ledger-write={String(exampleResult.ledgerWrite)}
      data-truth-bearing={String(exampleResult.truthBearing)}
    >
      <nav
        className="example-report-index"
        aria-label={choose("Illustrative report sections", "示例报告章节")}
      >
        <div>
          <span>REPORT / 01</span>
          <strong>{choose("Illustrative diligence report", "完整尽调报告样张")}</strong>
        </div>
        <div className="example-report-index-links">
          {reportSections.map((section) => (
            <a href={`#report-${section.id}`} key={section.id}>
              {choose(section.en, section.zh)}
            </a>
          ))}
        </div>
        <Link href="/investigations/simulation?start=gate">
          <ArrowLeft size={14} aria-hidden />
          {choose("Back to replay", "返回流程")}
        </Link>
      </nav>

      <article className="example-report-document">
        <section
          className="example-report-disclosure"
          aria-label={choose(
            "Illustrative report boundary",
            "示例报告边界说明",
          )}
        >
          <div>
            <span>{choose("ILLUSTRATIVE RESULT", "示例结果")}</span>
            <strong>{choose("PREBUILT DEMO", "预制演示")}</strong>
          </div>
          <p>
            {choose(
              "This complete report is a product specimen, not the output of a live investigation. No store, customer service channel, supplier, or external platform was contacted.",
              "这份完整报告是产品样张，不是实时调查产出的结果。系统没有联系门店、客服、供应商或任何外部平台。",
            )}
          </p>
          <small>
            {choose(
              "0 REAL EVIDENCE / REAL WORK TYPICALLY TAKES DAYS TO MONTHS",
              "0 条真实证据 / 真实调查通常需要数天至数月",
            )}
          </small>
        </section>

        <section className="example-report-cover" id="report-summary">
          <div className="example-report-cover-copy">
            <p>
              {choose(
                "EXECUTIVE FINDING / NOT OBSERVED",
                "执行摘要 / 未经真实观察",
              )}
            </p>
            <h1>
              {choose(
                "Store identity and bulk pickup feasibility.",
                "门店身份与批量自取可行性。",
              )}
            </h1>
            <blockquote>{localizedScenario.claim}</blockquote>
          </div>
          <dl className="example-report-cover-meta">
            <div>
              <dt>{choose("Report status", "报告状态")}</dt>
              <dd>{choose("Prebuilt example", "预制样张")}</dd>
            </div>
            <div>
              <dt>{choose("Real evidence", "真实证据")}</dt>
              <dd>0</dd>
            </div>
            <div>
              <dt>{choose("Real execution", "真实执行周期")}</dt>
              <dd>{choose("Days to months", "数天至数月")}</dd>
            </div>
            <div>
              <dt>{choose("Decision use", "决策用途")}</dt>
              <dd>{choose("Not permitted", "不可使用")}</dd>
            </div>
          </dl>
        </section>

        <section className="example-report-executive">
          <header>
            <span>01</span>
            <div>
              <p>{choose("ILLUSTRATIVE DETERMINATION", "示例判断")}</p>
              <h2>{choose("Conditionally executable.", "示例判断：有条件可执行。")}</h2>
            </div>
          </header>
          <div className="example-report-executive-grid">
            <p>
              {choose(
                "Candidate A and Candidate B are fictional labels that are not mapped to either named real store. Under this specimen's hypothetical inputs, Candidate A is the conditional first choice; Candidate B remains a fallback until its operating window and order capacity are verified.",
                "候选 A 与候选 B 是没有映射到任何一家真实门店的虚构标签。在这份样张的假设输入下，候选 A 是有条件首选；候选 B 在营业时段与接单能力完成核验前只作为备选。",
              )}
            </p>
            <ol>
              {exampleResult.actions.map((action) => (
                <li key={action.code}>
                  <span>{action.code}</span>
                  <div>
                    <strong>{choose(action.label.en, action.label.zh)}</strong>
                    <p>{choose(action.detail.en, action.detail.zh)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          className="example-report-assumptions"
          aria-labelledby="report-assumptions-title"
        >
          <header>
            <div>
              <p>{choose("HYPOTHETICAL INPUT REGISTER", "假设输入登记")}</p>
              <h2 id="report-assumptions-title">
                {choose("What the specimen assumes", "这份样张预设了什么")}
              </h2>
            </div>
            <span>
              {choose(
                "Model inputs only. Not evidence, replies, or observations.",
                "仅为模型输入，不是证据、回复或真实观察。",
              )}
            </span>
          </header>
          <div>
            {exampleResult.assumptions.map((assumption) => (
              <article key={assumption.id}>
                <span>{assumption.id}</span>
                <small>
                  {choose("HYPOTHETICAL / NOT EVIDENCE", "假设 / 非证据")}
                </small>
                <h3>{choose(assumption.label.en, assumption.label.zh)}</h3>
                <p>{choose(assumption.detail.en, assumption.detail.zh)}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="example-report-section" id="report-findings">
          <header>
            <div>
              <p>CLAIM RESOLUTION</p>
              <h2>{choose("Finding by fact gap", "逐项事实判断")}</h2>
            </div>
            <span>
              {choose(
                "Every statement below belongs to the specimen.",
                "以下判断全部属于虚构样张。",
              )}
            </span>
          </header>
          <div className="example-report-findings">
            {exampleResult.facts.map((fact) => (
              <article key={fact.id}>
                <header>
                  <span>{fact.id}</span>
                  <small>{choose(fact.status.en, fact.status.zh)}</small>
                </header>
                <h3>{choose(fact.label.en, fact.label.zh)}</h3>
                <p>{choose(fact.detail.en, fact.detail.zh)}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="example-report-section" id="report-evidence">
          <header>
            <div>
              <p>EVIDENCE MATRIX</p>
              <h2>{choose("What would make it real", "怎样才能形成真实结论")}</h2>
            </div>
            <span>
              {choose(
                "Required artifacts are listed, but none were collected.",
                "列出所需凭证，但没有任何凭证已经采集。",
              )}
            </span>
          </header>
          <div
            aria-label={choose(
              "Illustrative evidence requirements",
              "示例证据要求",
            )}
            className="example-report-table"
            role="table"
          >
            <div className="example-report-table-head" role="row">
              <span role="columnheader">{choose("Gap", "缺口")}</span>
              <span role="columnheader">{choose("Example answer", "示例回答")}</span>
              <span role="columnheader">{choose("Required receipt", "所需回执")}</span>
              <span role="columnheader">{choose("State", "状态")}</span>
            </div>
            {exampleResult.facts.map((fact) => {
              const requirement = exampleResult.evidenceRequirements.find(
                (item) => item.coverage.includes(fact.id),
              );
              return (
                <div className="example-report-table-row" role="row" key={fact.id}>
                  <span role="cell">{fact.id}</span>
                  <span role="cell">{choose(fact.status.en, fact.status.zh)}</span>
                  <span role="cell">
                    {requirement
                      ? choose(requirement.label.en, requirement.label.zh)
                      : choose("Primary receipt", "原始回执")}
                  </span>
                  <strong role="cell">{choose("Not collected", "未采集")}</strong>
                </div>
              );
            })}
          </div>
        </section>

        <section className="example-report-section" id="report-method">
          <header>
            <div>
              <p>INVESTIGATION DESIGN</p>
              <h2>{choose("How the claim would be tested", "这条主张会如何被验证")}</h2>
            </div>
            <span>
              {choose(
                `${scenario.personas.length} synthetic personas, 0 external sends.`,
                `${scenario.personas.length} 个合成人物，0 次真实发送。`,
              )}
            </span>
          </header>
          <ol className="example-report-method">
            {localizedScenario.phases.map((phase) => (
              <li key={phase.id}>
                <span>{phase.code}</span>
                <div>
                  <small>{phase.protocol}</small>
                  <strong>{phase.label}</strong>
                  <p>{phase.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="example-report-section" id="report-sources">
          <header>
            <div>
              <p>SOURCE REGISTER</p>
              <h2>{choose("Public clues, not findings", "公开线索，不是调查结论")}</h2>
            </div>
            <span>
              {choose(
                "Each source establishes an entry point only.",
                "每项来源只用于建立调查入口。",
              )}
            </span>
          </header>
          <div className="example-report-sources">
            {localizedScenario.sources.map((source) => (
              <article key={source.id}>
                <span>{source.id}</span>
                <div>
                  <h3>{source.label}</h3>
                  <p>
                    {choose(
                      `The built-in specimen records this page as a public lead: ${source.observedText}`,
                      `内置样张仅将该页面登记为公开线索：${source.observedText}`,
                    )}
                  </p>
                  <small>{source.boundary}</small>
                </div>
                <a href={source.url} rel="noreferrer" target="_blank">
                  {choose("Open source", "查看来源")}
                  <ArrowRight size={14} aria-hidden />
                </a>
              </article>
            ))}
          </div>
        </section>

        <section
          className="example-report-section example-report-logic"
          id="report-logic"
        >
          <header>
            <div>
              <p>RESPONSE LOGIC</p>
              <h2>{choose("Branches that determine the next probe", "决定下一问的响应分支")}</h2>
            </div>
            <span>
              {choose(
                "System hypotheses only. They are not customer service replies.",
                "仅为系统假设，不是客服真实回复。",
              )}
            </span>
          </header>
          <div>
            {localizedScenario.responseBranches.map((branch) => (
              <article key={branch.id}>
                <span>{branch.id}</span>
                <h3>{branch.label}</h3>
                <dl>
                  <div>
                    <dt>{choose("Condition", "触发条件")}</dt>
                    <dd>{branch.condition}</dd>
                  </div>
                  <div>
                    <dt>{choose("Next probe", "下一轮追问")}</dt>
                    <dd>{branch.nextProbe}</dd>
                  </div>
                  <div>
                    <dt>{choose("Unlock", "解锁条件")}</dt>
                    <dd>{branch.evidenceNeeded}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </section>

        <section
          className="example-report-section example-report-appendix"
          id="report-appendix"
        >
          <header>
            <div>
              <p>PERSONA APPENDIX</p>
              <h2>{choose("Inquiry coverage", "询问覆盖明细")}</h2>
            </div>
            <span>
              {choose(
                "Synthetic prompts shown for method review only.",
                "合成问句仅用于审核调查方法。",
              )}
            </span>
          </header>
          <div>
            {localizedScenario.personas.map((persona) => (
              <article key={persona.id}>
                <header>
                  <span>{persona.id}</span>
                  <small>
                    {choose(`WAVE ${persona.wave}`, `波次 ${persona.wave}`)}
                  </small>
                </header>
                <h3>{persona.cohort}</h3>
                <p>{persona.inquiryDraft}</p>
                <footer>
                  <span>{choose("VARIABLE", "变量")}</span>
                  <strong>{persona.variable}</strong>
                </footer>
              </article>
            ))}
          </div>
        </section>

        <section className="example-report-lock">
          <Locked size={26} aria-hidden />
          <div>
            <p>
              {choose(
                "REAL-WORLD FINDING / STILL LOCKED",
                "现实结论 / 仍未解锁",
              )}
            </p>
            <h2>
              {choose(
                "This report demonstrates form, not truth.",
                "这份报告演示的是产品形态，不是真实结论。",
              )}
            </h2>
            <span>
              {choose(
                "A real report requires authorized outreach, original replies, source identity, timestamps, conflict checks, and human review before publication.",
                "真实报告必须经过授权外联、取得原始回复、核验来源身份与时间戳、处理冲突，并在发布前完成人工复核。",
              )}
            </span>
          </div>
          <Link className="cinematic-primary" href="/investigations">
            {choose("Build a real investigation", "建立真实调查")}
            <ArrowRight size={18} aria-hidden />
          </Link>
        </section>
      </article>
    </div>
  );
}
