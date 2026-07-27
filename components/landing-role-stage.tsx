"use client";

import { useState } from "react";
import {
  ArrowRight,
  Compare,
  Delivery,
  IbmWatsonDiscovery,
  ShoppingCart,
} from "@carbon/icons-react";
import { useI18n } from "@/components/locale-provider";
import { roleBlueprints, type RoleId } from "@/lib/investigation";

const roleIcons = {
  buyer: ShoppingCart,
  supplier: Delivery,
  competitor: Compare,
  skeptic: IbmWatsonDiscovery,
} as const;

const englishRoles: Record<
  RoleId,
  {
    name: string;
    perspective: string;
    opening: string;
    followUp: string;
    receipt: string;
    boundary: string;
  }
> = {
  buyer: {
    name: "Customer",
    perspective:
      "Test availability, delivery and support through a real buying journey.",
    opening:
      "Ask what can actually be purchased now, where it is available, and what changes during peak demand.",
    followUp:
      "Push a template reply toward a named location, time window, fulfillment limit, and exception.",
    receipt:
      "Original support reply, availability page, capture time, and source entry point.",
    boundary:
      "Use a real authorized account. Do not invent personal details or claim an identity you do not hold.",
  },
  supplier: {
    name: "Supplier",
    perspective:
      "Test capacity, replenishment and coverage through partnership questions.",
    opening:
      "Ask about service regions, replenishment frequency, delivery batches, and acceptance requirements.",
    followUp:
      "Turn broad scale claims into frequency, region, minimum batch, and exception handling.",
    receipt:
      "Authorized correspondence, public partnership terms, or customer-provided supply records.",
    boundary:
      "Any partnership representation must come from a real authorized business entity.",
  },
  competitor: {
    name: "Competitor",
    perspective:
      "Compare stores, pricing and fulfillment with one repeatable method.",
    opening:
      "Observe the target and comparable brands using the same time window, geography, and field definitions.",
    followUp:
      "Keep missing or conflicting fields unknown. Do not fill them with an industry average.",
    receipt:
      "Public page capture, query conditions, capture time, and field definitions.",
    boundary:
      "Use only public pages that permit access or a formal data interface.",
  },
  skeptic: {
    name: "Skeptic",
    perspective:
      "Search for explanations that could overturn the current thesis.",
    opening:
      "Ask which channels, seasonal effects, or accounting choices could make the available evidence misleading.",
    followUp:
      "Convert each alternative explanation into another evidence request instead of adding it to the conclusion.",
    receipt:
      "Alternative hypothesis, required primary record, and the threshold that would change the decision.",
    boundary: "Missing evidence is not negative evidence.",
  },
};

export function LandingRoleStage() {
  const { locale } = useI18n();
  const [activeRole, setActiveRole] = useState<RoleId>("buyer");
  const selected =
    roleBlueprints.find((role) => role.id === activeRole) ?? roleBlueprints[0];
  const selectedCopy = locale === "en" ? englishRoles[selected.id] : selected;
  const SelectedIcon = roleIcons[selected.id];

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
          const Icon = roleIcons[role.id];
          const isActive = role.id === selected.id;
          const roleName =
            locale === "en" ? englishRoles[role.id].name : role.name;
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
              <Icon size={20} aria-hidden />
              <span>
                <small>{role.code}</small>
                <strong>{roleName}</strong>
              </span>
              <ArrowRight size={16} aria-hidden />
            </button>
          );
        })}
      </div>

      <article
        aria-labelledby={`role-tab-${selected.id}`}
        className="role-stage-panel"
        id={`role-panel-${selected.id}`}
        role="tabpanel"
      >
        <div className="role-stage-panel-head">
          <span>
            <SelectedIcon size={24} aria-hidden />
          </span>
          <p>
            {locale === "en"
              ? "METHOD PREVIEW / NOT EXECUTED"
              : "方法预览 / 尚未执行"}
          </p>
        </div>
        <h3>{selectedCopy.perspective}</h3>
        <div className="role-stage-sequence">
          <div>
            <small>{locale === "en" ? "OPEN" : "首轮询问"}</small>
            <p>{selectedCopy.opening}</p>
          </div>
          <div>
            <small>{locale === "en" ? "DEEPEN" : "继续追问"}</small>
            <p>{selectedCopy.followUp}</p>
          </div>
          <div>
            <small>{locale === "en" ? "RECEIPT" : "需要留下"}</small>
            <p>{selectedCopy.receipt}</p>
          </div>
        </div>
        <p className="role-stage-boundary">{selectedCopy.boundary}</p>
      </article>
    </div>
  );
}
