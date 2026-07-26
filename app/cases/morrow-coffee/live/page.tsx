import type { Metadata } from "next";
import { LiveMission } from "@/components/live-mission";
import { WorkspaceShell } from "@/components/workspace-shell";

export const metadata: Metadata = {
  title: "Live mission",
  description:
    "Watch governed agents gather and verify synthetic commercial evidence.",
};

export default function LiveMissionPage() {
  return (
    <WorkspaceShell
      activeStep="live"
      title="Watch the estimate change as evidence arrives."
      description="Specialist agents allocate a 1,024-unit parameterized probe quota. Language models plan and challenge; deterministic code calculates policy scores, scenario bands and hashes."
    >
      <LiveMission />
    </WorkspaceShell>
  );
}
