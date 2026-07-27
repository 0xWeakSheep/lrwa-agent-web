"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Locked } from "@carbon/icons-react";
import { useI18n } from "@/components/locale-provider";
import { localizeScenario } from "@/lib/simulation-copy";
import exampleResult from "@/lib/simulation-example-result.json";
import scenario from "@/lib/simulation-scenario.json";

const reportSections = [
  { id: "summary", en: "Verdict", zh: "先看结论" },
  { id: "analysis", en: "Why", zh: "为什么" },
  { id: "findings", en: "Issues", zh: "逐项问题" },
  { id: "evidence", en: "Proof needed", zh: "需要的证据" },
  { id: "method", en: "Process", zh: "怎么查" },
  { id: "sources", en: "Public clues", zh: "公开线索" },
  { id: "logic", en: "Replies", zh: "不同回复" },
  { id: "limits", en: "Real run", zh: "真实调查" },
  { id: "appendix", en: "Questions", zh: "询问明细" },
] as const;

const reportNarrative = {
  en: {
    verdictTitle:
      "Demo recommendation:\nJing An Kerry Centre Store first.\nHold the 1F Store.",
    verdictSummary:
      "Bottom line: this prebuilt demonstration recommends Jing An Kerry Centre Store. The sample assumes it is open during the target weekday morning and can prepare 20 drinks before 09:00 when the order is confirmed on the previous business day. It does not recommend Jing An Kerry Centre 1F Store because the sample has no confirmation of its morning hours or bulk-order capacity. Before using the recommended store, obtain one written reply that names the store, confirms all 20 drinks will be ready before 09:00, identifies the pickup point, and states the payment and invoice terms. If that reply is missing or different channels disagree, do not place the order; split it or use another verified store. This is a demonstration only. No store was contacted, so the recommendation shows how a completed report should communicate a decision and does not describe either store’s real situation.",
    decisionTitle: "Why the demonstration chooses Jing An Kerry Centre Store",
    decisionBody:
      "The sample gives Jing An Kerry Centre Store two advantages: confirmed weekday-morning coverage and the ability to prepare 20 drinks before 09:00 after prior-business-day confirmation. Jing An Kerry Centre 1F Store has neither confirmation in the demonstration, so it is not the recommended route.",
    memoTitle: "Why we would not place the order yet",
    memoBoundary:
      "This section explains the sample decision in plain language. It does not assess either real store.",
    memoParagraphs: [
      "The order is workable only if four answers point to the same store: which store will accept it, whether that store can hand over the order before 09:00 on the target weekday, whether it can complete all 20 drinks, and whether its payment, invoice, substitution, and pickup rules fit the purchase. A directory page may provide a phone number or opening time, but it does not answer those questions.",
      "The demonstration assigns the favorable assumptions to Jing An Kerry Centre Store: it covers the required time and volume. Jing An Kerry Centre 1F Store remains unconfirmed. No real reply supports either assumption.",
      "The practical next step is simple: obtain one written reply that repeats the exact store, quantity, completion time, pickup point, payment method, and invoice terms. If any part is missing, or two channels give different answers, do not place the order.",
    ],
    findingNotes: [
      {
        id: "F-01",
        title: "First confirm which store is actually answering.",
        body: "The two public names may describe separate stores, two counters run by one store, a renamed location, or a duplicate listing. Similar addresses and phone numbers are clues, not proof. A usable reply must identify the exact store.",
      },
      {
        id: "F-02",
        title: "Being open does not mean the order will be ready by 09:00.",
        body: "Published hours say when a location opens. They do not say when a 20-drink order can be accepted, prepared, and handed over. The store must confirm the actual date and pickup time.",
      },
      {
        id: "F-03",
        title: "“We accept large orders” does not confirm these 20 drinks.",
        body: "Capacity changes with the drink mix, customizations, packaging, queues, equipment, and notice time. The reply needs to repeat both the quantity and the ready time for this order.",
      },
      {
        id: "F-04",
        title: "A producible order can still fail at payment or invoicing.",
        body: "Payment, invoicing, stockouts, substitutions, cancellation, and pickup responsibility can stop the purchase even when the drinks can be prepared. Those terms must be confirmed with the order.",
      },
    ],
    limitsTitle: "What could change the answer, and how to check it",
    limitsBoundary:
      "These are the open possibilities and the steps required for a real answer.",
    alternativesTitle: "What may still be different in reality",
    alternatives: [
      "The two names may refer to one store shown on different pages or floors.",
      "A listing may still exist even though the service point, hours, or contact route has changed.",
      "A store may be open but unable to make this order on the requested date.",
      "One contact may confirm capacity but be unable to confirm payment, invoicing, or pickup responsibility.",
    ],
    planTitle: "How we would check this for real",
    planIntro:
      "A real investigation may take days or months, depending on response time, permissions, conflicts, geography, and sample size. These are the required steps, not a promised timeline.",
    plan: [
      {
        code: "R-01",
        title: "Save the current public pages.",
        body: "Record the URLs, store names, contact details, retrieval time, and any conflicting listings so the starting point can be checked later.",
      },
      {
        code: "R-02",
        title: "Ask whether the two names are the same store.",
        body: "Use an authorized channel and save the original reply, source, time, and store identifier. If the answer is generic, ask again instead of guessing.",
      },
      {
        code: "R-03",
        title: "Ask the full order in one message.",
        body: "Include the date, 20-drink quantity, ready time, drink mix, pickup method, payment, and invoice need. The reply must identify the store accepting those terms.",
      },
      {
        code: "R-04",
        title: "Follow up on conflicts and exceptions.",
        body: "Compare replies and ask about substitutions, stockouts, split orders, cancellation, and late pickup. Keep conflicting answers visible.",
      },
      {
        code: "R-05",
        title: "Have a person approve the final answer.",
        body: "Before release, a reviewer checks that the replies are current, traceable, authorized, and consistent with the exact order.",
      },
    ],
  },
  zh: {
    verdictTitle:
      "演示建议：\n静安嘉里中心店优先。\n1F 店暂不选择。",
    verdictSummary:
      "结论先说：这份预制演示建议优先选择“静安嘉里中心店”。样例假设它在目标工作日上午营业，并且只要前一工作日确认，就能在上午 9 点前备妥 20 杯。“静安嘉里中心 1F 店”暂不选择，因为样例里没有确认它的上午营业时段，也没有确认它能否承接 20 杯批量订单。即便选择前者，下单前仍要取得一份书面回复，把具体门店、20 杯数量、上午 9 点前备妥、取货位置、付款方式和发票条件一次写清楚；拿不到回复或不同渠道说法冲突，就不要下单，改为拆单或选择其他已经核验的门店。这是预制演示，系统没有联系任何门店；这段结论只是为了展示完整报告应该怎样把建议说清楚，不代表两家门店的真实情况。",
    decisionTitle: "为什么演示里选择“静安嘉里中心店”",
    decisionBody:
      "样例给“静安嘉里中心店”设置了两个明确优势：工作日上午时段已经覆盖，而且只要在前一工作日确认，就能在上午 9 点前完成 20 杯。“静安嘉里中心 1F 店”在演示中没有这两项确认，所以不作为推荐门店。",
    memoTitle: "为什么现在还不能下单",
    memoBoundary:
      "以下只解释样例判断，不评价页面中的真实门店。",
    memoParagraphs: [
      "这笔订单只有在四件事都指向同一家门店时才算可行：到底由哪家门店接单；目标工作日上午 9 点前能不能取到；20 杯能不能全部按时完成；付款、开票、缺货替换和取货规则是否符合要求。公开页面最多提供电话、地址或营业时间，不能直接回答这些问题。",
      "演示样例把有利条件明确放在“静安嘉里中心店”上：它能覆盖所需时间和数量；“静安嘉里中心 1F 店”的情况仍未确认。当前没有任何真实回复支持这些设定。",
      "下一步很简单：取得一份书面回复，让对方把具体门店、20 杯数量、完成时间、取货位置、付款方式和开票条件写清楚。只要其中一项缺失，或者不同渠道说法冲突，就不要下单。",
    ],
    findingNotes: [
      {
        id: "F-01",
        title: "先确认到底是哪一家门店在回复。",
        body: "两个公开名称可能是两家门店，也可能只是同一家店的两个服务点、门店更名或重复条目。地址和电话相似只能算线索。真正可用的回复必须明确写出门店身份。",
      },
      {
        id: "F-02",
        title: "开门不等于能在上午 9 点前交付。",
        body: "页面营业时间只说明什么时候开门，不说明 20 杯订单什么时候能接、能做完、能交付。门店必须针对具体日期和取货时间作出确认。",
      },
      {
        id: "F-03",
        title: "“可以接大单”不代表能完成这 20 杯。",
        body: "能不能完成取决于饮品组合、定制、包装、排队、设备和提前确认时间。回复需要明确重复这次订单的数量和完成时间。",
      },
      {
        id: "F-04",
        title: "能做出来，也可能因为付款或开票无法成交。",
        body: "付款、开票、缺货、替换、取消和取货责任，都可能让一笔能做出来的订单无法执行。这些条件需要和订单一起确认。",
      },
    ],
    limitsTitle: "哪些情况会改变答案，以及怎样查清楚",
    limitsBoundary:
      "下面列出仍未排除的情况，以及得到真实答案所需的步骤。",
    alternativesTitle: "现实情况可能与样例不同",
    alternatives: [
      "两个名称可能只是同一家门店在不同页面或楼层中的展示。",
      "目录条目可能还在，但服务点、营业时间或联系方式已经变化。",
      "门店可能正常营业，却无法在目标日期完成这笔订单。",
      "某个联系人可能能确认产能，却不能确认付款、开票或取货责任。",
    ],
    planTitle: "真正执行时，我们会这样查",
    planIntro:
      "真实调查可能持续数天至数月，取决于回复速度、授权、冲突、地理范围和样本量。下面是必须完成的步骤，不是时间承诺。",
    plan: [
      {
        code: "R-01",
        title: "保存当前公开页面。",
        body: "记录 URL、门店名称、联系方式、抓取时间和相互冲突的条目，方便之后复查。",
      },
      {
        code: "R-02",
        title: "问清楚两个名称是不是同一家店。",
        body: "通过授权渠道询问，保存原始回复、来源、时间和门店标识。遇到模板回答就继续追问，不自行猜测。",
      },
      {
        code: "R-03",
        title: "把完整订单一次问清楚。",
        body: "一次写清日期、20 杯数量、完成时间、饮品组合、取货方式、付款和开票需求，并要求对方明确由哪家门店接单。",
      },
      {
        code: "R-04",
        title: "继续追问冲突和例外情况。",
        body: "对比不同回复，并问清替换、缺货、拆单、取消和迟到取货。相互矛盾的说法不能被隐藏。",
      },
      {
        code: "R-05",
        title: "由人工确认最终结论。",
        body: "发布前检查回复是否最新、能否追溯、来源是否有权确认，以及内容是否覆盖这笔具体订单。",
      },
    ],
  },
} as const;

export function SimulationReport() {
  const { choose, locale } = useI18n();
  const localizedScenario = localizeScenario(locale);
  const narrative = reportNarrative[locale];

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
                "BOTTOM LINE / DEMONSTRATION ONLY",
                "结论先说 / 仅为演示",
              )}
            </p>
            <h1>{narrative.verdictTitle}</h1>
            <div className="example-report-cover-summary">
              <p>{narrative.verdictSummary}</p>
            </div>
            <div className="example-report-cover-question">
              <span>{choose("QUESTION REVIEWED", "本报告回答的问题")}</span>
              <blockquote>{localizedScenario.claim}</blockquote>
            </div>
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
              <p>{choose("WHAT THIS MEANS", "这句话具体是什么意思")}</p>
              <h2>{narrative.decisionTitle}</h2>
            </div>
          </header>
          <div className="example-report-executive-grid">
            <p>{narrative.decisionBody}</p>
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
                {choose(
                  "What the demonstration invented",
                  "这些信息是演示预设，不是调查所得",
                )}
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

        <section
          className="example-report-section example-report-narrative"
          id="report-analysis"
        >
          <header>
            <div>
              <p>{choose("DECISION EXPLAINED", "把判断说清楚")}</p>
              <h2>{narrative.memoTitle}</h2>
            </div>
            <span>{narrative.memoBoundary}</span>
          </header>

          <div className="example-report-prose">
            {narrative.memoParagraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className="example-report-deep-notes">
            {narrative.findingNotes.map((note) => (
              <article key={note.id}>
                <span>{note.id}</span>
                <div>
                  <h3>{note.title}</h3>
                  <p>{note.body}</p>
                </div>
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
          className="example-report-section example-report-limits"
          id="report-limits"
        >
          <header>
            <div>
              <p>LIMITATIONS / ALTERNATIVES / EXECUTION</p>
              <h2>{narrative.limitsTitle}</h2>
            </div>
            <span>{narrative.limitsBoundary}</span>
          </header>

          <div className="example-report-limits-grid">
            <article className="example-report-alternatives">
              <span>OPEN QUESTIONS</span>
              <h3>{narrative.alternativesTitle}</h3>
              <ol>
                {narrative.alternatives.map((alternative, index) => (
                  <li key={index}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <p>{alternative}</p>
                  </li>
                ))}
              </ol>
            </article>

            <article className="example-report-real-plan">
              <span>AUTHORIZED REAL-WORLD WORK</span>
              <h3>{narrative.planTitle}</h3>
              <p>{narrative.planIntro}</p>
              <ol>
                {narrative.plan.map((step) => (
                  <li key={step.code}>
                    <span>{step.code}</span>
                    <div>
                      <strong>{step.title}</strong>
                      <p>{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </article>
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
