"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { Button, InlineNotification } from "@carbon/react";
import {
  Add,
  ArrowRight,
  Checkmark,
  Copy,
  DataConnected,
  Information,
  SendAlt,
  WarningAlt,
} from "@carbon/icons-react";
import {
  hashEvidencePayload,
  missionStatusLabels,
  modeLabels,
  stanceLabels,
  type EvidenceStance,
  type MissionStatus,
  type RoleId,
} from "@/lib/investigation";
import {
  addServerEvidence,
  confirmServerContact,
  EvidenceApiError,
  prepareServerMission,
} from "@/lib/evidence-api";
import { useInvestigation } from "@/lib/use-investigation";

type Notice =
  | {
      kind: "success" | "error" | "info" | "warning";
      message: string;
    }
  | null;

const missionStages: Array<{
  status: MissionStatus;
  index: string;
  label: string;
}> = [
  { status: "planned", index: "01", label: "策略已建立" },
  { status: "prepared", index: "02", label: "文本已准备" },
  { status: "contacted", index: "03", label: "发送由用户确认" },
  { status: "evidence_received", index: "04", label: "回执已绑定" },
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function nextStatus(
  current: MissionStatus,
  candidate: MissionStatus,
): MissionStatus {
  const order: MissionStatus[] = [
    "planned",
    "prepared",
    "contacted",
    "evidence_received",
  ];
  return order.indexOf(candidate) > order.indexOf(current) ? candidate : current;
}

function markServerSyncState(
  record: NonNullable<ReturnType<typeof useInvestigation>["record"]>,
  connection: "server_sync_failed" | "server_sync_unknown",
) {
  return {
    ...record,
    runtime: {
      ...record.runtime,
      connection,
      storage: "browser" as const,
    },
  };
}

export function MissionWorkbench() {
  const { record, isHydrated, commit } = useInvestigation();
  const [activeRoleId, setActiveRoleId] = useState<RoleId>("buyer");
  const [showEvidenceForm, setShowEvidenceForm] = useState(false);
  const [sourceLabel, setSourceLabel] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [capturedText, setCapturedText] = useState("");
  const [stance, setStance] = useState<EvidenceStance>("context");
  const [isSaving, setIsSaving] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  const activeMission = useMemo(
    () =>
      record?.missions.find((mission) => mission.id === activeRoleId) ??
      record?.missions[0],
    [activeRoleId, record],
  );

  async function copyStrategy() {
    if (!record || !activeMission) {
      return;
    }
    const strategy = [
      `调查对象：${record.subject}`,
      `需要验证：${record.claim}`,
      "",
      `角色：${activeMission.name}`,
      `首轮询问：${activeMission.opening}`,
      `继续追问：${activeMission.followUp}`,
      `需要留存：${activeMission.receipt}`,
      `边界：${activeMission.boundary}`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(strategy);
      const localNext = {
        ...record,
        missions: record.missions.map((mission) =>
          mission.id === activeMission.id
            ? {
                ...mission,
                status: nextStatus(mission.status, "prepared"),
                preparedAt: new Date().toISOString(),
              }
            : mission,
        ),
      };
      if (record.runtime.connection === "server_connected") {
        try {
          const serverRecord = await prepareServerMission(
            record.id,
            activeMission.id,
          );
          commit(serverRecord);
        } catch (error) {
          const connection =
            error instanceof EvidenceApiError && error.kind === "unknown"
              ? "server_sync_unknown"
              : "server_sync_failed";
          commit(markServerSyncState(localNext, connection));
          setNotice({
            kind: "warning",
            message:
              connection === "server_sync_unknown"
                ? "策略已经复制；服务端同步结果未知，请不要据此重复外部行动。"
                : "策略已经复制，但服务端拒绝或无法保存；当前保留浏览器记录。",
          });
          return;
        }
      } else {
        commit(localNext);
      }
      setNotice({
        kind: "success",
        message: "策略已复制。复制不代表已经发送。",
      });
    } catch {
      setNotice({
        kind: "error",
        message: "浏览器没有允许复制，请手动选择文本。",
      });
    }
  }

  async function confirmContact() {
    if (!record || !activeMission) {
      return;
    }
    const channelLabel = window
      .prompt(
        "请填写你实际使用的授权渠道，例如“官方客服”“企业邮箱”或“公开页面观察”。",
      )
      ?.trim();
    if (!channelLabel) {
      setNotice({
        kind: "info",
        message: "没有填写实际渠道，因此未记录外部行动。",
      });
      return;
    }
    const confirmed = window.confirm(
      `只有当你确实通过“${channelLabel}”完成授权行动后才确认。是否继续？`,
    );
    if (!confirmed) {
      return;
    }
    const localNext = {
      ...record,
      missions: record.missions.map((mission) =>
        mission.id === activeMission.id
          ? {
              ...mission,
              status: nextStatus(mission.status, "contacted"),
              contactedAt: new Date().toISOString(),
              contactChannel: channelLabel,
            }
          : mission,
      ),
    };
    if (record.runtime.connection === "server_connected") {
      try {
          const serverRecord = await confirmServerContact(
            record.id,
            activeMission.id,
            channelLabel,
          );
        commit(serverRecord);
      } catch (error) {
        if (
          error instanceof EvidenceApiError &&
          error.kind === "rejected"
        ) {
          setNotice({ kind: "error", message: error.message });
          return;
        }
        const connection =
          error instanceof EvidenceApiError && error.kind === "unknown"
            ? "server_sync_unknown"
            : "server_sync_failed";
        commit(markServerSyncState(localNext, connection));
        setNotice({
          kind: "warning",
          message:
            connection === "server_sync_unknown"
              ? "已保存你的发送确认，但服务端同步结果未知。系统不会代替你重发。"
              : "已保存你的发送确认，但服务端拒绝或无法保存。系统没有代替你重发。",
        });
        return;
      }
    } else {
      commit(localNext);
    }
    setNotice({
      kind: "info",
      message: "已记录你的发送确认。系统没有代替你发送消息。",
    });
  }

  async function addEvidence(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!record || !activeMission) {
      return;
    }
    if (!sourceLabel.trim() || !capturedText.trim()) {
      setNotice({
        kind: "error",
        message: "请填写来源名称和你实际获得的回执内容。",
      });
      return;
    }
    if (record.mode === "simulation_lab") {
      setNotice({
        kind: "error",
        message: "模拟实验不能写入真实证据账本。请先建立人工协作调查。",
      });
      return;
    }
    if (!activeMission.contactedAt) {
      setNotice({
        kind: "error",
        message:
          "请先确认你已经通过真实、授权的渠道完成外部行动，再录入对应回执。",
      });
      return;
    }

    setIsSaving(true);
    setNotice(null);
    try {
      const capturedAt = new Date().toISOString();
      const payload = {
        roleId: activeMission.id,
        sourceLabel: sourceLabel.trim(),
        sourceUrl: sourceUrl.trim() || undefined,
        capturedText: capturedText.trim(),
        stance,
        capturedAt,
      };
      const evidenceId = crypto.randomUUID();
      let savedToServer = false;

      if (record.runtime.connection === "server_connected") {
        try {
          const serverRecord = await addServerEvidence(record.id, {
            id: evidenceId,
            ...payload,
          });
          commit(serverRecord);
          savedToServer = true;
        } catch (error) {
          if (
            error instanceof EvidenceApiError &&
            error.kind === "rejected"
          ) {
            throw error;
          }
          throw error;
        }
      } else {
        const contentHash = await hashEvidencePayload(payload);
        commit({
          ...record,
          missions: record.missions.map((mission) =>
            mission.id === activeMission.id
              ? {
                  ...mission,
                  status: "evidence_received",
                }
              : mission,
          ),
          evidence: [
            ...record.evidence,
            {
              id: evidenceId,
              ...payload,
              contentHash,
              authorization: "user_confirmed",
              integrityAuthority: "browser",
            },
          ],
        });
      }
      setSourceLabel("");
      setSourceUrl("");
      setCapturedText("");
      setStance("context");
      setShowEvidenceForm(false);
      setNotice({
        kind: savedToServer ? "success" : "warning",
        message: savedToServer
          ? "用户回执已写入临时服务端账本，并计算了服务端内容哈希。"
          : "用户回执只保存在浏览器，并计算了浏览器内容哈希。",
      });
    } catch (error) {
      setNotice({
        kind: "error",
        message:
          error instanceof Error
            ? error.message
            : "回执没有保存成功，请稍后再试。",
      });
    } finally {
      setIsSaving(false);
    }
  }

  if (!isHydrated) {
    return (
      <div className="truthful-loading" role="status">
        正在读取调查任务
      </div>
    );
  }

  if (!record || !activeMission) {
    return (
      <section className="honest-empty-state">
        <DataConnected size={42} aria-hidden />
        <p>NO INVESTIGATION DRAFT</p>
        <h2>还没有可以执行的调查路径。</h2>
        <span>先定义调查对象、主张和需要采用的角色视角。</span>
        <Link className="cinematic-primary" href="/investigations">
          定义主张
          <ArrowRight size={20} aria-hidden />
        </Link>
      </section>
    );
  }

  const activeStageIndex = missionStages.findIndex(
    (stage) => stage.status === activeMission.status,
  );
  const planningLabel =
    record.runtime.planning.mode === "LIVE"
      ? `${record.runtime.planning.model ?? "DeepSeek"} 实时生成`
      : record.runtime.planning.mode === "DETERMINISTIC_FALLBACK"
        ? "本地模板 · 模型未完成"
        : "本地模板 · 未调用模型";
  const storageLabel =
    record.runtime.connection === "server_connected"
      ? "临时服务端已连接"
      : record.runtime.connection === "server_sync_failed"
        ? "同步失败 · 浏览器保留"
        : record.runtime.connection === "server_sync_unknown"
          ? "同步结果未知"
          : "仅浏览器";

  return (
    <div className="mission-workbench">
      <section className="mission-source-bar" aria-label="数据连接状态">
        <div>
          <DataConnected size={18} aria-hidden />
          <span>证据服务</span>
          <strong>{storageLabel}</strong>
        </div>
        <div>
          <span>策略来源</span>
          <strong>{planningLabel}</strong>
        </div>
        <div>
          <span>外部连接</span>
          <strong>美团 / Google 未配置</strong>
        </div>
        <p>
          {modeLabels[record.mode]} · 当前不会自动访问任何第三方平台。
        </p>
      </section>

      {notice && (
        <InlineNotification
          hideCloseButton
          kind={notice.kind}
          lowContrast
          onClose={() => setNotice(null)}
          subtitle={notice.message}
          title={
            notice.kind === "success"
              ? "已记录"
              : notice.kind === "error"
                ? "未完成"
                : notice.kind === "warning"
                  ? "仅本地保留"
                : "状态说明"
          }
        />
      )}

      <section className="mission-stage-track" aria-label="当前角色阶段">
        {missionStages.map((stage, index) => (
          <div
            className={
              index < activeStageIndex
                ? "complete"
                : index === activeStageIndex
                  ? "active"
                  : ""
            }
            key={stage.status}
          >
            <span>{stage.index}</span>
            <strong>{stage.label}</strong>
            <small>
              {index < activeStageIndex
                ? "已记录"
                : index === activeStageIndex
                  ? "当前阶段"
                  : "尚未发生"}
            </small>
          </div>
        ))}
      </section>

      <div className="mission-workbench-grid">
        <aside className="mission-role-rail" aria-label="角色任务">
          <div>
            <p>ROLE MISSIONS</p>
            <h2>选择调查视角</h2>
          </div>
          <nav>
            {record.missions.map((mission) => (
              <button
                aria-current={
                  mission.id === activeMission.id ? "true" : undefined
                }
                className={
                  mission.id === activeMission.id ? "active" : ""
                }
                key={mission.id}
                onClick={() => {
                  setActiveRoleId(mission.id);
                  setShowEvidenceForm(false);
                  setNotice(null);
                }}
                type="button"
              >
                <span>{mission.code}</span>
                <div>
                  <strong>{mission.name}</strong>
                  <small>{missionStatusLabels[mission.status]}</small>
                </div>
                {mission.status === "evidence_received" && (
                  <Checkmark size={18} aria-hidden />
                )}
              </button>
            ))}
          </nav>
        </aside>

        <section className="probe-thread" aria-labelledby="probe-thread-title">
          <header>
            <div>
              <p>{activeMission.code} / STAGED PROBE</p>
              <h2 id="probe-thread-title">{activeMission.perspective}</h2>
            </div>
            <span className={`mission-state ${activeMission.status}`}>
              {missionStatusLabels[activeMission.status]}
            </span>
          </header>

          <div className="probe-objective">
            <span>调查目标</span>
            <p>{activeMission.objective}</p>
          </div>

          <ol className="probe-sequence">
            <li>
              <div>
                <span>01</span>
                <small>OPEN</small>
              </div>
              <section>
                <h3>首轮询问</h3>
                <p>{activeMission.opening}</p>
              </section>
            </li>
            <li>
              <div>
                <span>02</span>
                <small>DEEPEN</small>
              </div>
              <section>
                <h3>继续追问规则</h3>
                <p>{activeMission.followUp}</p>
              </section>
            </li>
            <li>
              <div>
                <span>03</span>
                <small>RECEIPT</small>
              </div>
              <section>
                <h3>需要留下的证据</h3>
                <p>{activeMission.receipt}</p>
              </section>
            </li>
          </ol>

          <div className="probe-boundary">
            <WarningAlt size={18} aria-hidden />
            <p>
              {activeMission.boundary}
              {activeMission.contactChannel && (
                <>
                  <br />
                  <strong>
                    用户确认渠道：{activeMission.contactChannel}
                  </strong>
                </>
              )}
            </p>
          </div>

          <div className="probe-actions">
            <Button kind="secondary" onClick={copyStrategy} renderIcon={Copy}>
              复制完整策略
            </Button>
            <Button
              disabled={
                record.mode === "simulation_lab" ||
                activeMission.status === "planned"
              }
              kind="ghost"
              onClick={confirmContact}
              renderIcon={SendAlt}
            >
              我已通过授权渠道发送
            </Button>
            <Button
              disabled={
                record.mode === "simulation_lab" ||
                !activeMission.contactedAt
              }
              kind="primary"
              onClick={() => setShowEvidenceForm((value) => !value)}
              renderIcon={Add}
            >
              记录用户回执
            </Button>
          </div>

          {showEvidenceForm && (
            <form className="evidence-capture" onSubmit={addEvidence}>
              <div className="evidence-capture-heading">
                <div>
                  <p>MANUAL RECEIPT</p>
                  <h3>录入你实际获得的内容</h3>
                </div>
                <span>不会自动补写缺失字段</span>
              </div>
              <div className="evidence-capture-grid">
                <label className="evidence-field">
                  <span>来源名称</span>
                  <input
                    autoComplete="off"
                    maxLength={240}
                    name="sourceLabel"
                    onChange={(event) => setSourceLabel(event.target.value)}
                    placeholder="例如：官方客服会话"
                    required
                    value={sourceLabel}
                  />
                </label>
                <label className="evidence-field">
                  <span>来源链接，可选</span>
                  <input
                    autoComplete="off"
                    maxLength={2000}
                    name="sourceUrl"
                    onChange={(event) => setSourceUrl(event.target.value)}
                    placeholder="https://"
                    type="url"
                    value={sourceUrl}
                  />
                </label>
              </div>
              <label className="evidence-field evidence-field-large">
                <span>实际获得的回执原文或观察记录</span>
                <textarea
                  maxLength={12000}
                  name="capturedText"
                  onChange={(event) => setCapturedText(event.target.value)}
                  placeholder="粘贴原文，并保留能够理解上下文的信息"
                  required
                  rows={5}
                  value={capturedText}
                />
              </label>
              <fieldset className="stance-selector">
                <legend>它与当前主张的关系</legend>
                {(
                  ["supports", "contradicts", "context"] as EvidenceStance[]
                ).map((value) => (
                  <button
                    aria-pressed={stance === value}
                    className={stance === value ? "active" : ""}
                    key={value}
                    onClick={() => setStance(value)}
                    type="button"
                  >
                    {stanceLabels[value]}
                  </button>
                ))}
              </fieldset>
              <div className="evidence-capture-confirm">
                <Information size={17} aria-hidden />
                <p>
                  保存表示你确认这段内容来自真实观察或真实沟通。系统只为当前内容生成指纹；只有与可信时点保存的指纹比较，才能发现变化，且不能证明来源真实。
                  请勿录入个人信息、账号凭据或未获授权的敏感材料；浏览器会保留草稿，直到你主动新建并清除。
                </p>
              </div>
              <Button
                disabled={isSaving}
                kind="primary"
                renderIcon={Checkmark}
                type="submit"
              >
                {isSaving ? "正在写入" : "确认写入证据账本"}
              </Button>
            </form>
          )}
        </section>

        <aside className="evidence-ledger-mini" aria-labelledby="mini-ledger-title">
          <header>
            <p>EVIDENCE LEDGER</p>
            <h2 id="mini-ledger-title">用户回执</h2>
          </header>
          {record.evidence.length === 0 ? (
            <div className="mini-ledger-empty">
              <span>EMPTY</span>
              <p>尚无回执。系统不会在这里生成示例数据。</p>
            </div>
          ) : (
            <div className="mini-ledger-list">
              {record.evidence
                .slice()
                .reverse()
                .map((evidence) => {
                  const role = record.missions.find(
                    (mission) => mission.id === evidence.roleId,
                  );
                  return (
                    <article key={evidence.id}>
                      <div>
                        <span>{role?.code ?? evidence.roleId}</span>
                        <small>{stanceLabels[evidence.stance]}</small>
                      </div>
                      <h3>{evidence.sourceLabel}</h3>
                      <p>{evidence.capturedText}</p>
                      <time dateTime={evidence.capturedAt}>
                        {formatDate(evidence.capturedAt)}
                      </time>
                    </article>
                  );
                })}
            </div>
          )}
          <Link
            className="text-link"
            href="/investigations/evidence"
          >
            查看完整证据账本
            <ArrowRight size={16} aria-hidden />
          </Link>
        </aside>
      </div>
    </div>
  );
}
