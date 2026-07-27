"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button, Checkbox, InlineNotification } from "@carbon/react";
import {
  ArrowRight,
  Checkmark,
  Copy,
  Locked,
  Task,
} from "@carbon/icons-react";
import { missionStatusLabels } from "@/lib/investigation";
import { useInvestigation } from "@/lib/use-investigation";

export function DecisionActions() {
  const { record, isHydrated } = useInvestigation();
  const [selected, setSelected] = useState<string[]>([]);
  const [copyState, setCopyState] = useState<"idle" | "success" | "error">(
    "idle",
  );

  const actions = useMemo(() => {
    if (!record) {
      return [];
    }
    return record.missions.map((mission) => {
      switch (mission.status) {
        case "planned":
          return {
            id: mission.id,
            role: mission.name,
            status: "待审核",
            title: `审核${mission.name}的首轮询问与身份边界`,
            closes: mission.objective,
          };
        case "prepared":
          return {
            id: mission.id,
            role: mission.name,
            status: "待发送",
            title: `从真实、授权的渠道发出${mission.name}询问`,
            closes: mission.receipt,
          };
        case "contacted":
          return {
            id: mission.id,
            role: mission.name,
            status: "待回执",
            title: `等待并记录${mission.name}的真实回复`,
            closes: mission.receipt,
          };
        case "evidence_received":
          return {
            id: mission.id,
            role: mission.name,
            status: "待复核",
            title: `复核${mission.name}回执的来源与代表性`,
            closes: "确认来源、时间、上下文和是否需要第二条证据。",
          };
      }
    });
  }, [record]);

  function toggleAction(id: string, checked: boolean) {
    setSelected((current) =>
      checked
        ? [...new Set([...current, id])]
        : current.filter((item) => item !== id),
    );
  }

  async function copyActions() {
    const chosen = actions.filter((action) => selected.includes(action.id));
    if (!chosen.length) {
      return;
    }
    try {
      await navigator.clipboard.writeText(
        chosen
          .map(
            (action, index) =>
              `${index + 1}. ${action.title}\n   需要解决：${action.closes}`,
          )
          .join("\n\n"),
      );
      setCopyState("success");
    } catch {
      setCopyState("error");
    }
  }

  if (!isHydrated) {
    return (
      <div className="truthful-loading" role="status">
        正在读取跟进动作
      </div>
    );
  }

  if (!record) {
    return (
      <section className="honest-empty-state">
        <Task size={42} aria-hidden />
        <p>NO INVESTIGATION DRAFT</p>
        <h2>没有调查，就没有跟进动作。</h2>
        <span>先定义一个商业主张，让每个下一步都对应真实的不确定性。</span>
        <Link className="cinematic-primary" href="/investigations">
          定义主张
          <ArrowRight size={20} aria-hidden />
        </Link>
      </section>
    );
  }

  const coveredRoles = new Set(record.evidence.map((item) => item.roleId));
  const reviewReady = coveredRoles.size >= 2;

  return (
    <div className="next-action-workspace">
      <section className="decision-gate">
        <div>
          <p>DECISION GATE</p>
          <h2>{reviewReady ? "进入人工复核，不自动下结论。" : "继续求证，不生成研报。"}</h2>
          <span>
            {reviewReady
              ? "多个角色已有用户录入回执，下一步是核验来源与冲突。"
              : "当前证据覆盖不足，任何财务估算都将保持锁定。"}
          </span>
        </div>
        <div>
          {reviewReady ? (
            <Checkmark size={30} aria-hidden />
          ) : (
            <Locked size={30} aria-hidden />
          )}
          <strong>{reviewReady ? "HUMAN REVIEW" : "NO CONCLUSION"}</strong>
        </div>
      </section>

      <div className="next-action-grid">
        <section className="action-queue panel" aria-labelledby="queue-title">
          <header className="action-queue-heading">
            <div>
              <p>NEXT EVIDENCE REQUESTS</p>
              <h2 id="queue-title">下一轮动作</h2>
            </div>
            <span>由当前真实状态生成</span>
          </header>
          <div className="truthful-action-list">
            {actions.map((action) => (
              <article key={action.id}>
                <Checkbox
                  checked={selected.includes(action.id)}
                  hideLabel
                  id={`action-${action.id}`}
                  labelText={`选择动作：${action.title}`}
                  onChange={(_, state) =>
                    toggleAction(action.id, state.checked)
                  }
                />
                <div className="truthful-action-status">
                  <span>{action.role}</span>
                  <strong>{action.status}</strong>
                </div>
                <div>
                  <h3>{action.title}</h3>
                  <p>{action.closes}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="action-queue-controls">
            <Button
              disabled={selected.length === 0}
              kind="primary"
              onClick={copyActions}
              renderIcon={Copy}
            >
              复制所选动作
            </Button>
            <Link className="text-link" href="/investigations/workbench">
              返回角色任务台
              <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
          {copyState !== "idle" && (
            <InlineNotification
              hideCloseButton
              kind={copyState === "success" ? "success" : "error"}
              lowContrast
              subtitle={
                copyState === "success"
                  ? "动作已复制。系统没有向任何人发送消息。"
                  : "浏览器没有允许复制，请手动选择文本。"
              }
              title={copyState === "success" ? "已复制" : "未复制"}
            />
          )}
        </section>

        <aside className="action-context">
          <p>CURRENT STATE</p>
          <h2>{record.subject}</h2>
          <blockquote>{record.claim}</blockquote>
          <dl>
            <div>
              <dt>角色策略</dt>
              <dd>{record.missions.length} 条当前计划</dd>
            </div>
            <div>
              <dt>用户回执</dt>
              <dd>
                {record.evidence.length
                  ? `${record.evidence.length} 条用户录入`
                  : "尚无回执"}
              </dd>
            </div>
            <div>
              <dt>结论状态</dt>
              <dd>{reviewReady ? "待人工复核" : "保持锁定"}</dd>
            </div>
          </dl>
          <div>
            <span>角色状态</span>
            {record.missions.map((mission) => (
              <p key={mission.id}>
                <strong>{mission.name}</strong>
                {missionStatusLabels[mission.status]}
              </p>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
