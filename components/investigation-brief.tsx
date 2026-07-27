"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { useI18n } from "@/components/locale-provider";
import { builtInSourceNote, localizeScenario } from "@/lib/simulation-copy";
import { useInvestigation } from "@/lib/use-investigation";
import { SimulationEntry } from "./simulation-entry";

const allRoleIds = roleBlueprints.map((role) => role.id);
const builtInScenarioVariants = {
  en: localizeScenario("en"),
  zh: localizeScenario("zh"),
} as const;
const builtInSourceNoteVariants = {
  en: builtInSourceNote("en"),
  zh: builtInSourceNote("zh"),
} as const;

const englishRoleCopy: Record<
  RoleId,
  { name: string; objective: string; perspective: string }
> = {
  buyer: {
    name: "Buyer lens",
    perspective:
      "Test availability, fulfillment, and service through a genuine purchase journey",
    objective:
      "Confirm whether the public promise holds in an actual inquiry path.",
  },
  supplier: {
    name: "Supply lens",
    perspective:
      "Test replenishment, coverage, and capacity through pre-partnership questions",
    objective:
      "Check whether operating scale and supply-chain capacity explain each other.",
  },
  competitor: {
    name: "Peer sample",
    perspective:
      "Compare public stores, pricing, and fulfillment on the same basis",
    objective:
      "Build a repeatable peer sample instead of relying on the target’s own claims.",
  },
  skeptic: {
    name: "Financial challenger",
    perspective:
      "Look for alternative explanations that could overturn the current view",
    objective:
      "Turn every discrepancy into a falsifiable alternative hypothesis.",
  },
};

const englishModeLabels: Record<InvestigationMode, string> = {
  assisted_live: "Human-assisted investigation",
  authorized_connector: "Authorized data connection",
  simulation_lab: "Method simulation lab",
};

const englishMissionStatusLabels: Record<
  InvestigationRecord["missions"][number]["status"],
  string
> = {
  planned: "Strategy pending review",
  prepared: "Draft prepared",
  contacted: "User confirmed send",
  evidence_received: "Receipt recorded",
};

type BriefError =
  "missing_fields" | "missing_roles" | { message: string } | null;

function matchesBuiltInFields(
  subject: string,
  claim: string,
  sourceNote: string,
) {
  return (["en", "zh"] as const).some(
    (candidateLocale) =>
      subject === builtInScenarioVariants[candidateLocale].subject &&
      claim === builtInScenarioVariants[candidateLocale].claim &&
      sourceNote === builtInSourceNoteVariants[candidateLocale],
  );
}

function hasRecordedActivity(record: InvestigationRecord | null) {
  return Boolean(
    record &&
    (record.evidence.length > 0 ||
      record.missions.some(
        (mission) => mission.preparedAt || mission.contactedAt,
      )),
  );
}

export function InvestigationBrief({
  forceExample = false,
}: {
  forceExample?: boolean;
}) {
  const { choose, locale } = useI18n();
  const localizedScenario = localizeScenario(locale);
  const localizedSourceNote = builtInSourceNote(locale);
  const router = useRouter();
  const { record, isHydrated, commit } = useInvestigation();
  const [isEditing, setIsEditing] = useState(false);
  const [subject, setSubject] = useState(localizedScenario.subject);
  const [claim, setClaim] = useState(localizedScenario.claim);
  const [sourceNote, setSourceNote] = useState(localizedSourceNote);
  const [mode, setMode] = useState<InvestigationMode>("simulation_lab");
  const [roleIds, setRoleIds] = useState<RoleId[]>(allRoleIds);
  const [allowModelProcessing, setAllowModelProcessing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<BriefError>(null);
  const createRequest = useRef<{
    fingerprint: string;
    idempotencyKey: string;
  } | null>(null);
  const hasBuiltInFields = matchesBuiltInFields(subject, claim, sourceNote);
  const isBuiltInExample = hasBuiltInFields && mode === "simulation_lab";
  const displayedSubject = hasBuiltInFields
    ? localizedScenario.subject
    : subject;
  const displayedClaim = hasBuiltInFields ? localizedScenario.claim : claim;
  const displayedSourceNote = hasBuiltInFields
    ? localizedSourceNote
    : sourceNote;
  const errorMessage =
    error === "missing_fields"
      ? choose(
          "Enter an investigation subject and a claim to verify.",
          "请先填写调查对象和需要验证的主张。",
        )
      : error === "missing_roles"
        ? choose(
            "Select at least one investigation lens.",
            "至少选择一个调查视角。",
          )
        : error?.message;

  function loadBuiltInExample() {
    setSubject(localizedScenario.subject);
    setClaim(localizedScenario.claim);
    setSourceNote(localizedSourceNote);
    setMode("simulation_lab");
    setRoleIds(allRoleIds);
    setAllowModelProcessing(false);
    setError(null);
  }

  function clearBuiltInExample() {
    if (forceExample) {
      router.push("/investigations");
      return;
    }
    setSubject("");
    setClaim("");
    setSourceNote("");
    setMode("assisted_live");
    setRoleIds(allRoleIds);
    setAllowModelProcessing(false);
    setError(null);
  }

  function updateBuiltInAwareField(
    field: "subject" | "claim" | "sourceNote",
    value: string,
  ) {
    if (!hasBuiltInFields) {
      if (field === "subject") {
        setSubject(value);
      } else if (field === "claim") {
        setClaim(value);
      } else {
        setSourceNote(value);
      }
      return;
    }

    setSubject(field === "subject" ? value : localizedScenario.subject);
    setClaim(field === "claim" ? value : localizedScenario.claim);
    setSourceNote(field === "sourceNote" ? value : localizedSourceNote);
  }

  function selectMode(nextMode: InvestigationMode) {
    if (nextMode === "simulation_lab") {
      loadBuiltInExample();
      return;
    }
    if (hasBuiltInFields) {
      setSubject(localizedScenario.subject);
      setClaim(localizedScenario.claim);
      setSourceNote(localizedSourceNote);
    }
    setMode(nextMode);
  }

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
    setError(null);

    if (!displayedSubject.trim() || !displayedClaim.trim()) {
      setError("missing_fields");
      return;
    }
    if (roleIds.length === 0) {
      setError("missing_roles");
      return;
    }

    if (mode === "simulation_lab") {
      router.push("/investigations/simulation?start=decompose");
      return;
    }

    if (
      hasRecordedActivity(record) &&
      !window.confirm(
        choose(
          "Saving a new draft will clear the current strategy preparation, send confirmations, and receipts. Continue?",
          "保存新草稿会清除当前的策略准备、发送确认和回执记录。确定继续吗？",
        ),
      )
    ) {
      return;
    }

    setIsCreating(true);
    const requestPayload = {
      subject: displayedSubject.trim(),
      claim: displayedClaim.trim(),
      sourceNote: displayedSourceNote.trim() || undefined,
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
          subject: displayedSubject,
          claim: displayedClaim,
          sourceNote: displayedSourceNote,
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
          ? { message: apiError.message }
          : {
              message: choose(
                "The investigation draft could not be created.",
                "调查草稿没有创建成功。",
              ),
            },
      );
    } finally {
      setIsCreating(false);
    }
  }

  function startOver() {
    if (
      hasRecordedActivity(record) &&
      !window.confirm(
        choose(
          "This browser contains strategy preparation, send confirmations, or receipts. Clear them and start again?",
          "当前浏览器包含策略准备、发送确认或回执记录。确定清空并重新开始吗？",
        ),
      )
    ) {
      return;
    }
    clearInvestigationRecord();
    loadBuiltInExample();
    setIsEditing(true);
  }

  if (!isHydrated && !forceExample) {
    return (
      <div className="truthful-loading" role="status">
        {choose(
          "Reading the local investigation draft",
          "正在读取本地调查草稿",
        )}
      </div>
    );
  }

  if (record && !isEditing && !forceExample) {
    const hasConfirmedContact = record.missions.some((mission) =>
      Boolean(mission.contactedAt),
    );
    const planningLabel =
      record.runtime.planning.mode === "LIVE"
        ? choose(
            `${record.runtime.planning.model ?? "DeepSeek"} generated`,
            `${record.runtime.planning.model ?? "DeepSeek"} 已生成`,
          )
        : record.runtime.planning.mode === "DETERMINISTIC_FALLBACK"
          ? choose(
              "Local template · model did not finish",
              "本地模板 · 模型未完成",
            )
          : choose(
              "Local template · model not called",
              "本地模板 · 未调用模型",
            );

    return (
      <div className="brief-review">
        <SimulationEntry compact />
        {record.runtime.connection !== "server_connected" && (
          <InlineNotification
            hideCloseButton
            kind="warning"
            lowContrast
            subtitle={
              record.runtime.connection === "server_sync_failed"
                ? choose(
                    "Server sync failed. This page shows the browser record; the system did not perform any missing external action.",
                    "服务端同步失败。当前页面显示的是浏览器记录，没有外部动作被系统补做。",
                  )
                : record.runtime.connection === "server_sync_unknown"
                  ? choose(
                      "The browser did not receive server confirmation. Treat sync as unknown and do not repeat an external action based on this state.",
                      "浏览器没有收到服务端确认。请把同步状态视为未知，不要据此重复外部行动。",
                    )
                  : choose(
                      "The backend is unavailable, so a browser draft was created. DeepSeek was not called and no external platform was connected.",
                      "后端当前不可达，已建立浏览器草稿。没有调用 DeepSeek，也没有连接外部平台。",
                    )
            }
            title={choose("Local mode", "当前为本地模式")}
          />
        )}
        <section
          className="brief-truth-bar"
          aria-label={choose("Current truth state", "当前真实状态")}
        >
          <div>
            <span>{choose("Current state", "当前状态")}</span>
            <strong>
              {hasConfirmedContact
                ? choose(
                    "Contains a user-confirmed send action",
                    "包含用户确认的发送动作",
                  )
                : record.evidence.length
                  ? choose(
                      "Receipt recorded, no send action recorded",
                      "已录入回执，未记录发送动作",
                    )
                  : choose(
                      "No external send has been confirmed",
                      "尚未确认任何外部发送",
                    )}
            </strong>
          </div>
          <div>
            <span>{choose("Evidence ledger", "证据账本")}</span>
            <strong>
              {record.evidence.length
                ? choose(
                    `${record.evidence.length} user-recorded receipts`,
                    `${record.evidence.length} 条用户录入回执`,
                  )
                : choose("No user receipts yet", "尚无用户回执")}
            </strong>
          </div>
          <div>
            <span>{choose("Run mode", "运行方式")}</span>
            <strong>
              {locale === "en"
                ? englishModeLabels[record.mode]
                : modeLabels[record.mode]}
            </strong>
          </div>
          <div>
            <span>{choose("Strategy source", "策略来源")}</span>
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
                  {choose("Edit", "修改")}
                </Button>
                <Button
                  kind="ghost"
                  onClick={startOver}
                  renderIcon={Reset}
                  size="sm"
                >
                  {choose("New", "新建")}
                </Button>
              </div>
            </div>
            <span>{record.subject}</span>
            <h2 id="claim-focus-title">{record.claim}</h2>
            {record.sourceNote && (
              <p className="claim-source-note">
                {choose("Claim source lead: ", "主张来源线索：")}
                {record.sourceNote}
              </p>
            )}
            <div className="claim-lock">
              <Locked size={18} aria-hidden />
              <p>
                {choose(
                  "Only the investigation question exists. No evidence currently supports or contradicts this claim.",
                  "目前只建立了调查问题。没有证据支持或反对这项主张。",
                )}
              </p>
            </div>
          </section>

          <aside className="mission-logic">
            <p>MISSION LOGIC</p>
            <div>
              <Flow size={22} aria-hidden />
              <span>
                {choose("Roles define observation angles", "角色给出观察角度")}
              </span>
            </div>
            <div>
              <ArrowRight size={18} aria-hidden />
              <span>
                {choose(
                  "Follow-ups turn vague answers into facts",
                  "追问把模糊回答落到事实",
                )}
              </span>
            </div>
            <div>
              <Checkmark size={18} aria-hidden />
              <span>
                {choose(
                  "Only receipts enter the evidence ledger",
                  "只有回执进入证据账本",
                )}
              </span>
            </div>
          </aside>
        </div>

        <section className="mission-plan" aria-labelledby="mission-plan-title">
          <div className="mission-plan-heading">
            <div>
              <p>ROLE ROUTES</p>
              <h2 id="mission-plan-title">
                {choose("Role investigation routes", "角色调查路径")}
              </h2>
            </div>
            <span>
              {choose(
                "Everything below is a plan, not a completed action",
                "以下均为计划，不代表已经执行",
              )}
            </span>
          </div>
          <div className="mission-route-list">
            {record.missions.map((mission) => {
              const defaultRole = roleBlueprints.find(
                (role) => role.id === mission.id,
              );
              const englishRole = englishRoleCopy[mission.id];
              const displayedMission = {
                name:
                  locale === "en" && mission.name === defaultRole?.name
                    ? englishRole.name
                    : mission.name,
                objective:
                  locale === "en" &&
                  mission.objective === defaultRole?.objective
                    ? englishRole.objective
                    : mission.objective,
                perspective:
                  locale === "en" &&
                  mission.perspective === defaultRole?.perspective
                    ? englishRole.perspective
                    : mission.perspective,
              };
              return (
                <article key={mission.id}>
                  <div className="mission-route-code">{mission.code}</div>
                  <div>
                    <h3>{displayedMission.name}</h3>
                    <p>{displayedMission.perspective}</p>
                  </div>
                  <span className={`mission-state ${mission.status}`}>
                    {locale === "en"
                      ? englishMissionStatusLabels[mission.status]
                      : missionStatusLabels[mission.status]}
                  </span>
                  <p>{displayedMission.objective}</p>
                </article>
              );
            })}
          </div>
        </section>

        <div className="workspace-next">
          <div>
            <span>{choose("Next", "下一步")}</span>
            <strong>
              {choose(
                "Review each inquiry strategy before deciding whether to send through an authorized channel.",
                "逐条审核询问策略，再决定是否从授权渠道发送。",
              )}
            </strong>
          </div>
          <Link className="cinematic-primary" href="/investigations/workbench">
            {choose("Open role workbench", "进入角色任务台")}
            <ArrowRight size={20} aria-hidden />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      className="brief-builder"
      id="built-in-example"
      onSubmit={submitBrief}
    >
      <section className="brief-form-main">
        <div className="brief-example-state">
          <div>
            <Checkmark size={17} aria-hidden />
            <span>
              {isBuiltInExample
                ? choose("Built-in example loaded", "内置示例已直接填入")
                : choose(
                    "Editing a custom investigation",
                    "当前正在编辑自定义调查",
                  )}
            </span>
          </div>
          <button
            onClick={
              isBuiltInExample ? clearBuiltInExample : loadBuiltInExample
            }
            type="button"
          >
            {forceExample
              ? choose("Back to my investigation", "返回我的调查")
              : isBuiltInExample
                ? choose("Use my own investigation", "改成自己的调查")
                : choose("Restore built-in example", "恢复内置示例")}
          </button>
        </div>
        <div className="brief-form-intro">
          <p>
            {isBuiltInExample ? "BUILT-IN WALKTHROUGH" : "NEW INVESTIGATION"}
          </p>
          <h2>
            {isBuiltInExample
              ? choose(
                  "The example is ready. Continue when you are.",
                  "示例已经放好，直接点下一步。",
                )
              : choose(
                  "Start with a claim worth falsifying.",
                  "先写下一个值得被证伪的主张。",
                )}
          </h2>
          <span>
            {isBuiltInExample
              ? choose(
                  "Review the real subject and claim under test, then continue directly to the claim map.",
                  "先确认下方真实对象与待验证命题，再直接进入命题拆解。",
                )
              : choose(
                  "This form does not query external data or prefill investigation results.",
                  "这里不会自动查询外部数据，也不会预填任何调查结果。",
                )}
          </span>
        </div>

        <label className="evidence-field">
          <span>{choose("Investigation subject", "调查对象")}</span>
          <input
            autoComplete="off"
            maxLength={160}
            name="subject"
            onChange={(event) =>
              updateBuiltInAwareField("subject", event.target.value)
            }
            placeholder={choose("Example: a retail chain", "例如：某连锁品牌")}
            readOnly={mode === "simulation_lab"}
            required
            value={displayedSubject}
          />
        </label>

        <label className="evidence-field evidence-field-large">
          <span>{choose("Claim to verify", "需要验证的主张")}</span>
          <textarea
            maxLength={1200}
            name="claim"
            onChange={(event) =>
              updateBuiltInAwareField("claim", event.target.value)
            }
            placeholder={choose(
              "Example: the brand claims every listed store is operating",
              "例如：该品牌声称所有公开门店均在正常营业",
            )}
            readOnly={mode === "simulation_lab"}
            required
            rows={4}
            value={displayedClaim}
          />
        </label>

        <label className="evidence-field">
          <span>
            {choose("Claim source lead, optional", "主张来源线索，可选")}
          </span>
          <input
            autoComplete="off"
            maxLength={500}
            name="sourceNote"
            onChange={(event) =>
              updateBuiltInAwareField("sourceNote", event.target.value)
            }
            placeholder={choose(
              "Page, document title, or client note",
              "网页、材料名称或客户说明",
            )}
            readOnly={mode === "simulation_lab"}
            value={displayedSourceNote}
          />
        </label>

        <fieldset className="mode-selector">
          <legend>{choose("Run mode", "运行方式")}</legend>
          {(
            [
              [
                "assisted_live",
                choose("Human-assisted investigation", "人工协作调查"),
                choose(
                  "AI drafts; the user reviews and sends through a real channel",
                  "AI 起草，用户审核并从真实渠道发送",
                ),
              ],
              [
                "authorized_connector",
                choose(
                  "Authorized data connection · not configured",
                  "授权数据连接 · 未配置",
                ),
                choose(
                  "Available after formal access is granted",
                  "取得正式合作权限后开放",
                ),
              ],
              [
                "simulation_lab",
                choose("Method simulation lab", "方法模拟实验"),
                choose(
                  "Demonstrates the method without producing real evidence",
                  "只演示调查方法，不产生真实证据",
                ),
              ],
            ] as const
          ).map(([value, label, detail]) => {
            const unavailable =
              value === "authorized_connector" ||
              (forceExample && value !== "simulation_lab");
            return (
              <button
                aria-pressed={mode === value}
                className={mode === value ? "active" : ""}
                disabled={unavailable}
                key={value}
                onClick={() => selectMode(value)}
                type="button"
              >
                <strong>{label}</strong>
                <span>{detail}</span>
              </button>
            );
          })}
        </fieldset>

        {mode === "simulation_lab" ? (
          <div className="model-processing-choice simulation-only">
            <Locked size={16} aria-hidden />
            <span>
              <strong>
                {choose(
                  "This run reads the built-in frontend example only",
                  "本次只读取内置前端示例",
                )}
              </strong>
              <small>
                {choose(
                  "Continuing does not call DeepSeek, customer support, a store, or any external interface.",
                  "点击下一步不会调用 DeepSeek、客服、门店或任何外部接口。",
                )}
              </small>
            </span>
          </div>
        ) : (
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
              <strong>
                {choose(
                  "Allow DeepSeek to generate a strategy for review",
                  "允许 DeepSeek 生成待审核策略",
                )}
              </strong>
              <small>
                {choose(
                  "When enabled, the subject, claim, and source lead are sent to the backend-configured DeepSeek model. The model still cannot generate evidence or conclusions.",
                  "开启后，调查对象、主张和来源线索会发到后端配置的 DeepSeek；模型仍不能生成证据或结论。",
                )}
              </small>
            </span>
          </label>
        )}
      </section>

      <aside className="brief-role-picker">
        <div>
          <p>INVESTIGATION ANGLES</p>
          <h2>{choose("Select investigation lenses", "选择调查视角")}</h2>
          <span>
            {choose(
              "Selection only adds a lens to the plan.",
              "选中只代表加入计划。",
            )}
          </span>
        </div>
        <div className="role-picker-list">
          {roleBlueprints.map((role) => {
            const selected = roleIds.includes(role.id);
            const roleCopy = locale === "en" ? englishRoleCopy[role.id] : role;
            return (
              <button
                aria-pressed={selected}
                className={selected ? "selected" : ""}
                disabled={mode === "simulation_lab"}
                key={role.id}
                onClick={() => toggleRole(role.id)}
                type="button"
              >
                <span>{role.code}</span>
                <div>
                  <strong>{roleCopy.name}</strong>
                  <small>{roleCopy.perspective}</small>
                </div>
                <Checkmark size={18} aria-hidden />
              </button>
            );
          })}
        </div>

        {errorMessage && (
          <InlineNotification
            hideCloseButton
            kind="error"
            lowContrast
            subtitle={errorMessage}
            title={choose("The plan cannot be generated yet", "还不能生成计划")}
          />
        )}

        <Button
          disabled={isCreating}
          kind="primary"
          renderIcon={ArrowRight}
          type="submit"
        >
          {isCreating
            ? choose("Creating draft", "正在建立草稿")
            : mode === "simulation_lab"
              ? choose("Next: open the claim map", "下一步：进入命题拆解")
              : choose("Generate investigation routes", "生成调查路径")}
        </Button>
        <p className="local-only-note">
          {mode === "simulation_lab"
            ? choose(
                "This changes frontend demo steps only and writes nothing to the real evidence ledger.",
                "只切换前端演示步骤，不会写入真实证据账本。",
              )
            : choose(
                "Writes to the local evidence service first. If unavailable, it clearly falls back to a browser draft.",
                "优先写入本地证据服务；服务不可用时会明确降级为浏览器草稿。",
              )}
        </p>
      </aside>
    </form>
  );
}
