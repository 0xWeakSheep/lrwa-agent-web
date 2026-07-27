"use client";

import Image from "next/image";
import { useState } from "react";
import { useI18n } from "@/components/locale-provider";
import { LrwaSignal } from "@/components/lrwa-signal";
import { roleBlueprints, type RoleId } from "@/lib/investigation";

const englishRoles: Record<
  RoleId,
  {
    name: string;
    perspective: string;
    probe: string;
    proof: string;
  }
> = {
  buyer: {
    name: "Customer",
    perspective: "Test what can actually be bought.",
    probe: "Availability, timing, exceptions",
    proof: "Original reply and source",
  },
  supplier: {
    name: "Supplier",
    perspective: "Test what can actually be supplied.",
    probe: "Capacity, frequency, coverage",
    proof: "Terms and authorized correspondence",
  },
  competitor: {
    name: "Competitor",
    perspective: "Compare every operator with one method.",
    probe: "Price, location, fulfillment",
    proof: "Matched public captures",
  },
  skeptic: {
    name: "Skeptic",
    perspective: "Try to break the current thesis.",
    probe: "Conflicts, seasonality, alternatives",
    proof: "A record that could change the decision",
  },
};

const chineseRoles: typeof englishRoles = {
  buyer: {
    name: "客户",
    perspective: "验证实际可以买到什么。",
    probe: "库存、时间、例外",
    proof: "原始回复与来源",
  },
  supplier: {
    name: "供应商",
    perspective: "验证实际可以供应什么。",
    probe: "产能、频率、覆盖",
    proof: "条款与授权沟通",
  },
  competitor: {
    name: "竞品",
    perspective: "用同一方法比较每个经营者。",
    probe: "价格、位置、履约",
    proof: "同口径公开快照",
  },
  skeptic: {
    name: "挑战者",
    perspective: "尝试推翻当前判断。",
    probe: "冲突、季节性、替代解释",
    proof: "足以改变决策的凭证",
  },
};

export function LandingRoleStage() {
  const { locale } = useI18n();
  const [activeRole, setActiveRole] = useState<RoleId>("buyer");
  const selected =
    roleBlueprints.find((role) => role.id === activeRole) ?? roleBlueprints[0];
  const localizedRoles = locale === "en" ? englishRoles : chineseRoles;
  const selectedCopy = localizedRoles[selected.id];

  function moveTab(current: RoleId, direction: -1 | 1) {
    const currentIndex = roleBlueprints.findIndex(
      (role) => role.id === current,
    );
    const nextIndex =
      (currentIndex + direction + roleBlueprints.length) %
      roleBlueprints.length;
    const nextRole = roleBlueprints[nextIndex];
    setActiveRole(nextRole.id);
    window.requestAnimationFrame(() => {
      document.getElementById(`role-tab-${nextRole.id}`)?.focus();
    });
  }

  return (
    <div className="role-stage">
      <div
        className="role-stage-list"
        role="tablist"
        aria-label={locale === "en" ? "Research role examples" : "调查角色示例"}
      >
        {roleBlueprints.map((role) => {
          const isActive = role.id === selected.id;
          const roleName = localizedRoles[role.id].name;
          return (
            <button
              aria-controls={`role-panel-${role.id}`}
              aria-selected={isActive}
              className={isActive ? "active" : ""}
              id={`role-tab-${role.id}`}
              key={role.id}
              onKeyDown={(event) => {
                if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                  event.preventDefault();
                  moveTab(role.id, 1);
                }
                if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                  event.preventDefault();
                  moveTab(role.id, -1);
                }
                if (event.key === "Home" || event.key === "End") {
                  event.preventDefault();
                  const nextRole =
                    event.key === "Home"
                      ? roleBlueprints[0]
                      : roleBlueprints[roleBlueprints.length - 1];
                  setActiveRole(nextRole.id);
                  window.requestAnimationFrame(() => {
                    document.getElementById(`role-tab-${nextRole.id}`)?.focus();
                  });
                }
              }}
              onClick={() => setActiveRole(role.id)}
              role="tab"
              tabIndex={isActive ? 0 : -1}
              type="button"
            >
              <LrwaSignal size={30} variant={role.id} />
              <span>
                <small>{role.code}</small>
                <strong>{roleName}</strong>
              </span>
            </button>
          );
        })}
      </div>

      <article
        aria-labelledby={`role-tab-${selected.id}`}
        className="role-stage-panel"
        data-role={selected.id}
        id={`role-panel-${selected.id}`}
        key={selected.id}
        role="tabpanel"
      >
        <div className="role-stage-visual" aria-hidden>
          <Image
            alt=""
            className="role-stage-visual-image"
            fill
            sizes="(max-width: 720px) 100vw, 620px"
            src="/lrwa-role-dossiers-v2.webp"
            unoptimized
          />
          <div className="role-stage-visual-shade" />
          <div className="role-stage-visual-mark">
            <LrwaSignal size={54} variant={selected.id} />
          </div>
          <span className="role-stage-coordinate">
            {selected.code} / LOCAL DOSSIER
          </span>
        </div>

        <div className="role-stage-console">
          <div className="role-stage-panel-head">
            <p>
              {locale === "en"
                ? "METHOD PREVIEW / NOT EXECUTED"
                : "方法预览 / 尚未执行"}
            </p>
            <div>
              <span>lrwa://local/{selected.id}</span>
              <strong>{locale === "en" ? "NETWORK OFF" : "网络关闭"}</strong>
            </div>
          </div>
          <h3>{selectedCopy.perspective}</h3>
          <dl className="role-stage-brief">
            <div>
              <dt>{locale === "en" ? "PROBE" : "追问"}</dt>
              <dd>{selectedCopy.probe}</dd>
            </div>
            <div>
              <dt>{locale === "en" ? "PROOF" : "留证"}</dt>
              <dd>{selectedCopy.proof}</dd>
            </div>
          </dl>
          <ol
            className="role-stage-trace"
            aria-label={
              locale === "en"
                ? "Local method preview events"
                : "本地方法预览事件"
            }
          >
            <li>
              <span>01 / LOCAL</span>
              <code>claim.received</code>
              <small>{locale === "en" ? "preview only" : "仅供预览"}</small>
            </li>
            <li>
              <span>02 / ROLE</span>
              <code>mission.{selected.id}.staged</code>
              <small>{selectedCopy.probe}</small>
            </li>
            <li className="current">
              <span>03 / GATE</span>
              <code>receipt.required</code>
              <small>
                {locale === "en"
                  ? "0 sends · conclusion locked"
                  : "0 次发送 · 结论锁定"}
              </small>
              <i aria-hidden />
            </li>
          </ol>
        </div>
      </article>
    </div>
  );
}
