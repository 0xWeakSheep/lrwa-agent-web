import Link from "next/link";
import { DocsShell } from "@/components/docs-shell";
import type { DocsDocumentContent } from "@/lib/docs-content";
import type { Locale } from "@/lib/i18n";

interface DocsDocumentProps {
  content: DocsDocumentContent;
  locale: Locale;
}

export function DocsDocument({ content, locale }: DocsDocumentProps) {
  return (
    <DocsShell locale={locale} variant={content.variant}>
      <article className="docs-document">
        <header className="docs-document-hero">
          <nav aria-label={content.backLabel} className="docs-breadcrumbs">
            <Link href="/">{content.homeLabel}</Link>
            <span aria-hidden>/</span>
            <Link href="/docs">{content.backLabel}</Link>
          </nav>
          <p className="docs-document-kind">{content.kind}</p>
          <h1>{content.title}</h1>
          <section className="docs-opening-case">
            <h2>{content.openingCase.title}</h2>
            <div className="docs-opening-case-copy">
              {content.openingCase.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <p className="docs-opening-sources">
                <span>{content.openingCase.sourcesLabel}</span>
                {content.openingCase.sources.map((source) => (
                  <a href={source.href} key={source.href} rel="noreferrer">
                    {source.label}
                  </a>
                ))}
              </p>
            </div>
          </section>
          <p className="docs-document-summary">{content.summary}</p>
          <aside className="docs-document-boundary">
            <strong>{locale === "zh" ? "真实性边界" : "Truth boundary"}</strong>
            <p>{content.boundary}</p>
          </aside>
          {content.resources ? (
            <div
              aria-label={locale === "zh" ? "文档下载" : "Document downloads"}
              className="docs-document-resources"
            >
              {content.resources.map((resource) => (
                <a download href={resource.href} key={resource.href}>
                  {resource.label}
                </a>
              ))}
            </div>
          ) : null}
        </header>

        <div className="docs-document-layout">
          <aside className="docs-contents">
            <strong>{content.contentsLabel}</strong>
            <nav aria-label={content.contentsLabel}>
              <ol>
                {content.sections.map((section) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`}>{section.title}</a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>

          <div className="docs-document-body">
            {content.sections.map((section) => (
              <section
                className="docs-document-section"
                id={section.id}
                key={section.id}
              >
                <h2>{section.title}</h2>
                {section.summary ? (
                  <p className="docs-section-summary">{section.summary}</p>
                ) : null}
                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.groups ? (
                  <div className="docs-fact-groups">
                    {section.groups.map((group) => (
                      <section className="docs-fact-group" key={group.title}>
                        <h3>{group.title}</h3>
                        {group.body ? <p>{group.body}</p> : null}
                        {group.items ? (
                          <ul>
                            {group.items.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        ) : null}
                      </section>
                    ))}
                  </div>
                ) : null}
              </section>
            ))}

            <footer className="docs-document-closing">
              <h2>{content.closingTitle}</h2>
              <p>{content.closingBody}</p>
              <Link href="/docs">{content.backLabel}</Link>
            </footer>
          </div>
        </div>
      </article>
    </DocsShell>
  );
}
