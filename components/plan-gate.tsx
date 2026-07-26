"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, InlineNotification } from "@carbon/react";
import {
  ArrowRight,
  CheckmarkFilled,
  Locked,
  Play,
} from "@carbon/icons-react";
import { launchDemoInvestigation } from "@/lib/api";

type LaunchState = "idle" | "launching" | "error";

export function PlanGate() {
  const router = useRouter();
  const [launchState, setLaunchState] = useState<LaunchState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function startMission() {
    setLaunchState("launching");
    setErrorMessage("");

    try {
      const session = await launchDemoInvestigation();
      window.localStorage.setItem("lrwa-investigation-id", session.id);
      window.localStorage.setItem("lrwa-api-mode", session.mode);
      router.push(
        `/cases/morrow-coffee/live?investigationId=${encodeURIComponent(session.id)}`,
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "The mission could not be started.",
      );
      setLaunchState("error");
    }
  }

  return (
    <aside className="approval-panel" aria-labelledby="approval-title">
      <div className="approval-heading">
        <span className="approval-icon">
          <Locked size={20} aria-hidden />
        </span>
        <div>
          <p className="mono-label">DEMO INTERACTION GATE</p>
          <h2 id="approval-title">Start this bounded synthetic mission</h2>
        </div>
      </div>

      <div className="approval-summary">
        <div>
          <span>Planned probe quota</span>
          <strong>1,024</strong>
        </div>
        <div>
          <span>Credit ceiling</span>
          <strong>64</strong>
        </div>
        <div>
          <span>Random seed</span>
          <strong>240727</strong>
        </div>
      </div>

      <ul className="approval-checks">
        <li>
          <CheckmarkFilled size={16} aria-hidden />
          Synthetic reality twin only
        </li>
        <li>
          <CheckmarkFilled size={16} aria-hidden />
          No real merchant or individual contact
        </li>
        <li>
          <CheckmarkFilled size={16} aria-hidden />
          Every artifact logged with source and hash
        </li>
      </ul>

      {launchState === "error" && (
        <InlineNotification
          kind="error"
          lowContrast
          hideCloseButton
          title="Mission start failed"
          subtitle={errorMessage}
        />
      )}

      <Button
        className="approve-button"
        disabled={launchState === "launching"}
        kind="primary"
        onClick={startMission}
        renderIcon={launchState === "launching" ? Play : ArrowRight}
      >
        {launchState === "launching"
          ? "Starting mission..."
          : "Start synthetic mission"}
      </Button>
      <p className="approval-note">
        This unauthenticated demo interaction is not a production approval
        control. If the API is unavailable, LRWA switches to the same
        deterministic local simulation and marks the runtime mode.
      </p>
    </aside>
  );
}
