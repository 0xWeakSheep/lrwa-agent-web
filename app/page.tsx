import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Checkmark, Locked } from "@carbon/icons-react";
import { LandingRoleStage } from "@/components/landing-role-stage";
import { Brand, SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Evidence Operations",
  description:
    "把商业主张拆成角色、追问和可追溯证据的调查工作流。",
};

export default function Home() {
  return (
    <main className="marketing-page" id="main-content">
      <SiteHeader />

      <section className="cinematic-hero" aria-labelledby="hero-title">
        <div className="cinematic-media" aria-hidden="true">
          <Image
            alt=""
            className="cinematic-image"
            fill
            priority
            sizes="100vw"
            src="/lrwa-cinematic-hero.webp"
            unoptimized
          />
        </div>

        <div className="cinematic-hero-inner">
          <div className="cinematic-copy">
            <h1 id="hero-title">
              别只让 AI 分析。
              <span>让它去求证。</span>
            </h1>
            <p className="cinematic-deck">
              把一个商业主张，变成多角色、多阶段、可追溯的证据任务。
            </p>
            <div className="cinematic-actions">
              <Link
                className="cinematic-primary"
                href="/investigations"
              >
                发起调查
                <ArrowRight size={20} aria-hidden />
              </Link>
            </div>
            <p className="cinematic-disclosure">
              没有可追溯回执，就不生成结论。
            </p>
          </div>
        </div>
      </section>

      <section className="investigation-chain" aria-label="调查工作流">
        <div>
          <span>CLAIM</span>
          <strong>主张</strong>
        </div>
        <ArrowRight size={18} aria-hidden />
        <div>
          <span>ROLES</span>
          <strong>角色</strong>
        </div>
        <ArrowRight size={18} aria-hidden />
        <div>
          <span>PROBES</span>
          <strong>追问</strong>
        </div>
        <ArrowRight size={18} aria-hidden />
        <div>
          <span>RECEIPTS</span>
          <strong>回执</strong>
        </div>
      </section>

      <section
        className="cinematic-method"
        id="method"
        aria-labelledby="method-title"
      >
        <div className="cinematic-method-intro">
          <p className="cinematic-section-label">ROLE-BASED FIELDWORK</p>
          <h2 id="method-title">
            同一个主张，
            <span>换四种视角追问。</span>
          </h2>
          <p>
            AI 不直接写研报。它先设计身份边界、首轮询问、继续追问和需要留下的证据。
          </p>
        </div>

        <LandingRoleStage />
      </section>

      <section className="cinematic-field" aria-labelledby="field-title">
        <Image
          alt="概念化证据工作台插画，包含地图、门店记录和观察标记"
          className="cinematic-field-image"
          fill
          sizes="(max-width: 680px) 100vw, 1280px"
          src="/lrwa-evidence-table.webp"
          unoptimized
        />
        <div className="cinematic-field-shade" aria-hidden />
        <div className="cinematic-field-copy">
          <p className="cinematic-section-label">EVIDENCE BEFORE ANSWERS</p>
          <h2 id="field-title">没有回执，就没有结论。</h2>
          <div className="evidence-principles">
            <div>
              <Checkmark size={18} aria-hidden />
              <span>保存原始来源与采集时间</span>
            </div>
            <div>
              <Checkmark size={18} aria-hidden />
              <span>把追问过程与回执绑定</span>
            </div>
            <div>
              <Locked size={18} aria-hidden />
              <span>证据不足时锁住判断</span>
            </div>
          </div>
          <p className="cinematic-field-note">
            概念视觉，不代表已经执行任何外部调查。
          </p>
          <Link
            className="cinematic-primary cinematic-field-link"
            href="/investigations/evidence"
          >
            打开证据室
            <ArrowRight size={20} aria-hidden />
          </Link>
        </div>
      </section>

      <section
        className="operating-modes"
        id="boundaries"
        aria-labelledby="boundaries-title"
      >
        <div className="operating-heading">
          <p className="cinematic-section-label">OPERATING BOUNDARIES</p>
          <h2 id="boundaries-title">先把边界讲清楚。</h2>
        </div>
        <div className="operating-primary">
          <span>默认模式</span>
          <h3>人工协作调查</h3>
          <p>AI 设计多轮策略，用户审核后从真实、授权的渠道发送。</p>
        </div>
        <div className="operating-stack">
          <article>
            <span>有权限时</span>
            <h3>授权数据连接</h3>
            <p>只接正式 API、客户提供的数据和允许访问的公开来源。</p>
          </article>
          <article>
            <span>演示方法时</span>
            <h3>模拟实验</h3>
            <p>所有内容持续标注为示例，绝不混进真实证据账本。</p>
          </article>
        </div>
      </section>

      <section className="closing-invitation">
        <p>START WITH ONE CLAIM</p>
        <h2>选一个值得被推翻的主张。</h2>
        <Link className="cinematic-primary" href="/investigations">
          创建调查草稿
          <ArrowRight size={20} aria-hidden />
        </Link>
      </section>

      <footer className="cinematic-footer">
        <Brand />
        <p>Evidence operations for commercial diligence</p>
        <p>Prototype · no live data by default</p>
      </footer>
    </main>
  );
}
