import { InformationFilled } from "@carbon/icons-react";

export function SyntheticLabel({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "synthetic-label compact" : "synthetic-label"}>
      <InformationFilled size={14} aria-hidden />
      <span>
        {compact
          ? "Synthetic demo data"
          : "Sandbox scenario · Fictional company · Illustrative evidence"}
      </span>
    </div>
  );
}
