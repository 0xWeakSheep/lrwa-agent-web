"use client";

import Link from "next/link";
import { FormEvent, useRef, useState } from "react";
import { Button, InlineNotification } from "@carbon/react";
import {
  ArrowRight,
  Checkmark,
  Edit,
  Flow,
  Locked,
  Reset,
} from "@carbon/icons-react";
import {
  clearInvestigationRecord,
  createInvestigationRecord,
  missionStatusLabels,
  modeLabels,
  roleBlueprints,
  type InvestigationRecord,
  type InvestigationMode,
  type RoleId,
} from "@/lib/investigation";
import {
  createServerInvestigation,
  EvidenceApiError,
} from "@/lib/evidence-api";
import { useInvestigation } from "@/lib/use-investigation";

const allRoleIds = roleBlueprints.map((role) => role.id);

function hasRecordedActivity(record: InvestigationRecord | null) {
  return Boolean(
    record &&
      (record.evidence.length > 0 ||
        record.missions.some(
          (mission) => mission.preparedAt || mission.contactedAt,
        )),
  );
}

export function InvestigationBrief() {
  const { record, isHydrated, commit } = useInvestigation();
  const [isEditing, setIsEditing] = useState(false);
  const [subject, setSubject] = useState("");
  const [claim, setClaim] = useState("");
  const [sourceNote, setSourceNote] = useState("");
  const [mode, setMode] = useState<InvestigationMode>("assisted_live");
  const [roleIds, setRoleIds] = useState<RoleId[]>(allRoleIds);
  const [allowModelProcessing, setAllowModelProcessing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");
  const createRequest = useRef<{
    fingerprint: string;
    idempotencyKey: string;
  } | null>(null);

  function beginEditing() {
    if (!record) {
      setIsEditing(true);
      return;
    }
    setSubject(record.subject);
    setClaim(record.claim);
    setSourceNote(record.sourceNote ?? "");
    setMode(record.mode);
    setRoleIds(record.missions.map((mission) => mission.id));
    setAllowModelProcessing(record.runtime.planning.engine === "DEEPSEEK");
    setIsEditing(true);
  }

  function toggleRole(roleId: RoleId) {
    setRoleIds((current) =>
      current.includes(roleId)
        ? current.filter((id) => id !== roleId)
        : [...current, roleId],
    );
  }

  async function submitBrief(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!subject.trim() || !claim.trim()) {
      setError("请先填写调查对象和需要验证的主张。");
      return;
    }
    if (roleIds.length === 0) {
      setError("至少选择一个调查视角。");
      return;
    }

    if (
      hasRecordedActivity(record) &&
      !window.confirm(
        "保存新草稿会清除当前的策略准备、发送确认和回执记录。确定继续吗？",
      )
    ) {
      return;
    }

    setIsCreating(true);
    const requestPayload = {
      subject: subject.trim(),
      claim: claim.trim(),
      sourceNote: sourceNote.trim() || undefined,
      mode,
      roleIds,
      allowModelProcessing,
    };
    const requestFingerprint = JSON.stringify(requestPayload);
    if (createRequest.current?.fingerprint !== requestFingerprint) {
      createRequest.current = {
        fingerprint: requestFingerprint,
        idempotencyKey: crypto.randomUUID(),
      };
    }
    try {
      const next = await createServerInvestigation({
        idempotencyKey: createRequest.current.idempotencyKey,
        ...requestPayload,
      });
      commit(next);
      createRequest.current = null;
      setIsEditing(false);
    } catch (apiError) {
      if (
        apiError instanceof EvidenceApiError &&
        apiError.kind === "unavailable"
      ) {
        const localDraft = createInvestigationRecord({
          subject,
          claim,
          sourceNote,
          mode,
          roleIds,
        });
        commit(localDraft);
        createRequest.current = null;
        setIsEditing(false);
        return;
      }
      setError(
        apiError instanceof Error
          ? apiError.message
          : "调查草稿没有创建成功。",
      );
    } finally {
      setIsCreating(false);
    }
  }

  function startOver() {
    if (
      hasRecordedActivity(record) &&
      !window.confirm(
        "当前浏览器包含策略准备、发送确认或回执记录。确定清空并重新开始吗？",
      )
    ) {
      return;
    }
    clearInvestigationRecord();
    setSubject("");
    setClaim("");
    setSourceNote("");
    setMode("assisted_live");
    setRoleIds(allRoleIds);
    setAllowModelProcessing(false);
    setIsEditing(true);
  }

  if (!isHydrated) {
    return (
      <div className="truthful-loading" role="status">
        正在读取本地调查草稿
      </div>
    );
  }

  if (record && !isEditing) {
    const hasConfirmedContact = record.missions.some(
      (mission) => Boolean(mission.contactedAt),
    );
    const planningLabel =
      record.runtime.planning.mode === "LIVE"
        ? `${record.runtime.planning.model ?? "DeepSeek"} 已生成`
        : record.runtime.planning.mode === "DETERMINISTIC_FALLBACK"
          ? "本地模板 · 模型未完成"
          : "本地模板 · 未调用模型";

    return (
      <div className="brief-review">
        {record.runtime.connection !== "server_connected" && (
          <InlineNotification
            hideCloseButton
            kind="warning"
            lowContrast
            subtitle={
              record.runtime.connection === "server_sync_failed"
                ? "服务端同步失败。当前页面显示的是浏览器记录，没有外部动作被系统补做。"
                : record.runtime.connection === "server_sync_unknown"
                  ? "浏览器没有收到服务端确认。请把同步状态视为未知，不要据此重复外部行动。"
                : "后端当前不可达，已建立浏览器草稿。没有调用 DeepSeek，也没有连接外部平台。"
            }
            title="当前为本地模式"
          />
        )}
        <section className="brief-truth-bar" aria-label="当前真实状态">
          <div>
            <span>当前状态</span>
            <strong>
              {hasConfirmedContact
                ? "包含用户确认的发送动作"
                : record.evidence.length
                  ? "已录入回执，未记录发送动作"
                  : "尚未确认任何外部发送"}
            </strong>
          </div>
          <div>
            <span>证据账本</span>
            <strong>
              {record.evidence.length
                ? `${record.evidence.length} 条用户录入回执`
                : "尚无用户回执"}
            </strong>
          </div>
          <div>
            <span>运行方式</span>
            <strong>{modeLabels[record.mode]}</strong>
          </div>
          <div>
            <span>策略来源</span>
            <strong>{planningLabel}</strong>
          </div>
        </section>

        <div className="brief-review-grid">
          <section className="claim-focus" aria-labelledby="claim-focus-title">
            <div className="claim-focus-head">
              <p>CLAIM UNDER TEST</p>
              <div>
                <Button
                  kind="ghost"
                  onClick={beginEditing}
                  renderIcon={Edit}
                  size="sm"
                >
                  修改
                </Button>
                <Button
                  kind="ghost"
                  onClick={startOver}
                  renderIcon={Reset}
                  size="sm"
                >
                  新建
                </Button>
              </div>
            </div>
            <span>{record.subject}</span>
            <h2 id="claim-focus-title">{record.claim}</h2>
            {record.sourceNote && (
              <p className="claim-source-note">
                主张来源线索：{record.sourceNote}
              </p>
            )}
            <div className="claim-lock">
              <Locked size={18} aria-hidden />
              <p>
                目前只建立了调查问题。没有证据支持或反对这项主张。
              </p>
            </div>
          </section>

          <aside className="mission-logic">
            <p>MISSION LOGIC</p>
            <div>
              <Flow size={22} aria-hidden />
              <span>角色给出观察角度</span>
            </div>
            <div>
              <ArrowRight size={18} aria-hidden />
              <span>追问把模糊回答落到事实</span>
            </div>
            <div>
              <Checkmark size={18} aria-hidden />
              <span>只有回执进入证据账本</span>
            </div>
          </aside>
        </div>

        <section className="mission-plan" aria-labelledby="mission-plan-title">
          <div className="mission-plan-heading">
            <div>
              <p>ROLE ROUTES</p>
              <h2 id="mission-plan-title">角色调查路径</h2>
            </div>
            <span>以下均为计划，不代表已经执行</span>
          </div>
          <div className="mission-route-list">
            {record.missions.map((mission) => (
              <article key={mission.id}>
                <div className="mission-route-code">{mission.code}</div>
                <div>
                  <h3>{mission.name}</h3>
                  <p>{mission.perspective}</p>
                </div>
                <span className={`mission-state ${mission.status}`}>
                  {missionStatusLabels[mission.status]}
                </span>
                <p>{mission.objective}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="workspace-next">
          <div>
            <span>下一步</span>
            <strong>逐条审核询问策略，再决定是否从授权渠道发送。</strong>
          </div>
          <Link
            className="cinematic-primary"
            href="/investigations/workbench"
          >
            进入角色任务台
            <ArrowRight size={20} aria-hidden />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form className="brief-builder" onSubmit={submitBrief}>
      <section className="brief-form-main">
        <div className="brief-form-intro">
          <p>NEW INVESTIGATION</p>
          <h2>先写下一个值得被证伪的主张。</h2>
          <span>
            这里不会自动查询外部数据，也不会预填任何调查结果。
          </span>
        </div>

        <label className="evidence-field">
          <span>调查对象</span>
          <input
            autoComplete="off"
            maxLength={160}
            name="subject"
            onChange={(event) => setSubject(event.target.value)}
            placeholder="例如：某连锁品牌"
            required
            value={subject}
          />
        </label>

        <label className="evidence-field evidence-field-large">
          <span>需要验证的主张</span>
          <textarea
            maxLength={1200}
            name="claim"
            onChange={(event) => setClaim(event.target.value)}
            placeholder="例如：该品牌声称所有公开门店均在正常营业"
            required
            rows={4}
            value={claim}
          />
        </label>

        <label className="evidence-field">
          <span>主张来源线索，可选</span>
          <input
            autoComplete="off"
            maxLength={500}
            name="sourceNote"
            onChange={(event) => setSourceNote(event.target.value)}
            placeholder="网页、材料名称或客户说明"
            value={sourceNote}
          />
        </label>

        <fieldset className="mode-selector">
          <legend>运行方式</legend>
          {(
            [
              [
                "assisted_live",
                "人工协作调查",
                "AI 起草，用户审核并从真实渠道发送",
              ],
              [
                "authorized_connector",
                "授权数据连接 · 未配置",
                "取得正式合作权限后开放",
              ],
              [
                "simulation_lab",
                "方法模拟实验",
                "只演示调查方法，不产生真实证据",
              ],
            ] as const
          ).map(([value, label, detail]) => {
            const unavailable = value === "authorized_connector";
            return (
              <button
                aria-pressed={mode === value}
                className={mode === value ? "active" : ""}
                disabled={unavailable}
                key={value}
                onClick={() => setMode(value)}
                type="button"
              >
                <strong>{label}</strong>
                <span>{detail}</span>
              </button>
            );
          })}
        </fieldset>

        <label className="model-processing-choice">
          <input
            checked={allowModelProcessing}
            name="allowModelProcessing"
            onChange={(event) =>
              setAllowModelProcessing(event.target.checked)
            }
            type="checkbox"
          />
          <span>
            <strong>允许 DeepSeek 生成待审核策略</strong>
            <small>
              开启后，调查对象、主张和来源线索会发到后端配置的
              DeepSeek；模型仍不能生成证据或结论。
            </small>
          </span>
        </label>
      </section>

      <aside className="brief-role-picker">
        <div>
          <p>INVESTIGATION ANGLES</p>
          <h2>选择调查视角</h2>
          <span>选中只代表加入计划。</span>
        </div>
        <div className="role-picker-list">
          {roleBlueprints.map((role) => {
            const selected = roleIds.includes(role.id);
            return (
              <button
                aria-pressed={selected}
                className={selected ? "selected" : ""}
                key={role.id}
                onClick={() => toggleRole(role.id)}
                type="button"
              >
                <span>{role.code}</span>
                <div>
                  <strong>{role.name}</strong>
                  <small>{role.perspective}</small>
                </div>
                <Checkmark size={18} aria-hidden />
              </button>
            );
          })}
        </div>

        {error && (
          <InlineNotification
            hideCloseButton
            kind="error"
            lowContrast
            subtitle={error}
            title="还不能生成计划"
          />
        )}

        <Button
          disabled={isCreating}
          kind="primary"
          renderIcon={ArrowRight}
          type="submit"
        >
          {isCreating ? "正在建立草稿" : "生成调查路径"}
        </Button>
        <p className="local-only-note">
          优先写入本地证据服务；服务不可用时会明确降级为浏览器草稿。
        </p>
      </aside>
    </form>
  );
}
