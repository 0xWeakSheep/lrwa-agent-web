"use client";

import { useCallback, useEffect, useState } from "react";
import {
  loadInvestigationRecord,
  saveInvestigationRecord,
  type InvestigationRecord,
} from "./investigation";

export function useInvestigation() {
  const [record, setRecord] = useState<InvestigationRecord | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const refresh = useCallback(() => {
    setRecord(loadInvestigationRecord());
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    const initialRead = window.setTimeout(refresh, 0);
    window.addEventListener("storage", refresh);
    window.addEventListener("lrwa-investigation-updated", refresh);
    return () => {
      window.clearTimeout(initialRead);
      window.removeEventListener("storage", refresh);
      window.removeEventListener("lrwa-investigation-updated", refresh);
    };
  }, [refresh]);

  const commit = useCallback((next: InvestigationRecord) => {
    const saved = saveInvestigationRecord(next);
    setRecord(saved);
    return saved;
  }, []);

  return { record, isHydrated, commit, refresh };
}
