import type { Metadata } from "next";
import { FindingsWorkspace } from "@/components/findings-workspace";
import { WorkspaceShell } from "@/components/workspace-shell";

export const metadata: Metadata = {
  title: "Findings",
  description:
    "Trace a diligence finding to synthetic evidence and replay an alternate hypothesis.",
};

export default function FindingsPage() {
  return (
    <WorkspaceShell
      activeStep="findings"
      title="A conclusion you can inspect and challenge."
      description="LRWA does not output a static research memo. Each finding remains linked to its claims, evidence categories, uncertainty and replayable alternatives."
    >
      <FindingsWorkspace />
    </WorkspaceShell>
  );
}
