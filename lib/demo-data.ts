import type {
  DemoCase,
  EvidenceArtifact,
  InvestigationEvent,
  StoreSignal,
} from "./types";
import demoEvidenceFixture from "./demo-evidence.json";

const districts = ["静安", "徐汇", "浦东", "长宁", "杨浦", "普陀"];

function buildStores(): StoreSignal[] {
  return Array.from({ length: 48 }, (_, index) => {
    const attention = [5, 11, 17, 26, 31, 37, 42, 46].includes(index);
    const closed = [8, 23, 35, 44].includes(index);
    return {
      id: `store-${String(index + 1).padStart(2, "0")}`,
      name: `晨潮 ${districts[index % districts.length]} ${index + 1} 号店`,
      district: districts[index % districts.length],
      x: 7 + ((index * 17) % 87),
      y: 9 + ((index * 29) % 80),
      status: closed ? "closed" : attention ? "attention" : "pending",
      probes: 0,
    };
  });
}

export const demoEvidence = demoEvidenceFixture as EvidenceArtifact[];

export const demoCase: DemoCase = {
  id: "morrow-coffee",
  companyName: "Morrow Coffee",
  companyNameZh: "晨潮咖啡",
  stage: "Series A",
  sector: "连锁零售",
  scenarioLabel: "沙箱案例 · 虚构企业 · 示例证据",
  summary:
    "公司材料声称 6 月 GMV 为 333 万元。LRWA 将该主张拆解为门店、需求、供应链、客服和用工五类证据。",
  status: "planned",
  claims: [
    {
      id: "claim-store-count",
      label: "正常经营门店",
      metricKey: "active_store_count",
      claimedValue: 48,
      unit: "家",
      period: "2026-06",
      materiality: "high",
    },
    {
      id: "claim-orders-per-store",
      label: "单店日均订单",
      metricKey: "daily_orders_per_store",
      claimedValue: 118,
      unit: "单",
      period: "2026-06",
      materiality: "high",
    },
    {
      id: "claim-average-ticket",
      label: "平均客单价",
      metricKey: "average_ticket",
      claimedValue: 19.6,
      unit: "元",
      period: "2026-06",
      materiality: "medium",
    },
    {
      id: "claim-monthly-gmv",
      label: "月度 GMV",
      metricKey: "monthly_gmv",
      claimedValue: 3330000,
      unit: "元",
      period: "2026-06",
      materiality: "high",
    },
  ],
  plan: {
    caseId: "morrow-coffee",
    probeCount: 1024,
    storeCount: 48,
    dayCount: 7,
    timeSlotCount: 4,
    personaCount: 5,
    channels: ["storefront", "demand", "support", "supply", "staffing"],
    seed: 240727,
    budgetCredits: 64,
  },
  stores: buildStores(),
  baselineMetrics: {
    completedProbes: 0,
    totalProbes: 1024,
    activeStores: 48,
    estimatedMonthlyGmv: 3330000,
    lowerBound: 3330000,
    upperBound: 3330000,
    confidence: 0,
    realityGap: 0,
  },
  finalMetrics: {
    completedProbes: 1024,
    totalProbes: 1024,
    activeStores: 39,
    estimatedMonthlyGmv: 1920000,
    lowerBound: 1720000,
    upperBound: 2140000,
    confidence: 0.88,
    realityGap: 0.423,
  },
  evidence: demoEvidence,
  finding: {
    id: "finding-gmv-gap",
    claimId: "claim-monthly-gmv",
    verdict: "contradicted",
    headline: "申报 GMV 未获得现实信号支持",
    summary:
      "五类证据将 6 月 GMV 的固定情景带收敛至 172 万至 214 万元。即使加入企业团购假设，差异仍具有投资决策意义。",
    claimedValue: 3330000,
    estimatedValue: 1920000,
    lowerBound: 1720000,
    upperBound: 2140000,
    unit: "元",
    confidence: 0.88,
    alternativeHypotheses: [
      "企业团购订单未被消费者任务覆盖",
      "部分门店在第三方渠道之外完成交易",
      "促销活动造成客单价和补货周期短期错配",
    ],
    nextActions: [
      "要求企业提供 8 家分层抽样门店的 POS 结算记录",
      "核验企业团购合同及对应收单流水",
      "对 9 家异常门店进行授权实地核查",
      "在投资委员会前调整收入敏感性假设",
    ],
  },
};

const eventBlueprint: Omit<InvestigationEvent, "id" | "occurredAt">[] = [
  {
    sequence: 1,
    type: "investigation.started",
    agent: "Mission Orchestrator",
    message: "已锁定随机种子、权限清单和 1,024 个参数化探针配额。",
    metrics: { completedProbes: 0, confidence: 0 },
  },
  {
    sequence: 2,
    type: "probe.batch.completed",
    agent: "Geo Observer",
    message: "完成首轮门店存续与午间可用性检查。",
    metrics: {
      completedProbes: 168,
      activeStores: 43,
      estimatedMonthlyGmv: 2760000,
      lowerBound: 2260000,
      upperBound: 3210000,
      confidence: 0.32,
      realityGap: 0.171,
    },
  },
  {
    sequence: 3,
    type: "evidence.verified",
    agent: "Evidence Verifier",
    message: "门店状态证据已完成去重、权限和来源检查。",
    metrics: { completedProbes: 264, confidence: 0.46 },
    evidence: demoEvidence[0],
  },
  {
    sequence: 4,
    type: "estimate.updated",
    agent: "Statistician",
    message: "需求与门店信号交叉后，GMV 情景带首次低于申报值。",
    metrics: {
      completedProbes: 512,
      activeStores: 41,
      estimatedMonthlyGmv: 2310000,
      lowerBound: 1910000,
      upperBound: 2700000,
      confidence: 0.63,
      realityGap: 0.306,
    },
  },
  {
    sequence: 5,
    type: "evidence.verified",
    agent: "Evidence Verifier",
    message: "订单吞吐代理和供应链补货记录来自两个证据类别。",
    metrics: { completedProbes: 704, confidence: 0.76 },
    evidence: demoEvidence[3],
  },
  {
    sequence: 6,
    type: "hypothesis.raised",
    agent: "Skeptic Agent",
    message: "企业团购可能未被消费者样本覆盖，建议加入 20% 团购假设重算。",
    metrics: {
      completedProbes: 832,
      estimatedMonthlyGmv: 2050000,
      lowerBound: 1780000,
      upperBound: 2340000,
      confidence: 0.81,
      realityGap: 0.384,
    },
  },
  {
    sequence: 7,
    type: "investigation.completed",
    agent: "Mission Orchestrator",
    message: "调查完成。结论保留不确定性，并生成进入投资委员会前的核验动作。",
    metrics: demoCase.finalMetrics,
  },
];

export function createLocalDemoEvents(): InvestigationEvent[] {
  const base = Date.parse("2026-07-27T12:00:00+08:00");
  return eventBlueprint.map((event, index) => ({
    ...event,
    id: `local-event-${index + 1}`,
    occurredAt: new Date(base + index * 78_000).toISOString(),
  }));
}
