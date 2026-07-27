import Link from "next/link";
import { DocsShell } from "@/components/docs-shell";
import type { Locale } from "@/lib/i18n";

interface DocsIndexProps {
  locale: Locale;
}

export function DocsIndex({ locale }: DocsIndexProps) {
  const isZh = locale === "zh";

  const documents = isZh
    ? [
        {
          code: "BP",
          href: "/docs/business-plan",
          title: "商业计划书",
          summary:
            "面向投资人与合作方，说明 LRWA 解决的问题、目标用户、产品切口、商业化假设、当前进度与主要风险。",
          details: ["商业逻辑", "市场进入假设", "当前产品状态"],
          action: "阅读商业计划书",
        },
        {
          code: "WP",
          href: "/docs/whitepaper",
          title: "产品白皮书",
          summary:
            "面向产品与技术评估者，解释多角色调查、询问编排、证据来源、事实判断和安全边界如何协同工作。",
          details: ["调查方法", "证据模型", "安全与合规"],
          action: "阅读白皮书",
        },
      ]
    : [
        {
          code: "BP",
          href: "/docs/business-plan",
          title: "Business plan",
          summary:
            "For investors and partners. Covers the problem, target users, initial wedge, commercial hypotheses, current product status, and principal risks.",
          details: [
            "Commercial thesis",
            "Go-to-market hypothesis",
            "Current product status",
          ],
          action: "Read the business plan",
        },
        {
          code: "WP",
          href: "/docs/whitepaper",
          title: "Product whitepaper",
          summary:
            "For product and technical evaluators. Explains role-based investigation, inquiry orchestration, evidence provenance, findings, and safety boundaries.",
          details: [
            "Investigation method",
            "Evidence model",
            "Safety and compliance",
          ],
          action: "Read the whitepaper",
        },
      ];

  return (
    <DocsShell locale={locale}>
      <section className="docs-index-hero">
        <p className="docs-index-kicker">
          {isZh ? "LRWA 项目材料" : "LRWA company materials"}
        </p>
        <h1>{isZh ? "理解我们正在构建什么。" : "Understand what we are building."}</h1>
        <p className="docs-index-intro">
          {isZh
            ? "这里集中说明 LRWA 的商业逻辑与产品方法。所有内容都会区分当前已经可以体验的功能、尚待验证的商业假设和未来工程方向。"
            : "These documents explain LRWA's commercial case and product method. They separate what can be experienced today from unvalidated business hypotheses and future engineering direction."}
        </p>
      </section>

      <section
        aria-label={isZh ? "文档列表" : "Available documents"}
        className="docs-index-grid"
      >
        {documents.map((document) => (
          <article className="docs-index-card" key={document.href}>
            <div className="docs-index-card-head">
              <span className="docs-index-code" aria-hidden>
                {document.code}
              </span>
              <h2>{document.title}</h2>
            </div>
            <p>{document.summary}</p>
            <ul className="docs-index-details">
              {document.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
            <Link className="docs-index-action" href={document.href}>
              {document.action}
              <span aria-hidden>→</span>
            </Link>
          </article>
        ))}
      </section>

      <aside className="docs-index-boundary" aria-label={isZh ? "演示边界" : "Demo boundary"}>
        <strong>{isZh ? "当前状态" : "Current status"}</strong>
        <p>
          {isZh
            ? "现有产品是一套交互式沙盒。它会展示调查拆解、Agent 分工、询问波次、证据门槛和完整报告，但不会真实联系任何外部对象，演示数据也不能作为真实商业判断。"
            : "The current product is an interactive sandbox. It demonstrates investigation design, agent roles, inquiry waves, evidence gates, and a complete report, but it contacts no external party and its demonstration data cannot support a real commercial decision."}
        </p>
      </aside>
    </DocsShell>
  );
}
