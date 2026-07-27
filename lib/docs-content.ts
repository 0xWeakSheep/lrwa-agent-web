import type { Locale } from "@/lib/i18n";

export type DocsDocumentVariant = "business-plan" | "whitepaper";

export interface DocsFactGroup {
  title: string;
  body?: string;
  items?: string[];
}

export interface DocsSection {
  id: string;
  title: string;
  summary?: string;
  paragraphs?: string[];
  groups?: DocsFactGroup[];
}

export interface DocsOpeningCase {
  title: string;
  paragraphs: string[];
  sourcesLabel: string;
  sources: {
    href: string;
    label: string;
  }[];
}

export interface DocsDocumentContent {
  variant: DocsDocumentVariant;
  kind: string;
  title: string;
  summary: string;
  openingCase: DocsOpeningCase;
  boundary: string;
  contentsLabel: string;
  backLabel: string;
  homeLabel: string;
  resources?: {
    href: string;
    label: string;
  }[];
  sections: DocsSection[];
  closingTitle: string;
  closingBody: string;
}

const luckinSourcesEn = [
  {
    href: "https://espritech.cn/research_pdfs/20200202_MuddyWaters_Research.pdf",
    label: "Anonymous field report",
  },
  {
    href: "https://www.sec.gov/newsroom/press-releases/2020-319",
    label: "SEC enforcement release",
  },
  {
    href: "https://www.sec.gov/Archives/edgar/data/1767582/000110465920079446/a20-23914_1ex99d1.htm",
    label: "Luckin internal investigation disclosure",
  },
];

const luckinSourcesZh = [
  {
    href: "https://espritech.cn/research_pdfs/20200202_MuddyWaters_Research.pdf",
    label: "匿名线下调查报告",
  },
  {
    href: "https://www.sec.gov/newsroom/press-releases/2020-319",
    label: "SEC 执法说明",
  },
  {
    href: "https://www.sec.gov/Archives/edgar/data/1767582/000110465920079446/a20-23914_1ex99d1.htm",
    label: "瑞幸内部调查披露",
  },
];

const businessPlanEn: DocsDocumentContent = {
  variant: "business-plan",
  kind: "Business plan",
  title: "LRWA business plan",
  openingCase: {
    title:
      "Commercial truth is expensive because much of it lives outside the spreadsheet.",
    paragraphs: [
      "In January 2020, an anonymous short report circulated by Muddy Waters said its team used 92 full-time and 1,418 part-time investigators to cover 620 Luckin Coffee locations. The work included 981 store-days, 11,260 hours of store-traffic video, pickup and delivery-bag counts, and 25,843 customer receipts. The point was simple: compare the company story with what could be observed in daily operations.",
      "That report supported a market short thesis, not a regulatory finding. Luckin's own investigation later reported fabricated transactions, and the SEC charged the company with materially misstating revenue, expenses, and net loss. LRWA uses the episode to make a narrower business case. Repetitive inquiry, follow-up, reconciliation, and record keeping can move from human field teams to authorized agents. Those agents can work in approved customer, buyer, supplier, or industry-research roles and speak with real merchants through permitted channels. Original replies become evidence only when their source, time, and channel are preserved. Work that must happen physically still requires people or approved devices.",
    ],
    sourcesLabel: "Sources used for this opening example",
    sources: luckinSourcesEn,
  },
  summary:
    "LRWA is intended for investors and operating teams that need to verify a commercial claim, not merely summarize public information. The product starts with a decision, identifies the missing facts, conducts or prepares approved multi-round inquiries, and keeps simulated material separate from real evidence.",
  boundary:
    "The product available today is an interactive sandbox. It contacts no store, supplier, customer-service channel, or external platform, and the demonstration report is not real investigation evidence.",
  contentsLabel: "In this document",
  backLabel: "All documents",
  homeLabel: "Home",
  resources: [
    {
      href: "/materials/LRWA_Seed_Deck.pdf",
      label: "Seed deck PDF",
    },
    {
      href: "/materials/LRWA_Seed_Deck.pptx",
      label: "Seed deck PPTX",
    },
  ],
  sections: [
    {
      id: "product",
      title: "What we are selling",
      paragraphs: [
        "Most research agents search documents and produce a summary. LRWA begins when the important fact is still missing. A user states the decision, such as whether an operating claim can be trusted or whether a location is suitable for a store. LRWA turns the unresolved parts into specific inquiry tasks, decides which approved role and channel can answer them, changes the next question when a reply creates a contradiction, and preserves the original record behind every finding.",
        "The first product is a narrow, human-reviewed B2B investigation for one decision. It should end with a plain answer, the reasons behind it, the evidence that was actually obtained, and the gaps that remain. The public product currently demonstrates this workflow with prebuilt data. The next product milestone is a live, authorized pilot that can be compared with an existing manual investigation.",
      ],
    },
    {
      id: "market",
      title: "Who pays and why",
      paragraphs: [
        "The first buyers are VC and private-market investors, consulting firms, and corporate strategy, procurement, or expansion teams. They already pay employees or outside investigators to call businesses, compare supplier claims, visit locations, and chase missing records. LRWA is useful when the question is narrow enough to investigate, important enough to change a decision, and supported by channels that permit the work.",
        "Early revenue is expected to come from one-off commercial investigations and special diligence, followed by team subscriptions, private deployment, approved data connections, and annual technical service. These are pricing hypotheses, not current revenue claims. If the B2B model is proven after Series A, the same investigation modules can support lower-cost products for founders and small merchants, such as assessing whether an area is suitable for a coffee shop or restaurant.",
      ],
    },
    {
      id: "funding",
      title: "What each funding stage must prove",
      summary:
        "This is a sequence of operating tests, not a claim about completed milestones, financing amounts, customers, revenue, or dates.",
      groups: [
        {
          title: "Seed round",
          body:
            "The goal is to show that LRWA can complete one real, tightly scoped, authorized B2B investigation instead of only replaying a sandbox. The minimum product must take a decision, identify missing facts, run approved multi-round conversations, preserve original replies with time and source, and require human review before a finding is released. The expected result before Series A is evidence that at least one narrow use case can be delivered repeatedly, that a buyer will commit budget or provide a concrete procurement path, and that the team can explain the human-review, channel, and exception-handling cost of each job.",
        },
        {
          title: "Series A",
          body:
            "The goal is to turn a deliverable investigation into a B2B product that teams can use repeatedly. LRWA needs a shared workspace, outreach approvals, identity and channel rules, reusable investigation templates, an evidence ledger, enterprise permissions, and audit controls. This stage can add authorized enterprise email, communications services, internal data sources, and carefully scoped platform connections. The expected result before Series B is repeat use or renewal, stable evidence quality across live work, less founder involvement in each delivery, and pricing that can support the real cost of execution.",
        },
        {
          title: "Series B",
          body:
            "The goal is to expand without lowering the evidence standard. Proven investigation methods can become modules for consulting, corporate strategy, procurement, and business expansion. External local-commerce data, including a possible Meituan connection, should be added only where permission and permitted use are explicit. Once the B2B model is working, LRWA can test lower-cost products for individual founders and small businesses. The expected result is continued use of standardized modules, channel and data costs covered by pricing, and a light product that still shows sources, limits, and uncertainty before broader consumer expansion.",
        },
      ],
    },
    {
      id: "defensibility",
      title: "What can become defensible",
      paragraphs: [
        "The moat is not the language model and it is not a pile of generated reports. If LRWA earns one, it will come from repeated live work: better claim maps, role and question libraries, channel-specific response logic, contradiction patterns, evidence-quality rules, cost benchmarks, approved connectors, and the ability to fit a customer's review process. None of this should be described as a finished moat today.",
      ],
    },
    {
      id: "limits",
      title: "What could break the plan",
      paragraphs: [
        "Live investigation is constrained by law, platform policy, identity rules, recording rules, and data protection. A task role is a controlled way to ask a question, not permission to invent a person, misstate an affiliation, bypass access controls, or manufacture a reply. Several agents repeating the same claim do not create independent evidence. Long-running work can also become too expensive once review, retries, channels, and exceptions are counted.",
        "The near-term test is therefore blunt. If an authorized pilot does not improve source coverage, time, cost, or decision quality compared with manual work, or if buyers will not pay enough to support compliant delivery, the initial business model has not been proven. The company should say that directly rather than replacing missing evidence with a larger market story.",
      ],
    },
  ],
  closingTitle: "Current status",
  closingBody:
    "LRWA does not currently claim live customers, revenue, completed external investigations, proprietary datasets, validated pricing, or a completed Meituan integration. The sandbox shows the intended workflow and report form. Real claims should be added only when a reviewer can inspect the underlying records.",
};

const businessPlanZh: DocsDocumentContent = {
  variant: "business-plan",
  kind: "商业计划",
  title: "LRWA 商业计划书",
  openingCase: {
    title: "商业尽调真正贵的地方，是很多事实根本不在财报里。",
    paragraphs: [
      "2020 年 1 月，浑水转发的一份匿名瑞幸做空报告称，调查团队动员了 92 名全职和 1,418 名兼职调查人员，覆盖 620 家门店，完成 981 个门店日、11,260 小时的客流录像，并统计取餐与配送袋、收集 25,843 张消费者小票。它做的事情并不神秘，就是拿真实经营现场去核对公司对外讲的故事。",
      "这份报告是市场调查与做空论证，不是监管结论。后来，瑞幸自己的内部调查披露了虚构交易，SEC 也就收入、费用和净亏损的重大错报提出指控。LRWA 从这个案例里看到的是一门更具体的生意：把大量重复的询问、追问、核对和留档交给经过授权的 Agent。Agent 可以在获准的客户、采购方、供应商或行业研究者等任务角色下，通过允许的渠道与真实商家进行多轮交流。只有保留来源、时间和渠道的原始回复才能成为证据。必须在线下完成的观察，仍然需要真人或经过批准的设备。",
    ],
    sourcesLabel: "本段案例来源",
    sources: luckinSourcesZh,
  },
  summary:
    "LRWA 面向那些需要验证商业说法的投资人与经营团队。它不只是整理公开资料，而是从一个具体决策出发，找出缺失事实，组织经过批准的多轮调查，并把模拟内容和真实证据严格分开。",
  boundary:
    "当前可以体验的是交互式沙盒。它不会联系任何门店、供应商、客服渠道或外部平台，演示报告也不是真实调查证据。",
  contentsLabel: "本文内容",
  backLabel: "全部文档",
  homeLabel: "首页",
  resources: [
    {
      href: "/materials/LRWA_Seed_Deck.pdf",
      label: "商业计划 PDF",
    },
    {
      href: "/materials/LRWA_Seed_Deck.pptx",
      label: "商业计划 PPTX",
    },
  ],
  sections: [
    {
      id: "product",
      title: "我们到底卖什么",
      paragraphs: [
        "普通 Research Agent 会搜索文档，再给出一份总结。LRWA 从关键事实仍然缺失的地方开始。用户先说清楚要做的决策，例如某项经营数据是否可信，或一个地点是否适合开店。LRWA 把没有答案的部分拆成具体调查任务，决定由什么角色通过什么合规渠道去询问，根据真实回复中的矛盾调整下一轮问题，并保留支撑每条判断的原始记录。",
        "第一款产品是一项围绕单个决策展开、有人审核的 B 端调查。最终交付应该先说合适还是不合适，再解释原因、已经拿到的证据和仍然缺失的事实。当前公开产品用预制数据展示完整流程。下一步不是继续把演示做得更热闹，而是完成一次能够与现有人工调查直接比较的真实授权试点。",
      ],
    },
    {
      id: "market",
      title: "谁会付钱，为什么",
      paragraphs: [
        "第一批买方是 VC、私募投资机构、咨询公司，以及企业战略、采购和拓展团队。这些团队本来就在花钱让员工或外部调查员打电话、跑门店、核对供应商说法并追查缺失记录。适合 LRWA 的第一批任务应该范围足够窄，结果能够影响真实决策，而且存在允许开展调查的渠道。",
        "早期收入计划来自单次商业调查和专项尽调，随后增加团队订阅、私有化部署、合规数据接入和年度技术服务。这些是商业假设，不是当前收入。A 轮之后，如果 B 端模式已经跑通，同一套调查模块才会被做成面向个体创业者和中小商户的低价产品，例如判断一个区域是否适合开咖啡店或餐厅。",
      ],
    },
    {
      id: "funding",
      title: "种子轮、A 轮和 B 轮要证明什么",
      summary:
        "这是一组经营目标，不是已经取得的成绩，也不预设融资金额、客户、收入或完成时间。",
      groups: [
        {
          title: "种子轮",
          body:
            "目标是证明 LRWA 能完成一项真实、范围明确、经过授权的 B 端调查，而不只是播放沙盒。最小产品需要从一个决策出发，找出缺失事实，通过获准渠道组织多轮交流，保存带时间和来源的原始回复，并在结论发出前完成人工审核。进入 A 轮前，预期至少证明一种窄场景可以重复交付，买方愿意投入预算或给出明确采购路径，团队也能算清每个任务的人工审核、渠道和异常处理成本。",
        },
        {
          title: "A 轮",
          body:
            "目标是把可以交付的调查项目变成 B 端团队能够反复使用的产品。产品需要补齐团队工作区、外联审批、身份与渠道规则、可复用调查模板、证据账本、企业权限和审计能力，并逐步接入经过授权的企业邮箱、通信服务和内部数据源。进入 B 轮前，预期看到真实任务中的复购或续订意愿，证据质量和合规边界保持稳定，每次交付不再依赖创始团队逐步盯住，实际成本也能被当前定价覆盖。",
        },
        {
          title: "B 轮",
          body:
            "目标是在不降低证据标准的前提下扩大规模。已经验证的方法可以做成咨询、企业战略、采购和商业拓展等行业模块；美团等本地商业平台的数据，只能在授权和用途都清楚时接入。B 端模式成立后，LRWA 才开始测试面向个体创业者和中小商户的轻 B 或 C 端产品。这个阶段预期证明标准化模块能够持续被使用，渠道与数据成本能够被收费覆盖，轻量产品仍然能够清楚说明来源、限制和不确定性，然后再考虑更大的大众市场。",
        },
      ],
    },
    {
      id: "defensibility",
      title: "什么能沉淀成壁垒",
      paragraphs: [
        "真正的壁垒不会是底层大模型，也不会是一堆自动生成的报告。如果 LRWA 最终能建立壁垒，它会来自持续的真实任务，包括越来越准确的问题拆解、角色与问题库、不同渠道的回复规律、矛盾模式、证据质量规则、成本基准、获批接口，以及接入客户审核流程的能力。这些能力今天还在建设，不能提前写成已经拥有的护城河。",
      ],
    },
    {
      id: "limits",
      title: "这件事最难的地方",
      paragraphs: [
        "真实调查受法律、平台规则、身份说明、录音规定和数据保护约束。任务角色只是一种受控的提问视角，不代表可以虚构个人、冒充机构、绕过访问控制或制造回复。多个 Agent 重复同一个说法，也不会自动变成多份独立证据。持续几天或几个月的任务还会产生审核、重试、渠道和异常处理成本。",
        "近期检验标准很直接。如果经过授权的试点无法在来源覆盖、耗时、成本或决策质量上优于人工流程，或者买方愿意支付的价格无法覆盖合规交付成本，初期商业模式就还没有成立。项目应该把这个结果讲清楚，而不是用一个更大的市场故事掩盖它。",
      ],
    },
  ],
  closingTitle: "当前状态",
  closingBody:
    "LRWA 目前没有声称已经拥有真实客户、收入、完成的外部调查、专有数据集、经过验证的定价或已经接通的美团接口。现有沙盒只展示计划中的工作流和报告形态。以后每增加一项真实主张，都应该同时提供可供审核的记录。",
};

const whitepaperEn: DocsDocumentContent = {
  variant: "whitepaper",
  kind: "Product whitepaper",
  title: "Evidence operations for commercial investigation",
  openingCase: {
    title: "Evidence begins outside the model.",
    paragraphs: [
      "Public information shows what a company says. Investigation tests what happens in operations. The anonymous Luckin report used people in stores, 11,260 hours of traffic video, pickup and delivery-bag counts, and 25,843 receipts to compare observable activity with published claims. It surfaced questions that could be checked against evidence before the later internal investigation and SEC action.",
      "LRWA translates the part of that fieldwork that can be done through authorized digital channels into a controlled agent process. A question becomes an approved probe. A real interaction produces an original reply. The system stores its source, time, channel, and any transformation before a reviewer can use it in a finding. AI performs the repetitive work, but the evidence threshold does not change.",
    ],
    sourcesLabel: "Sources used for this opening example",
    sources: luckinSourcesEn,
  },
  summary:
    "This whitepaper describes the intended method. The current public product replays the method in a sandbox and performs no live outreach.",
  boundary:
    "Every persona, inquiry, response, and finding in the public demo is prebuilt. None is an external communication record or an observed fact about the named business.",
  contentsLabel: "Method",
  backLabel: "All documents",
  homeLabel: "Home",
  sections: [
    {
      id: "loop",
      title: "From a claim to a finding",
      paragraphs: [
        "LRWA begins with a decision and the specific claims behind it. It separates public information from facts that remain unknown, identifies the people or systems that may know those facts, and prepares questions that can distinguish one explanation from another. The basic loop is simple: define the claim, send an approved probe, preserve the original response, check provenance, resolve contradictions, and state what the evidence supports.",
        "A useful investigation can also end without an answer. If no permitted source is available, replies conflict, or the evidence covers only part of the claim, the report must say so. A plausible model inference is not a substitute for a missing observation.",
      ],
    },
    {
      id: "roles",
      title: "Roles and multi-round inquiry",
      paragraphs: [
        "A role is a controlled context for asking a question. It defines the purpose, permitted identity presentation, allowed disclosures, questions, channels, and stopping rules. Customer, buyer, supplier, and industry-research roles can reach different parts of an operating system, but they do not permit false affiliation, access-control bypass, or collection of unnecessary personal data.",
        "The system sends inquiries in waves because the next useful question depends on the last real answer. A reply may resolve the claim, reveal a contradiction, require clarification, trigger a check through another independent source, or require human approval. The number of agents is not the goal. Source coverage and independence are.",
      ],
    },
    {
      id: "evidence",
      title: "The evidence ledger",
      paragraphs: [
        "Every external observation needs a source appropriate to the channel, an acquisition time, the investigation role, the original content or stable reference, the probe that produced it, and a record of transformations such as transcription, translation, extraction, or classification. Review state, conflicts, and restrictions on use stay attached to the same receipt.",
        "Draft questions remain drafts. Predicted replies remain hypotheses. Sandbox events remain demonstration data. An observation enters the evidence ledger only after the required provenance checks, and a finding may cite only those accepted receipts. Several copies of the same underlying statement still count as one source.",
      ],
    },
    {
      id: "reporting",
      title: "Plain findings first",
      paragraphs: [
        "The report starts with the answer a decision-maker needs: suitable, unsuitable, conditionally suitable, or not yet decidable. It then explains the main reason and the important unresolved problem in ordinary language. Methods, source records, response paths, and model transformations follow as supporting material.",
        "LRWA avoids decorative confidence scores when the source base does not justify them. Findings use explicit states such as supported, partially supported, contradicted, and unresolved, together with the scope and time window in which that state applies.",
      ],
    },
    {
      id: "control",
      title: "Authorization and human control",
      paragraphs: [
        "Before any live action, the investigation owner defines the target, purpose, permitted identity, channels, data categories, recording policy, and escalation rules. Sensitive outbound messages, identity changes, commitments, payments, recordings, or high-risk follow-up can be held for human approval. Agents must follow law, contracts, and platform rules and may not defeat authentication, rate limits, or other access controls.",
        "The system records both allowed and blocked actions. That audit trail lets a reviewer see why a probe was sent, changed, held, or stopped. Data collection is limited to the stated claim and subject to retention and access controls.",
      ],
    },
    {
      id: "current",
      title: "What exists today",
      paragraphs: [
        "The public demonstration shows claim decomposition, synthetic roles, inquiry waves, possible response branches, an evidence gate, and a full example report. It sends no external messages and receives no real replies. Its report is an example of presentation, not a conclusion about a real store or company.",
        "A live product still requires approved connectors, identity and policy configuration, action authorization, receipt capture, review queues, error handling, source-specific compliance work, and measurement against manual investigations. Some work will continue to require people in the field. These are engineering and operating requirements, not released capabilities.",
      ],
    },
  ],
  closingTitle: "The standard",
  closingBody:
    "A reviewer should be able to trace a conclusion back to every accepted observation, see every unresolved gap, and understand every model transformation that affected the result. If that path is missing, LRWA should not call the conclusion verified.",
};

const whitepaperZh: DocsDocumentContent = {
  variant: "whitepaper",
  kind: "产品白皮书",
  title: "商业调查中的证据工作系统",
  openingCase: {
    title: "证据必须来自模型之外。",
    paragraphs: [
      "公开资料只能说明一家公司对外怎么说，调查要验证真实经营中发生了什么。瑞幸匿名做空报告使用真人门店蹲点、11,260 小时客流录像、取餐与配送袋计数，以及 25,843 张小票，把现场经营活动与公开说法逐项核对。它在后续内部调查和 SEC 执法之前，提出了一批能够继续验证的问题。",
      "LRWA 把其中能够通过合规线上渠道完成的部分，转化为受控的 Agent 流程。一个待验证问题先变成经过批准的询问；与真实对象的交流产生原始回复；系统保存来源、时间、渠道和所有处理记录；审核者最后决定它能否支持结论。AI 承担重复工作，但证据门槛不会降低。",
    ],
    sourcesLabel: "本段案例来源",
    sources: luckinSourcesZh,
  },
  summary:
    "这份白皮书说明 LRWA 计划采用的方法。当前公开产品只在沙盒中回放流程，不会开展真实外联。",
  boundary:
    "公开演示中的人物、询问、回复和判断都是预制内容。它们不是外部交流记录，也不代表已经观察到任何企业事实。",
  contentsLabel: "方法目录",
  backLabel: "全部文档",
  homeLabel: "首页",
  sections: [
    {
      id: "loop",
      title: "从说法走向事实判断",
      paragraphs: [
        "LRWA 从一个决策和支撑它的具体说法开始。系统先把公开资料与仍然未知的事实分开，再找到可能知情的人或系统，并准备能够区分不同解释的问题。基本流程很直接：定义待验证说法，发送经过批准的询问，保存原始回复，检查来源，处理矛盾，然后说明证据究竟支持什么。",
        "调查也可以在没有答案的情况下结束。如果没有允许使用的来源，回复互相冲突，或者证据只覆盖了说法的一部分，报告必须如实说明。模型推测再合理，也不能替代没有取得的外部观察。",
      ],
    },
    {
      id: "roles",
      title: "任务角色与多轮询问",
      paragraphs: [
        "角色是一套受控的提问背景。它规定调查目的、允许使用的身份说明、可以披露的信息、问题范围、渠道和停止条件。客户、采购方、供应商或行业研究者等角色，可以接触到经营系统的不同部分，但不能用来虚构机构关系、绕过访问控制或收集与任务无关的个人信息。",
        "系统按波次提问，是因为下一条有价值的问题取决于上一条真实回复。回复可能直接解决问题，也可能暴露矛盾、需要澄清、需要通过另一个独立来源核验，或者必须转交人工审批。Agent 数量不是目标，来源覆盖和独立性才是。",
      ],
    },
    {
      id: "evidence",
      title: "证据账本",
      paragraphs: [
        "每条外部观察都要保留与渠道相适应的来源、获取时间、本次调查使用的角色、原始内容或稳定引用、产生它的具体问题，以及转录、翻译、提取和分类等处理记录。审核状态、冲突信息和使用限制也要留在同一份凭证上。",
        "问题草稿始终是草稿，预测回复始终是假设，沙盒事件始终是演示数据。外部观察只有完成来源检查后才能进入证据账本，最终判断也只能引用这些通过检查的凭证。同一个底层说法被复制到多个渠道，仍然只能算一个来源。",
      ],
    },
    {
      id: "reporting",
      title: "先说结论，再讲过程",
      paragraphs: [
        "报告开头先回答决策者真正关心的问题：合适、不合适、有条件合适，或者目前还无法判断。接下来用普通语言说明主要原因和最重要的未解决问题。调查方法、来源记录、回复路径和模型处理过程放在后面，作为支撑材料。",
        "如果来源数量和独立性不足，LRWA 不会用一个看似精确的置信度装饰结论。事实判断使用已支持、部分支持、存在反证和仍未解决等明确状态，并写清它适用的范围和时间。",
      ],
    },
    {
      id: "control",
      title: "授权与人工控制",
      paragraphs: [
        "任何真实动作开始前，调查负责人必须定义目标、用途、允许使用的身份说明、渠道、数据类别、录音规则和升级条件。敏感外发、身份变化、承诺、付款、录音或高风险追问可以被暂停，等待人工审批。Agent 必须遵守法律、合同和平台规则，也不能绕过登录、频率限制或其他访问控制。",
        "系统会同时记录被允许和被阻止的动作。审核者可以看到某个问题为什么被发送、修改、暂停或停止。数据采集只围绕当前待验证说法展开，并设置保存期限与访问权限。",
      ],
    },
    {
      id: "current",
      title: "今天已经有什么",
      paragraphs: [
        "公开演示展示了问题拆解、合成角色、询问波次、可能的回复分支、证据门槛和一份完整示例报告。它不会向外部发送消息，也不会收到真实回复。演示报告只说明结果可以怎样呈现，不是对真实门店或公司的判断。",
        "真实产品仍然需要获批渠道接口、身份与策略配置、动作授权、凭证采集、人工审核队列、错误处理、针对每种来源的合规工作，以及与人工调查的对照测量。有些任务仍然要由真人在线下完成。这些是接下来的工程和运营要求，不是已经发布的能力。",
      ],
    },
  ],
  closingTitle: "我们要求自己做到什么",
  closingBody:
    "审核者应该能从结论一路查回每条通过检查的外部观察，看见所有未解决问题，并理解影响结果的每一次模型处理。如果这条路径不存在，LRWA 就不应该把结论称为已经验证。",
};

export function getBusinessPlanContent(locale: Locale): DocsDocumentContent {
  return locale === "zh" ? businessPlanZh : businessPlanEn;
}

export function getWhitepaperContent(locale: Locale): DocsDocumentContent {
  return locale === "zh" ? whitepaperZh : whitepaperEn;
}
