"use client";

import { useState } from "react";
import {
  ArrowRight,
  Compare,
  Delivery,
  IbmWatsonDiscovery,
  ShoppingCart,
} from "@carbon/icons-react";
import { roleBlueprints, type RoleId } from "@/lib/investigation";

const roleIcons = {
  buyer: ShoppingCart,
  supplier: Delivery,
  competitor: Compare,
  skeptic: IbmWatsonDiscovery,
} as const;

export function LandingRoleStage() {
  const [activeRole, setActiveRole] = useState<RoleId>("buyer");
  const selected =
    roleBlueprints.find((role) => role.id === activeRole) ?? roleBlueprints[0];
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
      <div className="role-stage-list" role="tablist" aria-label="调查角色示例">
        {roleBlueprints.map((role) => {
          const Icon = roleIcons[role.id];
          const isActive = role.id === selected.id;
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
                    document
                      .getElementById(`role-tab-${nextRole.id}`)
                      ?.focus();
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
                <strong>{role.name}</strong>
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
          <p>方法预览 · 尚未执行</p>
        </div>
        <h3>{selected.perspective}</h3>
        <div className="role-stage-sequence">
          <div>
            <small>首轮询问</small>
            <p>{selected.opening}</p>
          </div>
          <div>
            <small>继续追问</small>
            <p>{selected.followUp}</p>
          </div>
          <div>
            <small>需要留下</small>
            <p>{selected.receipt}</p>
          </div>
        </div>
        <p className="role-stage-boundary">{selected.boundary}</p>
      </article>
    </div>
  );
}
