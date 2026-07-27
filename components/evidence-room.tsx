"use client";

import Link from "next/link";
import {
  ArrowRight,
  DataReference,
  Link as LinkIcon,
  Locked,
  WarningAlt,
} from "@carbon/icons-react";
import { stanceLabels, type EvidenceStance } from "@/lib/investigation";
import { useInvestigation } from "@/lib/use-investigation";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(value));
}

export function EvidenceRoom() {
  const { record, isHydrated } = useInvestigation();

  if (!isHydrated) {
    return (
      <div className="truthful-loading" role="status">
        正在校验证据账本
      </div>
    );
  }

  if (!record) {
    return (
      <section className="honest-empty-state">
        <DataReference size={42} aria-hidden />
        <p>NO INVESTIGATION DRAFT</p>
        <h2>没有调查草稿，也没有证据。</h2>
        <span>先定义一个主张，再决定需要通过哪些角色去求证。</span>
        <Link className="cinematic-primary" href="/investigations">
          定义主张
          <ArrowRight size={20} aria-hidden />
        </Link>
      </section>
    );
  }

  if (record.evidence.length === 0) {
    return (
      <div className="evidence-room-empty">
        <section className="evidence-empty-hero">
          <div>
            <p>EVIDENCE LEDGER / EMPTY</p>
            <h2>没有证据，就不生成结论。</h2>
            <span>
              角色策略仍是计划。系统没有访问外部平台，也没有自动制造回执。
            </span>
          </div>
          <div className="evidence-lock-visual" aria-hidden>
            <Locked size={42} />
            <span>CONCLUSION LOCKED</span>
          </div>
        </section>

        <section className="unresolved-routes" aria-labelledby="unresolved-title">
          <div>
            <p>OPEN ROUTES</p>
            <h2 id="unresolved-title">仍待执行的角色路径</h2>
          </div>
          <div>
            {record.missions.map((mission) => (
              <article key={mission.id}>
                <span>{mission.code}</span>
                <div>
                  <h3>{mission.name}</h3>
                  <p>{mission.receipt}</p>
                </div>
                <strong>尚无回执</strong>
              </article>
            ))}
          </div>
        </section>

        <div className="workspace-next">
          <div>
            <span>下一步</span>
            <strong>在任务台审核策略，并录入你实际获得的内容。</strong>
          </div>
          <Link
            className="cinematic-primary"
            href="/investigations/workbench"
          >
            返回角色任务台
            <ArrowRight size={20} aria-hidden />
          </Link>
        </div>
      </div>
    );
  }

  const stanceCounts = record.evidence.reduce<Record<EvidenceStance, number>>(
    (counts, item) => {
      counts[item.stance] += 1;
      return counts;
    },
    { supports: 0, contradicts: 0, context: 0 },
  );
  const coveredRoleIds = new Set(record.evidence.map((item) => item.roleId));
  const readyForReview = coveredRoleIds.size >= 2;

  return (
    <div className="evidence-room">
      <section className="evidence-gate" aria-labelledby="evidence-gate-title">
        <div>
          <p>CONCLUSION GATE</p>
          <h2 id="evidence-gate-title">
            {readyForReview ? "可进入人工综合复核" : "结论仍被锁住"}
          </h2>
          <span>
            {readyForReview
              ? "已有多个角色视角，但系统尚未计算财务值或投资结论。"
              : "当前回执只覆盖一个角色视角，不能形成交叉判断。"}
          </span>
        </div>
        <div className="evidence-gate-state">
          {readyForReview ? (
            <DataReference size={30} aria-hidden />
          ) : (
            <Locked size={30} aria-hidden />
          )}
          <strong>{readyForReview ? "REVIEW READY" : "LOCKED"}</strong>
        </div>
      </section>

      <section className="evidence-balance" aria-label="已录入证据关系">
        {(
          ["supports", "contradicts", "context"] as EvidenceStance[]
        ).map((stance) => (
          <div key={stance}>
            <span>{stanceLabels[stance]}</span>
            <strong>{stanceCounts[stance]}</strong>
            <small>用户录入回执</small>
          </div>
        ))}
        <div>
          <span>角色覆盖</span>
          <strong>{coveredRoleIds.size}</strong>
          <small>实际出现的视角</small>
        </div>
      </section>

      <div className="evidence-room-grid">
        <section className="receipt-ledger" aria-labelledby="receipt-title">
          <header>
            <div>
              <p>LOCAL RECEIPTS</p>
              <h2 id="receipt-title">证据账本</h2>
            </div>
            <span>内容来自用户确认录入</span>
          </header>
          <div className="receipt-list">
            {record.evidence
              .slice()
              .reverse()
              .map((evidence) => {
                const role = record.missions.find(
                  (mission) => mission.id === evidence.roleId,
                );
                const safeUrl =
                  evidence.sourceUrl?.startsWith("https://") ||
                  evidence.sourceUrl?.startsWith("http://")
                    ? evidence.sourceUrl
                    : undefined;

                return (
                  <article key={evidence.id}>
                    <div className="receipt-meta">
                      <span>{role?.code ?? evidence.roleId}</span>
                      <strong>{stanceLabels[evidence.stance]}</strong>
                      <time dateTime={evidence.capturedAt}>
                        {formatDate(evidence.capturedAt)}
                      </time>
                    </div>
                    <h3>{evidence.sourceLabel}</h3>
                    <blockquote>{evidence.capturedText}</blockquote>
                    <dl>
                      <div>
                        <dt>采集方式</dt>
                        <dd>用户手动录入</dd>
                      </div>
                      <div>
                        <dt>授权状态</dt>
                        <dd>用户确认</dd>
                      </div>
                      <div>
                        <dt>内容哈希</dt>
                        <dd title={evidence.contentHash}>
                          {evidence.contentHash.slice(0, 22)}...
                        </dd>
                      </div>
                      <div>
                        <dt>完整性计算</dt>
                        <dd>
                          {evidence.integrityAuthority === "server"
                            ? "临时服务端"
                            : "当前浏览器"}
                        </dd>
                      </div>
                    </dl>
                    {safeUrl && (
                      <a
                        className="receipt-source-link"
                        href={safeUrl}
                        rel="noreferrer"
                        target="_blank"
                      >
                        <LinkIcon size={16} aria-hidden />
                        打开用户提供的来源
                      </a>
                    )}
                  </article>
                );
              })}
          </div>
        </section>

        <aside className="evidence-interpretation">
          <div>
            <WarningAlt size={22} aria-hidden />
            <p>当前可以确认的只有以下事实</p>
          </div>
          <ul>
            <li>这些文本由当前浏览器的用户录入。</li>
            <li>保存后已计算内容哈希。</li>
            <li>关系标签来自用户选择。</li>
          </ul>
          <div className="interpretation-limit">
            <span>尚未确认</span>
            <p>来源真实性、样本代表性、财务外推和最终投资判断。</p>
          </div>
          <Link className="text-link" href="/investigations/next">
            生成下一步核验动作
            <ArrowRight size={16} aria-hidden />
          </Link>
        </aside>
      </div>
    </div>
  );
}
