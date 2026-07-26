import type { Metadata } from "next";
import { DecisionActions } from "@/components/decision-actions";
import { WorkspaceShell } from "@/components/workspace-shell";

export const metadata: Metadata = {
  title: "Decision actions",
  description:
    "Convert a diligence finding into targeted evidence requests and a reproducible decision brief.",
};

export default function ActionsPage() {
  return (
    <WorkspaceShell
      activeStep="actions"
      title="Close the uncertainty that changes the decision."
      description="The output is an evidence request queue tied to each unresolved hypothesis, not a static report that stops at analysis."
    >
      <DecisionActions />
    </WorkspaceShell>
  );
}
