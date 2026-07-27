import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

let renderSequence = 0;

async function render(pathname = "/", options = {}) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set(
    "test",
    `${process.pid}-${Date.now()}-${renderSequence++}-${pathname}-${options.locale ?? "default"}`,
  );
  const { default: worker } = await import(workerUrl.href);
  const headers = new Headers({ accept: "text/html" });
  const cookie =
    options.cookie ??
    (options.locale ? `lrwa-locale=${options.locale}` : undefined);
  if (cookie) {
    headers.set("cookie", cookie);
  }

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers,
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

async function renderedHtml(pathname, options) {
  const response = await render(pathname, options);
  assert.equal(response.status, 200, `${pathname} should return 200`);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  return response.text();
}

test("server-renders the English field evidence landing page by default", async () => {
  const html = await renderedHtml("/");

  assert.match(html, /<html lang="en">/i);
  assert.match(html, /<title>Field Evidence Operations \| LRWA<\/title>/i);
  assert.match(html, /Most agents analyze\./);
  assert.match(html, /LRWA investigates\./);
  assert.match(html, /MULTI-STAGE AGENT FIELDWORK/);
  assert.match(
    html,
    /customer, supplier, and competitor roles to find evidence public data cannot/,
  );
  assert.match(html, /Run the field simulation/);
  assert.match(html, /Not another report agent\./);
  assert.match(html, /No receipt\. No conclusion\./);
  assert.match(html, /METHOD PREVIEW \/ NOT EXECUTED/);
  assert.match(html, /0 NETWORK ACTIONS/);
  assert.match(html, /lrwa-fieldwork-hero\.webp/);
  assert.match(html, /lrwa-analysis-fieldwork-bg\.webp/);
  assert.match(html, /lrwa-role-orchestration-bg\.webp/);
  assert.match(html, /lrwa-evidence-table\.webp/);
  assert.match(html, /fieldwork-launch/);
  assert.match(html, /difference-field-flow/);
  assert.match(html, /brand-symbol/);
  assert.match(html, /Switch interface language to Chinese/);
  assert.doesNotMatch(html, /1,024|¥3\.33m|¥1\.92m|0\.88/);
  assert.doesNotMatch(html, /Mission complete|Morrow Coffee/);
});

test("server-renders Chinese when the locale cookie explicitly requests it", async () => {
  const html = await renderedHtml("/", { locale: "zh" });

  assert.match(html, /<html lang="zh-CN">/i);
  assert.match(html, /<title>主动证据调查 \| LRWA<\/title>/i);
  assert.match(html, /大多数 AI 只分析/);
  assert.match(html, /LRWA 会去调查/);
  assert.match(html, /扮演真实客户、供应商与竞品调研者，展开多轮交互/);
  assert.match(html, /运行调查模拟/);
  assert.match(html, /它不是另一个研报 Agent/);
  assert.match(html, /没有回执，就没有结论/);
  assert.match(html, /方法预览 \/ 尚未执行/);
  assert.match(html, /0 次真实外联/);
  assert.match(html, /将界面语言切换为英文/);
});

test("keeps the locale cookie strict and defaults invalid values to English", async () => {
  const html = await renderedHtml("/", {
    cookie: "lrwa-locale=fr",
  });

  assert.match(html, /<html lang="en">/i);
  assert.match(html, /<title>Field Evidence Operations \| LRWA<\/title>/i);
  assert.match(html, /Switch interface language to Chinese/);
});

test("keeps the new fieldwork image and launch animation accessible", async () => {
  await access(new URL("../public/lrwa-fieldwork-hero.webp", import.meta.url));
  await access(
    new URL("../public/lrwa-analysis-fieldwork-bg.webp", import.meta.url),
  );
  await access(
    new URL("../public/lrwa-role-orchestration-bg.webp", import.meta.url),
  );
  await access(new URL("../public/lrwa-evidence-table.webp", import.meta.url));

  const [homeSource, roleStageSource, styles, layoutSource] = await Promise.all([
    readFile(
      new URL("../components/home-experience.tsx", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL("../components/landing-role-stage.tsx", import.meta.url),
      "utf8",
    ),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(homeSource, /FieldworkLaunchSequence/);
  assert.match(homeSource, /\/lrwa-fieldwork-hero\.webp/);
  assert.match(homeSource, /\/lrwa-analysis-fieldwork-bg\.webp/);
  assert.match(homeSource, /\/lrwa-role-orchestration-bg\.webp/);
  assert.match(
    homeSource,
    /section-backdrop section-backdrop-difference[\s\S]*?aria-hidden="true"/,
  );
  assert.match(
    homeSource,
    /section-backdrop section-backdrop-method[\s\S]*?aria-hidden="true"/,
  );
  assert.match(homeSource, /fieldwork-launch-panel panel-one/);
  assert.match(homeSource, /fieldwork-launch-manifest/);
  assert.match(homeSource, /IntersectionObserver/);
  assert.match(homeSource, /data-home-reveal/);
  assert.match(homeSource, /0 NETWORK ACTIONS/);
  assert.doesNotMatch(homeSource, /<(?:Checkmark|Locked)\b/);
  assert.doesNotMatch(roleStageSource, /from "@carbon\/icons-react"/);
  assert.doesNotMatch(homeSource, /fieldwork-visual-status/);
  assert.match(layoutSource, /Barlow_Condensed/);
  assert.match(layoutSource, /--font-editorial/);
  assert.match(styles, /@keyframes fieldwork-launch-dismiss/);
  assert.match(styles, /@keyframes fieldwork-route-draw/);
  assert.match(styles, /@keyframes home-title-enter/);
  assert.match(styles, /@keyframes role-panel-ink-in/);
  assert.doesNotMatch(styles, /editorial-heading::after/);
  assert.doesNotMatch(styles, /hero-title-brand::after/);
  assert.match(styles, /\.section-backdrop-difference img/);
  assert.match(styles, /\.section-backdrop-method img/);
  assert.match(
    styles,
    /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.fieldwork-launch[\s\S]*?display: none/,
  );
});

test("server-renders every honest-state workflow route", async () => {
  const routes = [
    [
      "/investigations",
      /Define what must be true first\./,
      /先定义什么必须是真的。/,
    ],
    [
      "/investigations/workbench",
      /Give every role a bounded path to investigate\./,
      /让每个角色完成一次有边界的深挖。/,
    ],
    [
      "/investigations/evidence",
      /Evidence before conclusions\./,
      /证据先于结论。/,
    ],
    [
      "/investigations/next",
      /Turn every gap into a next action\./,
      /让每个缺口变成下一步动作。/,
    ],
  ];

  for (const [pathname, englishTitle, chineseTitle] of routes) {
    const englishHtml = await renderedHtml(pathname);
    assert.match(englishHtml, /<html lang="en">/i);
    assert.match(englishHtml, englishTitle);
    assert.match(
      englishHtml,
      /A strategy draft does not mean anything was sent/,
    );
    assert.doesNotMatch(
      englishHtml,
      /Synthetic demo data|fictional company|Mission complete|1,024/,
    );

    const chineseHtml = await renderedHtml(pathname, { locale: "zh" });
    assert.match(chineseHtml, /<html lang="zh-CN">/i);
    assert.match(chineseHtml, chineseTitle);
    assert.match(chineseHtml, /策略草案不代表已经发送/);
    assert.doesNotMatch(
      chineseHtml,
      /Synthetic demo data|fictional company|Mission complete|1,024/,
    );
  }

  const retiredRoute = await render("/cases/morrow-coffee");
  assert.equal(retiredRoute.status, 404);
});

test("server-renders the bilingual sandbox with explicit zero-action state", async () => {
  const englishHtml = await renderedHtml("/investigations/simulation");

  assert.match(englishHtml, /<html lang="en">/i);
  assert.match(englishHtml, /<title>Simulation lab \| LRWA<\/title>/i);
  assert.match(
    englishHtml,
    /Starbucks stores associated with Shanghai Jing(?:&#x27;|')an Kerry Centre/,
  );
  assert.match(englishHtml, /Sandbox simulation/);
  assert.match(englishHtml, /nothing sent/);
  assert.match(englishHtml, /Play full walkthrough/);
  assert.match(englishHtml, /Conclusion locked/);

  const chineseHtml = await renderedHtml("/investigations/simulation", {
    locale: "zh",
  });
  assert.match(chineseHtml, /<html lang="zh-CN">/i);
  assert.match(chineseHtml, /<title>模拟实验 \| LRWA<\/title>/i);
  assert.match(chineseHtml, /星巴克上海静安嘉里中心相关门店/);
  assert.match(chineseHtml, /沙盒模拟/);
  assert.match(chineseHtml, /未真实发送/);
  assert.match(chineseHtml, /播放全过程/);
  assert.match(chineseHtml, /结论锁定/);

  for (const html of [englishHtml, chineseHtml]) {
    assert.match(html, /aria-live="polite"/);
    assert.match(html, /data-environment="sandbox"/);
    assert.match(html, /data-real-sends="0"/);
    assert.match(html, /data-real-replies="0"/);
    assert.match(html, /data-real-receipts="0"/);
    assert.doesNotMatch(html, /data-real-(?:sends|replies|receipts)="[1-9]/);
  }
});

test("renders a complete prefabricated result without unlocking the real finding", async () => {
  const englishHtml = await renderedHtml(
    "/investigations/simulation?start=gate",
  );

  assert.match(englishHtml, /ILLUSTRATIVE RESULT/);
  assert.match(englishHtml, /PREBUILT DEMO/);
  assert.match(englishHtml, /Days to months/);
  assert.match(englishHtml, /The real finding has not been produced/);
  assert.match(englishHtml, /Recommend Jing An Kerry Centre Store\./);
  assert.match(
    englishHtml,
    /The 1F Store is not recommended because its morning hours and bulk-order capacity remain unconfirmed/,
  );
  assert.match(englishHtml, /No store was contacted/);
  assert.match(englishHtml, /Open the complete report/);
  assert.match(englishHtml, /Open report/);
  assert.match(englishHtml, /href="\/investigations\/simulation\/report"/);
  assert.match(englishHtml, /data-artifact-kind="illustrative_result"/);
  assert.match(englishHtml, /data-generated-by-live-run="false"/);
  assert.match(englishHtml, /data-ledger-write="false"/);
  assert.match(englishHtml, /data-truth-bearing="false"/);

  const chineseHtml = await renderedHtml(
    "/investigations/simulation?start=gate",
    { locale: "zh" },
  );

  assert.match(chineseHtml, /预制演示/);
  assert.match(chineseHtml, /数天至数月/);
  assert.match(chineseHtml, /真实结论尚未产生/);
  assert.match(chineseHtml, /演示建议：选择“静安嘉里中心店”。/);
  assert.match(
    chineseHtml,
    /“静安嘉里中心 1F 店”的上午营业时段和批量接单能力尚未确认，因此暂不选择/,
  );
  assert.match(chineseHtml, /系统没有联系任何门店/);
  assert.match(chineseHtml, /打开完整报告/);
  assert.match(chineseHtml, /查看报告/);

  for (const html of [englishHtml, chineseHtml]) {
    assert.match(html, /data-real-sends="0"/);
    assert.match(html, /data-real-replies="0"/);
    assert.match(html, /data-real-receipts="0"/);
    assert.doesNotMatch(html, /data-real-(?:sends|replies|receipts)="[1-9]/);
  }

  const exampleResult = JSON.parse(
    await readFile(
      new URL("../lib/simulation-example-result.json", import.meta.url),
      "utf8",
    ),
  );
  assert.equal(exampleResult.artifactKind, "illustrative_result");
  assert.equal(exampleResult.truthBearing, false);
  assert.equal(exampleResult.generatedByLiveRun, false);
  assert.equal(exampleResult.ledgerWrite, false);
  assert.equal(exampleResult.assumptions.length, 4);
  assert.equal(exampleResult.facts.length, 4);
});

test("renders the complete illustrative report as its own truth-labelled page", async () => {
  const englishHtml = await renderedHtml(
    "/investigations/simulation/report",
  );

  assert.match(
    englishHtml,
    /<title>Illustrative investigation report \| LRWA<\/title>/i,
  );
  assert.match(englishHtml, /Complete illustrative report\./);
  assert.match(englishHtml, /Illustrative diligence report/);
  assert.match(englishHtml, /Jing An Kerry Centre Store first\./);
  assert.match(englishHtml, /Hold the 1F Store\./);
  assert.match(
    englishHtml,
    /this prebuilt demonstration recommends Jing An Kerry Centre Store/,
  );
  assert.match(
    englishHtml,
    /It does not recommend Jing An Kerry Centre 1F Store because the sample has no confirmation of its morning hours or bulk-order capacity/,
  );
  assert.match(
    englishHtml,
    /obtain one written reply that names the store, confirms all 20 drinks will be ready before 09:00, identifies the pickup point, and states the payment and invoice terms/,
  );
  assert.match(
    englishHtml,
    /This is a demonstration only\. No store was contacted/,
  );
  assert.match(
    englishHtml,
    /the recommendation shows how a completed report should communicate a decision/,
  );
  assert.match(
    englishHtml,
    /Why the demonstration chooses Jing An Kerry Centre Store/,
  );
  assert.match(englishHtml, /Why we would not place the order yet/);
  assert.match(englishHtml, /href="#report-analysis"/);
  assert.match(englishHtml, /CLAIM RESOLUTION/);
  assert.match(englishHtml, /EVIDENCE MATRIX/);
  assert.match(englishHtml, /INVESTIGATION DESIGN/);
  assert.match(englishHtml, /SOURCE REGISTER/);
  assert.match(englishHtml, /RESPONSE LOGIC/);
  assert.match(englishHtml, /href="#report-logic"/);
  assert.match(englishHtml, /LIMITATIONS \/ ALTERNATIVES \/ EXECUTION/);
  assert.match(englishHtml, /href="#report-limits"/);
  assert.match(englishHtml, /What may still be different in reality/);
  assert.match(englishHtml, /How we would check this for real/);
  assert.match(englishHtml, /R-05/);
  assert.match(englishHtml, /Have a person approve the final answer/);
  assert.match(englishHtml, /HYPOTHETICAL INPUT REGISTER/);
  assert.match(englishHtml, /Demonstration mapping/);
  assert.match(
    englishHtml,
    /Jing An Kerry Centre Store is the recommended route and Jing An Kerry Centre 1F Store is the unconfirmed alternative/,
  );
  assert.doesNotMatch(englishHtml, /Candidate labels|Candidate A|Candidate B/);
  assert.match(
    englishHtml,
    /Model inputs only\. Not evidence, replies, or observations/,
  );
  assert.match(englishHtml, /PERSONA APPENDIX/);
  assert.match(englishHtml, /P-12/);
  assert.match(englishHtml, /Not collected/);
  assert.match(englishHtml, /0 REAL EVIDENCE/);
  assert.match(englishHtml, /data-generated-by-live-run="false"/);
  assert.match(englishHtml, /data-ledger-write="false"/);
  assert.match(englishHtml, /data-truth-bearing="false"/);

  const chineseHtml = await renderedHtml(
    "/investigations/simulation/report",
    { locale: "zh" },
  );

  assert.match(chineseHtml, /<title>完整调查报告样张 \| LRWA<\/title>/i);
  assert.match(chineseHtml, /完整调查报告样张/);
  assert.match(chineseHtml, /静安嘉里中心店优先。/);
  assert.match(chineseHtml, /1F 店暂不选择。/);
  assert.match(
    chineseHtml,
    /这份预制演示建议优先选择“静安嘉里中心店”/,
  );
  assert.match(
    chineseHtml,
    /“静安嘉里中心 1F 店”暂不选择，因为样例里没有确认它的上午营业时段，也没有确认它能否承接 20 杯批量订单/,
  );
  assert.match(
    chineseHtml,
    /下单前仍要取得一份书面回复，把具体门店、20 杯数量、上午 9 点前备妥、取货位置、付款方式和发票条件一次写清楚/,
  );
  assert.match(chineseHtml, /这是预制演示，系统没有联系任何门店/);
  assert.match(chineseHtml, /不代表两家门店的真实情况/);
  assert.match(chineseHtml, /为什么演示里选择“静安嘉里中心店”/);
  assert.match(chineseHtml, /为什么现在还不能下单/);
  assert.match(chineseHtml, /href="#report-analysis"/);
  assert.match(chineseHtml, /逐项事实判断/);
  assert.match(chineseHtml, /证据矩阵/);
  assert.match(chineseHtml, /调查方法/);
  assert.match(chineseHtml, /来源登记/);
  assert.match(chineseHtml, /响应逻辑/);
  assert.match(chineseHtml, /哪些情况会改变答案，以及怎样查清楚/);
  assert.match(chineseHtml, /href="#report-limits"/);
  assert.match(chineseHtml, /现实情况可能与样例不同/);
  assert.match(chineseHtml, /真正执行时，我们会这样查/);
  assert.match(chineseHtml, /R-05/);
  assert.match(chineseHtml, /由人工确认最终结论/);
  assert.match(chineseHtml, /假设输入登记/);
  assert.match(
    chineseHtml,
    /“静安嘉里中心店”是推荐门店，“静安嘉里中心 1F 店”是尚未确认的备选/,
  );
  assert.doesNotMatch(chineseHtml, /候选标签|候选 A|候选 B/);
  assert.match(chineseHtml, /询问覆盖明细/);
  assert.match(chineseHtml, /0 条真实证据/);
  assert.match(chineseHtml, /未采集/);
  assert.match(chineseHtml, /这份报告演示的是产品形态，不是真实结论/);
});

test("puts the bilingual built-in example directly inside the normal first step", async () => {
  const englishHtml = await renderedHtml("/investigations/example");

  assert.match(englishHtml, /<html lang="en">/i);
  assert.match(
    englishHtml,
    /<title>Built-in investigation example \| LRWA<\/title>/i,
  );
  assert.match(englishHtml, /The example is ready\. Continue when you are\./);
  assert.match(
    englishHtml,
    /Starbucks stores at Shanghai Jing An Kerry Centre/,
  );
  assert.match(englishHtml, /Verify whether/);
  assert.match(
    englishHtml,
    /This run reads the built-in frontend example only/,
  );
  assert.match(englishHtml, /Next: open the claim map/);
  assert.match(
    englishHtml,
    /Continuing does not call DeepSeek, customer support, a store, or any external interface/,
  );

  const chineseHtml = await renderedHtml("/investigations/example", {
    locale: "zh",
  });
  assert.match(chineseHtml, /<html lang="zh-CN">/i);
  assert.match(chineseHtml, /<title>内置调查示例 \| LRWA<\/title>/i);
  assert.match(chineseHtml, /示例已经放好，直接点下一步/);
  assert.match(chineseHtml, /星巴克上海静安嘉里中心相关门店/);
  assert.match(chineseHtml, /待验证命题，不是既定事实/);
  assert.match(chineseHtml, /本次只读取内置前端示例/);
  assert.match(chineseHtml, /下一步：进入命题拆解/);
  assert.match(chineseHtml, /不会调用 DeepSeek、客服、门店或任何外部接口/);
});

test("keeps every sandbox artifact synthetic and off the network", async () => {
  const scenario = JSON.parse(
    await readFile(
      new URL("../lib/simulation-scenario.json", import.meta.url),
      "utf8",
    ),
  );

  assert.equal(scenario.metrics.simulatedPersonas, scenario.personas.length);
  assert.equal(
    scenario.metrics.simulatedDrafts,
    scenario.personas.filter((persona) => persona.inquiryDraft).length,
  );
  assert.equal(scenario.metrics.realSends, 0);
  assert.equal(scenario.metrics.realReplies, 0);
  assert.equal(scenario.metrics.realReceipts, 0);
  assert.equal(scenario.metrics.conclusionGate, "locked");
  assert.ok(scenario.personas.length >= 12);
  assert.match(scenario.claim, /待验证命题，不是既定事实/);

  const allIds = [
    ...scenario.sources,
    ...scenario.facts,
    ...scenario.phases,
    ...scenario.personas,
    ...scenario.responseBranches,
  ].map((item) => item.id);
  assert.equal(new Set(allIds).size, allIds.length);

  for (const source of scenario.sources) {
    assert.equal(source.sourceKind, "public_reference");
  }
  for (const persona of scenario.personas) {
    assert.equal(persona.synthetic, true);
    assert.equal(persona.networkAction, false);
    assert.equal(persona.deliveryStatus, "not_sent");
  }
  for (const branch of scenario.responseBranches) {
    assert.equal(branch.synthetic, true);
    assert.equal(branch.networkAction, false);
  }
});

test("keeps locale selection strict, SSR-readable, and browser-persistent", async () => {
  const [i18nSource, serverSource, providerSource, toggleSource] =
    await Promise.all([
      readFile(new URL("../lib/i18n.ts", import.meta.url), "utf8"),
      readFile(new URL("../lib/i18n-server.ts", import.meta.url), "utf8"),
      readFile(
        new URL("../components/locale-provider.tsx", import.meta.url),
        "utf8",
      ),
      readFile(
        new URL("../components/language-toggle.tsx", import.meta.url),
        "utf8",
      ),
    ]);

  assert.match(i18nSource, /SUPPORTED_LOCALES = \["en", "zh"\] as const/);
  assert.match(i18nSource, /DEFAULT_LOCALE: Locale = "en"/);
  assert.match(i18nSource, /LOCALE_COOKIE_NAME = "lrwa-locale"/);
  assert.match(
    i18nSource,
    /return isLocale\(value\) \? value : DEFAULT_LOCALE/,
  );
  assert.match(serverSource, /cookies\(\)/);
  assert.match(serverSource, /normalizeLocale/);
  assert.match(providerSource, /document\.cookie =/);
  assert.match(providerSource, /document\.documentElement\.lang/);
  assert.match(providerSource, /router\.refresh\(\)/);
  assert.match(providerSource, /export function useI18n/);
  assert.match(toggleSource, /setLocale\(nextLocale\)/);
  assert.match(toggleSource, /aria-pressed=\{locale === "zh"\}/);
});

test("keeps the simulation isolated from contact and evidence writes", async () => {
  const [
    source,
    agentFieldSource,
    localizedCopySource,
    exampleResultSource,
    styles,
  ] =
    await Promise.all([
      readFile(
        new URL("../components/simulation-lab.tsx", import.meta.url),
        "utf8",
      ),
      readFile(
        new URL("../components/agent-mission-control.tsx", import.meta.url),
        "utf8",
      ),
      readFile(new URL("../lib/simulation-copy.ts", import.meta.url), "utf8"),
      readFile(
        new URL("../lib/simulation-example-result.json", import.meta.url),
        "utf8",
      ),
      readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    ]);
  await access(
    new URL("../public/lrwa-agent-field-map-bg.webp", import.meta.url),
  );
  const investigationSource = await readFile(
    new URL("../lib/investigation.ts", import.meta.url),
    "utf8",
  );
  const briefSource = await readFile(
    new URL("../components/investigation-brief.tsx", import.meta.url),
    "utf8",
  );
  const simulationPageSource = await readFile(
    new URL("../app/investigations/simulation/page.tsx", import.meta.url),
    "utf8",
  );

  assert.doesNotMatch(
    `${source}\n${agentFieldSource}\n${localizedCopySource}\n${exampleResultSource}`,
    /addServerEvidence|confirmServerContact|createServerInvestigation|hashEvidencePayload|fetch\(|WebSocket|sendBeacon/,
  );
  assert.match(source, /aria-pressed=\{isPlaying\}/);
  assert.match(source, /aria-current=\{index === activePhaseIndex/);
  assert.match(source, /type="button"/);
  assert.match(source, /hasMoreInquiries/);
  assert.match(source, /AgentMissionControl/);
  assert.match(agentFieldSource, /data-network-actions="0"/);
  assert.match(agentFieldSource, /localizedScenario\.personas\.map/);
  assert.match(agentFieldSource, /scenario\.personas\.flatMap/);
  assert.match(agentFieldSource, /\/lrwa-agent-field-map-bg\.webp/);
  assert.match(agentFieldSource, /function AgentFieldCanvas/);
  assert.match(
    agentFieldSource,
    /<canvas[\s\S]*aria-hidden="true"[\s\S]*agent-topology-canvas/,
  );
  assert.match(agentFieldSource, /new ResizeObserver/);
  assert.match(agentFieldSource, /new IntersectionObserver/);
  assert.match(
    agentFieldSource,
    /Math\.min\(window\.devicePixelRatio \|\| 1, 2\)/,
  );
  assert.match(agentFieldSource, /prefers-reduced-motion: reduce/);
  assert.match(agentFieldSource, /requestAnimationFrame/);
  assert.match(agentFieldSource, /cancelAnimationFrame/);
  assert.match(styles, /\.agent-topology-canvas/);
  assert.match(styles, /\/lrwa-role-orchestration-bg\.webp/);
  assert.match(agentFieldSource, /aria-pressed=\{isSelected\}/);
  assert.match(agentFieldSource, /Next agent/);
  assert.match(agentFieldSource, /下一个 Agent/);
  assert.match(agentFieldSource, /Disabled · 0 sends/);
  assert.match(agentFieldSource, /禁用 · 0 次发送/);
  assert.match(localizedCopySource, /simulationEnglishCopy/);
  assert.match(localizedCopySource, /localizeScenario/);
  assert.match(localizedCopySource, /builtInSourceNote/);
  assert.match(exampleResultSource, /"truthBearing": false/);
  assert.match(exampleResultSource, /"generatedByLiveRun": false/);
  assert.match(exampleResultSource, /"ledgerWrite": false/);
  assert.doesNotMatch(
    localizedCopySource,
    /realSends|realReplies|realReceipts|networkAction|deliveryStatus/,
  );
  assert.match(investigationSource, /hasTruthBearingSimulationState/);
  assert.match(investigationSource, /record\.mode === "simulation_lab"/);
  assert.match(simulationPageSource, /key=\{initialPhaseId \?\? "input"\}/);

  const simulationBranch = briefSource.indexOf(
    'if (mode === "simulation_lab")',
  );
  const serverCall = briefSource.indexOf("await createServerInvestigation");
  assert.ok(simulationBranch >= 0);
  assert.ok(serverCall > simulationBranch);
  assert.match(
    briefSource.slice(simulationBranch, serverCall),
    /router\.push\("\/investigations\/simulation\?start=decompose"\)/,
  );
  assert.doesNotMatch(
    briefSource.slice(simulationBranch, serverCall),
    /commit\(|clearInvestigationRecord|createServerInvestigation/,
  );
  assert.match(briefSource, /readOnly=\{mode === "simulation_lab"\}/);
});

test("keeps truthful state boundaries in the active product source", async () => {
  const activeFiles = await Promise.all(
    [
      "../app/page.tsx",
      "../app/layout.tsx",
      "../app/investigations/page.tsx",
      "../app/investigations/workbench/page.tsx",
      "../app/investigations/evidence/page.tsx",
      "../app/investigations/example/page.tsx",
      "../app/investigations/next/page.tsx",
      "../app/investigations/simulation/page.tsx",
      "../app/investigations/simulation/report/page.tsx",
      "../components/home-experience.tsx",
      "../components/site-header.tsx",
      "../components/workspace-shell.tsx",
      "../components/investigation-brief.tsx",
      "../components/mission-workbench.tsx",
      "../components/evidence-room.tsx",
      "../components/decision-actions.tsx",
      "../components/landing-role-stage.tsx",
      "../components/simulation-entry.tsx",
      "../components/simulation-lab.tsx",
      "../components/simulation-report.tsx",
      "../components/agent-mission-control.tsx",
      "../components/locale-provider.tsx",
      "../components/language-toggle.tsx",
      "../lib/i18n.ts",
      "../lib/i18n-server.ts",
      "../lib/investigation.ts",
      "../lib/evidence-api.ts",
      "../lib/use-investigation.ts",
      "../lib/simulation-copy.ts",
      "../lib/simulation-example-result.json",
      "../lib/simulation-scenario.json",
    ].map((path) => readFile(new URL(path, import.meta.url), "utf8")),
  );
  const visibleCopy = activeFiles.join("\n");

  assert.doesNotMatch(visibleCopy, /[—–]/);
  assert.doesNotMatch(
    visibleCopy,
    /1,024|3_330_000|1_920_000|completedProbes|finalMetrics|Morrow Coffee|晨潮咖啡/,
  );
  assert.match(visibleCopy, /No receipt\. No conclusion\./);
  assert.match(visibleCopy, /没有回执，就没有结论/);
  assert.match(visibleCopy, /Copying is not sending/);
  assert.match(visibleCopy, /复制不代表已经发送/);
  assert.match(visibleCopy, /no external connection/);
  assert.match(visibleCopy, /外部连接/);
  assert.match(visibleCopy, /not configured/);
  assert.match(visibleCopy, /未配置/);
  assert.match(visibleCopy, /LOCALE_COOKIE_NAME = "lrwa-locale"/);
  assert.match(visibleCopy, /crypto\.subtle\.digest\("SHA-256"/);
  assert.match(visibleCopy, /window\.confirm/);
  assert.match(visibleCopy, /userConfirmedExternalSend/);
  assert.match(visibleCopy, /userConfirmedSource/);
  assert.match(visibleCopy, /hasReceiptWithoutConfirmedContact/);
  assert.match(visibleCopy, /server_sync_failed/);
  assert.match(visibleCopy, /server_sync_unknown/);
});

test("removes the scripted-completion fallback from the frontend", async () => {
  const removedFiles = [
    "../components/live-mission.tsx",
    "../components/findings-workspace.tsx",
    "../components/plan-gate.tsx",
    "../lib/demo-data.ts",
    "../lib/demo-evidence.json",
    "../lib/api.ts",
  ];
  for (const path of removedFiles) {
    await assert.rejects(access(new URL(path, import.meta.url)));
  }
});

test("does not probe a reviewer's localhost from the public deployment", async () => {
  const source = await readFile(
    new URL("../lib/evidence-api.ts", import.meta.url),
    "utf8",
  );

  assert.match(source, /CONFIGURED_API_URL/);
  assert.match(source, /window\.location\.hostname/);
  assert.match(source, /return null/);
  assert.doesNotMatch(
    source,
    /process\.env\.NEXT_PUBLIC_LRWA_API_URL \|\| LOCAL_API_URL/,
  );
});

test("uses a native Next.js build on Vercel", async () => {
  const [packageSource, vercelSource] = await Promise.all([
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../vercel.json", import.meta.url), "utf8"),
  ]);
  const packageJson = JSON.parse(packageSource);
  const vercelConfig = JSON.parse(vercelSource);

  assert.match(packageJson.scripts.build, /vinext build/);
  assert.equal(packageJson.scripts["build:vercel"], "next build");
  assert.equal(vercelConfig.framework, "nextjs");
  assert.equal(vercelConfig.buildCommand, "npm run build:vercel");
  assert.equal(vercelConfig.outputDirectory, undefined);
});

test("keeps the supplied geometric mark in the app and browser tab", async () => {
  await access(new URL("../app/icon.svg", import.meta.url));
  await access(new URL("../public/favicon.svg", import.meta.url));
  await access(new URL("../public/lrwa-mark.svg", import.meta.url));

  const layout = await readFile(
    new URL("../app/layout.tsx", import.meta.url),
    "utf8",
  );
  const header = await readFile(
    new URL("../components/site-header.tsx", import.meta.url),
    "utf8",
  );
  assert.match(layout, /\/icon\.svg/);
  assert.match(layout, /\/favicon\.svg/);
  assert.match(header, /M50 12L70 76\.72L30 76\.72Z/);
});
