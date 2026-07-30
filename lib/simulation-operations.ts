export type SimulationOperationKind =
  | "search"
  | "inspect"
  | "plan"
  | "assume-role"
  | "route"
  | "compose"
  | "stage"
  | "wait"
  | "model-branch"
  | "extract"
  | "compare"
  | "deduplicate"
  | "challenge"
  | "approval"
  | "archive"
  | "lock";

export type SimulationStationId =
  | "sources"
  | "claims"
  | "roles"
  | "channels"
  | "outreach"
  | "branches"
  | "verification"
  | "review"
  | "vault";

export type SimulationSpriteMode = "walk" | "type" | "read" | "wait";

type LocalizedText = Readonly<{
  en: string;
  zh: string;
}>;

export type SimulationOperation = Readonly<{
  agentId: string;
  code: string;
  detail: LocalizedText;
  evidenceState: LocalizedText;
  factIds: readonly string[];
  id: string;
  kind: SimulationOperationKind;
  label: LocalizedText;
  networkAction: false;
  nextCondition: LocalizedText;
  output: LocalizedText;
  spriteMode: SimulationSpriteMode;
  stationId: SimulationStationId;
  synthetic: true;
}>;

export type SimulationStation = Readonly<{
  id: SimulationStationId;
  label: LocalizedText;
  shortLabel: LocalizedText;
  x: number;
  y: number;
}>;

export const simulationOperationsPerWave = 2;

export const simulationStations: readonly SimulationStation[] = [
  {
    id: "sources",
    label: { en: "Public clue desk", zh: "公开线索台" },
    shortLabel: { en: "CLUES", zh: "线索" },
    x: 12,
    y: 18,
  },
  {
    id: "claims",
    label: { en: "Claim lab", zh: "命题拆解台" },
    shortLabel: { en: "CLAIMS", zh: "命题" },
    x: 35,
    y: 18,
  },
  {
    id: "roles",
    label: { en: "Role briefing", zh: "角色编排台" },
    shortLabel: { en: "ROLES", zh: "角色" },
    x: 58,
    y: 18,
  },
  {
    id: "channels",
    label: { en: "Channel router", zh: "渠道路由台" },
    shortLabel: { en: "ROUTES", zh: "路由" },
    x: 82,
    y: 18,
  },
  {
    id: "outreach",
    label: { en: "Inquiry staging", zh: "询问暂存台" },
    shortLabel: { en: "PROBES", zh: "询问" },
    x: 18,
    y: 51,
  },
  {
    id: "branches",
    label: { en: "Response model", zh: "响应建模台" },
    shortLabel: { en: "BRANCHES", zh: "分支" },
    x: 45,
    y: 51,
  },
  {
    id: "verification",
    label: { en: "Cross-check desk", zh: "交叉核验台" },
    shortLabel: { en: "VERIFY", zh: "核验" },
    x: 72,
    y: 51,
  },
  {
    id: "review",
    label: { en: "Human review", zh: "人工复核门" },
    shortLabel: { en: "REVIEW", zh: "复核" },
    x: 88,
    y: 76,
  },
  {
    id: "vault",
    label: { en: "Evidence gate", zh: "证据门槛" },
    shortLabel: { en: "VAULT", zh: "证据" },
    x: 60,
    y: 80,
  },
] as const;

export const simulationOperationKindLabels: Record<
  SimulationOperationKind,
  LocalizedText
> = {
  search: { en: "SEARCH", zh: "检索" },
  inspect: { en: "INSPECT", zh: "核查" },
  plan: { en: "PLAN", zh: "拆解" },
  "assume-role": { en: "LOAD ROLE", zh: "装载角色" },
  route: { en: "ROUTE", zh: "选择渠道" },
  compose: { en: "COMPOSE", zh: "形成问句" },
  stage: { en: "STAGE", zh: "本地暂存" },
  wait: { en: "WAIT", zh: "等待窗口" },
  "model-branch": { en: "MODEL", zh: "建模分支" },
  extract: { en: "EXTRACT", zh: "抽取字段" },
  compare: { en: "COMPARE", zh: "交叉对照" },
  deduplicate: { en: "DEDUP", zh: "来源去重" },
  challenge: { en: "CHALLENGE", zh: "设计追问" },
  approval: { en: "APPROVAL", zh: "人工审批" },
  archive: { en: "ARCHIVE", zh: "准备回执" },
  lock: { en: "LOCK", zh: "锁定结论" },
};

export const simulationOperations: readonly SimulationOperation[] = [
  {
    id: "OP-01",
    code: "01",
    agentId: "P-01",
    kind: "search",
    stationId: "sources",
    spriteMode: "read",
    label: {
      en: "Search official store references",
      zh: "检索官方门店公开页面",
    },
    detail: {
      en: "Open the three public references already attached to this sandbox and mark every visible field as a clue, not a conclusion.",
      zh: "读取沙盒内已经附带的三项公开来源，并把可见字段全部标记为线索，而不是结论。",
    },
    output: {
      en: "Three public clue records, each marked not evidence",
      zh: "3 条公开线索记录，均标记为非证据",
    },
    nextCondition: {
      en: "Separate the two public store names before asking whether both still operate.",
      zh: "先区分两个公开门店名称，再询问它们是否仍在营业。",
    },
    evidenceState: { en: "PUBLIC CLUE ONLY", zh: "仅公开线索" },
    factIds: ["F-01", "F-02"],
    synthetic: true,
    networkAction: false,
  },
  {
    id: "OP-02",
    code: "02",
    agentId: "P-05",
    kind: "inspect",
    stationId: "sources",
    spriteMode: "read",
    label: {
      en: "Inspect store identity fields",
      zh: "核查门店身份字段",
    },
    detail: {
      en: "Compare the public names, addresses, and phone fields without assuming that two labels prove two operating stores.",
      zh: "对照公开名称、地址和电话字段，但不把两个名称直接当作两家正在营业的门店。",
    },
    output: {
      en: "Identity ambiguity preserved for verification",
      zh: "保留门店身份歧义，等待后续验证",
    },
    nextCondition: {
      en: "Turn the ambiguity into a fact gap that a later inquiry can test.",
      zh: "把歧义转成后续询问可以验证的事实缺口。",
    },
    evidenceState: { en: "UNVERIFIED", zh: "尚未验证" },
    factIds: ["F-01"],
    synthetic: true,
    networkAction: false,
  },
  {
    id: "OP-03",
    code: "03",
    agentId: "P-06",
    kind: "plan",
    stationId: "claims",
    spriteMode: "type",
    label: {
      en: "Decompose the decision",
      zh: "拆解决策问题",
    },
    detail: {
      en: "Split the decision into store identity, current operation, bulk pickup, and fulfillment constraints.",
      zh: "把决策拆成门店身份、当前营业、批量自取和履约限制四个缺口。",
    },
    output: {
      en: "Four fact gaps with separate verification conditions",
      zh: "4 个事实缺口及各自的验证条件",
    },
    nextCondition: {
      en: "Give each inquiry a concrete business context instead of repeating one generic question.",
      zh: "让每次询问拥有具体业务情境，而不是重复同一个泛化问题。",
    },
    evidenceState: { en: "LOCAL PLAN", zh: "本地计划" },
    factIds: ["F-01", "F-02", "F-03", "F-04"],
    synthetic: true,
    networkAction: false,
  },
  {
    id: "OP-04",
    code: "04",
    agentId: "P-02",
    kind: "assume-role",
    stationId: "roles",
    spriteMode: "type",
    label: {
      en: "Load an office buyer context",
      zh: "装载企业买家情境",
    },
    detail: {
      en: "Frame the question as an office assistant arranging twenty drinks for a morning meeting. No real identity or account is created.",
      zh: "以行政助理为晨会安排 20 杯饮品的情境组织问题，不创建真实身份或账号。",
    },
    output: {
      en: "Synthetic customer context loaded locally",
      zh: "合成客户情境已在本地装载",
    },
    nextCondition: {
      en: "Choose an authorized channel before any real outreach could occur.",
      zh: "在任何真实外联发生前，先选择获得授权的渠道。",
    },
    evidenceState: { en: "SYNTHETIC ROLE", zh: "合成角色" },
    factIds: ["F-03", "F-04"],
    synthetic: true,
    networkAction: false,
  },
  {
    id: "OP-05",
    code: "05",
    agentId: "P-04",
    kind: "route",
    stationId: "channels",
    spriteMode: "read",
    label: {
      en: "Map possible inquiry channels",
      zh: "规划可用询问渠道",
    },
    detail: {
      en: "List the official store line, customer service, and mini-program route as candidates. This replay connects to none of them.",
      zh: "把官方门店电话、客服和小程序列为候选渠道。本次回放不会连接其中任何一个。",
    },
    output: {
      en: "Channel plan created, all connectors disabled",
      zh: "渠道计划已生成，所有连接器均关闭",
    },
    nextCondition: {
      en: "Draft a question that names the quantity, time window, and required proof.",
      zh: "形成包含数量、时间窗口和所需证明的具体问句。",
    },
    evidenceState: { en: "CONNECTORS OFF", zh: "连接器关闭" },
    factIds: ["F-01", "F-03", "F-04"],
    synthetic: true,
    networkAction: false,
  },
  {
    id: "OP-06",
    code: "06",
    agentId: "P-01",
    kind: "compose",
    stationId: "outreach",
    spriteMode: "type",
    label: {
      en: "Compose the first customer probe",
      zh: "形成首轮客户问句",
    },
    detail: {
      en: "Ask which store can prepare twenty Americanos before 08:45 and when the order must be confirmed.",
      zh: "询问哪家门店能在 08:45 前备好 20 杯美式，以及最晚何时需要确认订单。",
    },
    output: {
      en: "One local inquiry draft, not sent",
      zh: "1 条本地询问草案，未发送",
    },
    nextCondition: {
      en: "Hold the draft until the identity, channel, and outreach scope are approved.",
      zh: "在身份、渠道和外联范围获批前暂存草案。",
    },
    evidenceState: { en: "DRAFT ONLY", zh: "仅草案" },
    factIds: ["F-02", "F-03"],
    synthetic: true,
    networkAction: false,
  },
  {
    id: "OP-07",
    code: "07",
    agentId: "P-03",
    kind: "stage",
    stationId: "outreach",
    spriteMode: "type",
    label: {
      en: "Stage a simulated outreach",
      zh: "暂存模拟外联任务",
    },
    detail: {
      en: "Place the draft in a local queue to demonstrate orchestration. The queue has no network destination and cannot send.",
      zh: "把草案放入本地队列以演示编排。该队列没有网络目的地，也无法发送。",
    },
    output: {
      en: "Local queue item created, zero messages released",
      zh: "已创建本地队列项，实际发送为 0",
    },
    nextCondition: {
      en: "Wait for the target business window or explicit operator approval.",
      zh: "等待目标营业窗口或操作员明确批准。",
    },
    evidenceState: { en: "NOT EXECUTED", zh: "未真实执行" },
    factIds: ["F-03"],
    synthetic: true,
    networkAction: false,
  },
  {
    id: "OP-08",
    code: "08",
    agentId: "P-08",
    kind: "wait",
    stationId: "channels",
    spriteMode: "wait",
    label: {
      en: "Wait for the inquiry window",
      zh: "等待合适询问窗口",
    },
    detail: {
      en: "Model the timing rule for a morning pickup question without opening a connection or contacting a store.",
      zh: "为上午自取问题建模时间规则，但不建立连接，也不联系门店。",
    },
    output: {
      en: "Timing condition attached to the local task",
      zh: "时间条件已附加到本地任务",
    },
    nextCondition: {
      en: "Prepare response categories before a real reply could ever enter the system.",
      zh: "在任何真实回复进入系统前，先准备响应分类。",
    },
    evidenceState: { en: "LOCAL TIMER", zh: "本地计时" },
    factIds: ["F-02", "F-03"],
    synthetic: true,
    networkAction: false,
  },
  {
    id: "OP-09",
    code: "09",
    agentId: "P-07",
    kind: "model-branch",
    stationId: "branches",
    spriteMode: "type",
    label: {
      en: "Model possible response branches",
      zh: "建模可能的响应分支",
    },
    detail: {
      en: "Define how a future reply might be classified: clear store identity, template answer, conditional capacity, or conflicting information.",
      zh: "定义未来回复可能进入的分类：明确门店身份、模板答复、条件性接单或信息冲突。",
    },
    output: {
      en: "Four hypothetical branches, no fabricated reply",
      zh: "4 个假设分支，不生成虚假客服回复",
    },
    nextCondition: {
      en: "Define the fields that an original reply would need to contain.",
      zh: "定义原始回复必须包含哪些可验证字段。",
    },
    evidenceState: { en: "HYPOTHESIS ONLY", zh: "仅系统假设" },
    factIds: ["F-01", "F-03", "F-04"],
    synthetic: true,
    networkAction: false,
  },
  {
    id: "OP-10",
    code: "10",
    agentId: "P-11",
    kind: "extract",
    stationId: "branches",
    spriteMode: "read",
    label: {
      en: "Prepare claim extraction fields",
      zh: "准备主张抽取字段",
    },
    detail: {
      en: "Create slots for store identifier, operating hours, quantity, pickup time, payment, and source timestamp. No values are invented.",
      zh: "建立门店标识、营业时间、数量、取货时间、付款方式和来源时间戳等字段，不填造任何值。",
    },
    output: {
      en: "Empty extraction schema ready for an original reply",
      zh: "空白抽取结构已就绪，等待原始回复",
    },
    nextCondition: {
      en: "Compare only sourced fields and keep missing values unresolved.",
      zh: "只对照带来源的字段，缺失值继续保持未知。",
    },
    evidenceState: { en: "EMPTY SCHEMA", zh: "空白结构" },
    factIds: ["F-01", "F-02", "F-03", "F-04"],
    synthetic: true,
    networkAction: false,
  },
  {
    id: "OP-11",
    code: "11",
    agentId: "P-09",
    kind: "compare",
    stationId: "verification",
    spriteMode: "read",
    label: {
      en: "Cross-check required claims",
      zh: "交叉对照所需主张",
    },
    detail: {
      en: "Align identity, timing, capacity, and customization claims across the planned inquiry waves. The board compares requirements, not real replies.",
      zh: "对齐不同询问波次中的身份、时间、产能和定制需求。看板对照的是验证要求，不是真实回复。",
    },
    output: {
      en: "Coverage matrix for four fact gaps",
      zh: "覆盖 4 个事实缺口的对照矩阵",
    },
    nextCondition: {
      en: "Check whether apparently separate answers could share the same underlying source.",
      zh: "检查看似独立的答案是否可能来自同一底层来源。",
    },
    evidenceState: { en: "METHOD CHECK", zh: "方法检查" },
    factIds: ["F-01", "F-02", "F-03", "F-04"],
    synthetic: true,
    networkAction: false,
  },
  {
    id: "OP-12",
    code: "12",
    agentId: "P-05",
    kind: "deduplicate",
    stationId: "verification",
    spriteMode: "type",
    label: {
      en: "Model source independence",
      zh: "建模来源独立性",
    },
    detail: {
      en: "Treat repeated customer-service wording as one source until channel, operator, timestamp, and store ownership can be distinguished.",
      zh: "在渠道、操作主体、时间戳和门店归属可以区分前，把重复客服口径按同一来源处理。",
    },
    output: {
      en: "Independence rule attached to the evidence gate",
      zh: "来源独立性规则已加入证据门槛",
    },
    nextCondition: {
      en: "Design a follow-up for any contradiction that survives source deduplication.",
      zh: "为来源去重后仍存在的矛盾设计下一轮追问。",
    },
    evidenceState: { en: "NO RECEIPTS YET", zh: "尚无真实回执" },
    factIds: ["F-01", "F-02"],
    synthetic: true,
    networkAction: false,
  },
  {
    id: "OP-13",
    code: "13",
    agentId: "P-10",
    kind: "challenge",
    stationId: "verification",
    spriteMode: "type",
    label: {
      en: "Design a contradiction probe",
      zh: "设计矛盾追问",
    },
    detail: {
      en: "Prepare a follow-up that asks for the exact store identifier, latest order time, and accountable confirmation when two answers conflict.",
      zh: "当两种答案冲突时，准备追问准确门店标识、最晚下单时间和可追溯确认。",
    },
    output: {
      en: "One conditional follow-up, not sent",
      zh: "1 条条件性追问，未发送",
    },
    nextCondition: {
      en: "Require human approval before a real channel can be used.",
      zh: "真实渠道启用前必须获得人工批准。",
    },
    evidenceState: { en: "DRAFT ONLY", zh: "仅草案" },
    factIds: ["F-01", "F-03", "F-04"],
    synthetic: true,
    networkAction: false,
  },
  {
    id: "OP-14",
    code: "14",
    agentId: "P-04",
    kind: "approval",
    stationId: "review",
    spriteMode: "wait",
    label: {
      en: "Stop at human approval",
      zh: "停在人工审批门",
    },
    detail: {
      en: "Present identity, channel, timing, and question scope for review. The public demo cannot grant approval or trigger outreach.",
      zh: "把身份、渠道、时间和问题范围交给人工复核。公开演示无法批准，也无法触发外联。",
    },
    output: {
      en: "Approval request modeled locally, no external action",
      zh: "审批请求已在本地建模，无外部动作",
    },
    nextCondition: {
      en: "Only an authorized real run may proceed to contact and collect receipts.",
      zh: "只有经过授权的真实任务才能继续联系并收集回执。",
    },
    evidenceState: { en: "APPROVAL REQUIRED", zh: "需要人工批准" },
    factIds: ["F-01", "F-02", "F-03", "F-04"],
    synthetic: true,
    networkAction: false,
  },
  {
    id: "OP-15",
    code: "15",
    agentId: "P-12",
    kind: "archive",
    stationId: "vault",
    spriteMode: "type",
    label: {
      en: "Prepare an evidence receipt",
      zh: "准备证据回执结构",
    },
    detail: {
      en: "Create an empty receipt template for original content, channel, source identity, timestamp, and review notes.",
      zh: "建立空白回执模板，用于原始内容、渠道、来源身份、时间戳和复核备注。",
    },
    output: {
      en: "Empty receipt template, zero ledger writes",
      zh: "空白回执模板，证据账本写入为 0",
    },
    nextCondition: {
      en: "Keep every finding locked until original receipts exist.",
      zh: "在取得原始回执前，所有事实判断保持锁定。",
    },
    evidenceState: { en: "TEMPLATE ONLY", zh: "仅模板" },
    factIds: ["F-01", "F-02", "F-03", "F-04"],
    synthetic: true,
    networkAction: false,
  },
  {
    id: "OP-16",
    code: "16",
    agentId: "P-06",
    kind: "lock",
    stationId: "vault",
    spriteMode: "read",
    label: {
      en: "Lock the real-world finding",
      zh: "锁定真实世界结论",
    },
    detail: {
      en: "Complete the local walkthrough while preserving the distinction between a polished example report and truth-bearing evidence.",
      zh: "完成本地全过程回放，同时明确区分精美报告样张与能够支撑事实判断的真实证据。",
    },
    output: {
      en: "Walkthrough complete, real finding still empty",
      zh: "全过程回放完成，真实结论仍为空",
    },
    nextCondition: {
      en: "Open the response-branch and report views, or create an authorized real investigation.",
      zh: "继续查看响应分支与完整报告样张，或建立经过授权的真实调查。",
    },
    evidenceState: { en: "CONCLUSION LOCKED", zh: "结论锁定" },
    factIds: ["F-01", "F-02", "F-03", "F-04"],
    synthetic: true,
    networkAction: false,
  },
] as const;

export const simulationOperationWaveCount = Math.ceil(
  simulationOperations.length / simulationOperationsPerWave,
);

export function simulationStationById(stationId: SimulationStationId) {
  return simulationStations.find((station) => station.id === stationId)!;
}
