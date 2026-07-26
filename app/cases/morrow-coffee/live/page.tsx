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
      description="Six specialist agents coordinate 1,024 parameterized probes. Language models plan and challenge; deterministic code calculates evidence scores, intervals and hashes."
    >
      <LiveMission />
    </WorkspaceShell>
  );
}
