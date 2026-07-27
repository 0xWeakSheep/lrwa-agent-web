import type { Locale } from "@/lib/i18n";
import scenario from "@/lib/simulation-scenario.json";

export type LocalizedSimulationScenario = typeof scenario;

export const simulationEnglishCopy = {
  scenarios: {
    "starbucks-jingan-sandbox-v1": {
      subject: "Starbucks stores at Shanghai Jing An Kerry Centre",
      claim:
        "Verify whether “Jing An Kerry Centre Store” and “Jing An Kerry Centre 1F Store” on Starbucks China’s public pages are two separate stores that are currently operating, then determine which one can accept a 20-drink pickup order before 9:00 a.m. on a weekday.",
      boundary:
        "This is a built-in method lab. Public pages provide investigation leads only. Synthetic personas, questions, and response branches are generated locally, do not connect to external platforms, and do not establish the stores’ current status.",
      sourceNote:
        "Public sources: Starbucks China’s store page, Starbucks China’s Reserve store page, and the Shanghai Jing An Kerry Centre official site. Public fields are investigation leads only and do not establish current operating status.",
    },
  },
  sources: {
    "SRC-01": {
      label: "Starbucks China public store page",
      observedText:
        "The page lists “Jing An Kerry Centre Store” with public address and phone fields.",
      boundary:
        "A public-page lead, not proof that the store is currently operating.",
    },
    "SRC-02": {
      label: "Starbucks China Reserve public store page",
      observedText:
        "The page lists “Jing An Kerry Centre 1F Store” with public address and phone fields.",
      boundary:
        "A public-page lead, not proof that the store is currently operating.",
    },
    "SRC-03": {
      label: "Shanghai Jing An Kerry Centre official site",
      observedText:
        "Used to establish background about the Jing An Kerry Centre development and location.",
      boundary:
        "A venue background source, not proof of any specific store’s operating status.",
    },
  },
  facts: {
    "F-01": {
      label: "Store identity",
      question:
        "Do the two public names refer to two independent stores rather than alternate names for one store?",
    },
    "F-02": {
      label: "Current operation",
      question: "Are both stores operating during the target weekday morning?",
    },
    "F-03": {
      label: "Bulk pickup",
      question:
        "Which store can prepare 20 standard coffee drinks for pickup before 9:00 a.m.?",
    },
    "F-04": {
      label: "Fulfillment constraints",
      question:
        "How could order timing, payment, invoicing, or temporary stockouts change fulfillment?",
    },
  },
  phases: {
    input: {
      label: "Real input",
      shortLabel: "Input",
      protocol: "PUBLIC INPUT",
      description:
        "Read real public pages and treat visible fields as leads that still need verification.",
    },
    decompose: {
      label: "Claim map",
      shortLabel: "Map",
      protocol: "CLAIM MAP",
      description:
        "Split one broad question into identity, operation, fulfillment, and constraint gaps.",
    },
    personas: {
      label: "Synthetic personas",
      shortLabel: "Personas",
      protocol: "PERSONA COHORT",
      description:
        "Generate synthetic buyers in different contexts without creating accounts or using real identities.",
    },
    inquiries: {
      label: "Inquiry waves",
      shortLabel: "Inquiries",
      protocol: "DRAFT FAN-OUT",
      description:
        "Give each synthetic persona a distinct question to show how a batch can probe the same claim.",
    },
    branches: {
      label: "Response branches",
      shortLabel: "Branches",
      protocol: "HYPOTHESIS TREE",
      description:
        "Model possible answer categories and prepare a next probe for each category.",
    },
    gate: {
      label: "Evidence gate",
      shortLabel: "Gate",
      protocol: "EVIDENCE GATE",
      description:
        "Only real receipts can unlock a finding. This lab keeps the conclusion locked.",
    },
  },
  personas: {
    "P-01": {
      cohort: "Early commuter",
      context: "Weekday 08:10, works nearby",
      variable: "Earliest pickup time",
      inquiryDraft:
        "I need to pick up 20 Americanos before 8:45 tomorrow morning. Which Jing An Kerry Centre store should I contact, and what is the latest confirmation time?",
    },
    "P-02": {
      cohort: "Executive assistant",
      context: "Weekday 08:30, company morning meeting",
      variable: "Bulk-order capacity",
      inquiryDraft:
        "We need 20 standard coffee drinks for a company meeting, with pickup before 9:00 a.m. Which Jing An Kerry Centre store can accept the order?",
    },
    "P-03": {
      cohort: "Event producer",
      context: "Time-critical event",
      variable: "Fulfillment commitment",
      inquiryDraft:
        "If I order one day ahead, can 20 coffees be guaranteed ready before 8:50 a.m., and which entrance should I use for pickup?",
    },
    "P-04": {
      cohort: "Procurement coordinator",
      context: "Corporate payment and receipt required",
      variable: "Payment and invoice",
      inquiryDraft:
        "Does a 20-drink pickup order support corporate payment and invoicing? Should I order through the store or the mini program?",
    },
    "P-05": {
      cohort: "Guest host",
      context: "Unfamiliar with the mall layout",
      variable: "Store address distinction",
      inquiryDraft:
        "Are “Jing An Kerry Centre Store” and “Jing An Kerry Centre 1F Store” on the public pages two different stores, and where is each one?",
    },
    "P-06": {
      cohort: "Hotel concierge",
      context: "Confirming an exact location for a guest",
      variable: "Store identity",
      inquiryDraft:
        "A guest is visiting Starbucks at Jing An Kerry Centre. Are both public store names still operating, and how should the guest distinguish them?",
    },
    "P-07": {
      cohort: "Meeting organizer",
      context: "Mixed drink selection for a group",
      variable: "Menu mix",
      inquiryDraft:
        "Can a 20-drink order mix Americanos, lattes, and caffeine-free options, and would that affect pickup before 9:00 a.m.?",
    },
    "P-08": {
      cohort: "Bicycle pickup",
      context: "Short stop without entering an office tower",
      variable: "Pickup route",
      inquiryDraft:
        "Which store entrance is easier for a bicycle pickup of 20 drinks? Can the order be packed together with a specific pickup point?",
    },
    "P-09": {
      cohort: "Dietary preferences",
      context: "Several dairy substitutions",
      variable: "Customization capacity",
      inquiryDraft:
        "Several of the 20 drinks need oat milk. Can the store prepare them together before 8:45 a.m., and how early should I submit the details?",
    },
    "P-10": {
      cohort: "Urgent procurement",
      context: "Same-day decision",
      variable: "Last-minute acceptance",
      inquiryDraft:
        "If the order is only confirmed after 7:00 a.m. that morning, could 20 standard coffees still be ready before 9:00, and which store is more suitable?",
    },
    "P-11": {
      cohort: "International guest support",
      context: "Needs order details in English",
      variable: "Communication and confirmation",
      inquiryDraft:
        "Can you provide an order confirmation with the exact store name, address, and pickup time so I can forward it to an international colleague?",
    },
    "P-12": {
      cohort: "Recurring buyer",
      context: "Evaluating a fixed weekly order",
      variable: "Repeat fulfillment",
      inquiryDraft:
        "If we need 20 drinks every week, which Jing An Kerry Centre store could reliably handle morning pickup, and how should we reserve?",
    },
  },
  responseBranches: {
    "B-01": {
      label: "Clearly distinguishes two stores",
      condition:
        "If an authorized channel clearly identifies two independent stores at different locations",
      nextProbe:
        "Ask for each store’s operating hours, store identifier, and ownership of bulk orders.",
      evidenceNeeded:
        "A real receipt with source, timestamp, and store identifier",
    },
    "B-02": {
      label: "Provides only a template answer",
      condition:
        "If the answer only points to a mini program or says to contact a store without resolving the identity difference",
      nextProbe:
        "Ask whether the two public names refer to the same operating unit.",
      evidenceNeeded:
        "A real customer-service or store receipt tied to a specific store",
    },
    "B-03": {
      label: "Can accept the order, timing unclear",
      condition:
        "If the answer says a 20-drink order is possible but does not commit to completion before 9:00 a.m.",
      nextProbe:
        "Confirm the drink list, latest order time, and pickup time separately.",
      evidenceNeeded:
        "A real confirmation naming the quantity, time window, and store",
    },
    "B-04": {
      label: "Information conflicts",
      condition:
        "If different entry points disagree about store status or order capacity",
      nextProbe:
        "Escalate to direct store confirmation and preserve every conflicting receipt.",
      evidenceNeeded: "Original receipts from at least two independent sources",
    },
  },
} as const;

const chineseBuiltInSourceNote =
  "公开来源：星巴克中国门店页面、星巴克中国臻选门店页面、上海静安嘉里中心官方网站。公开字段仅作调查线索，不代表当前营业状态。";

function copyForId<T extends Record<string, object>>(
  collection: T,
  id: string,
): T[keyof T] | undefined {
  return collection[id as keyof T];
}

export function builtInSourceNote(locale: Locale): string {
  if (locale === "zh") {
    return chineseBuiltInSourceNote;
  }
  return simulationEnglishCopy.scenarios["starbucks-jingan-sandbox-v1"]
    .sourceNote;
}

export function localizeScenario(locale: Locale): LocalizedSimulationScenario {
  if (locale === "zh") {
    return scenario;
  }

  const scenarioCopy =
    simulationEnglishCopy.scenarios["starbucks-jingan-sandbox-v1"];
  return {
    ...scenario,
    subject: scenarioCopy.subject,
    claim: scenarioCopy.claim,
    boundary: scenarioCopy.boundary,
    sources: scenario.sources.map((source) => ({
      ...source,
      ...copyForId(simulationEnglishCopy.sources, source.id),
    })),
    facts: scenario.facts.map((fact) => ({
      ...fact,
      ...copyForId(simulationEnglishCopy.facts, fact.id),
    })),
    phases: scenario.phases.map((phase) => ({
      ...phase,
      ...copyForId(simulationEnglishCopy.phases, phase.id),
    })),
    personas: scenario.personas.map((persona) => ({
      ...persona,
      ...copyForId(simulationEnglishCopy.personas, persona.id),
    })),
    responseBranches: scenario.responseBranches.map((branch) => ({
      ...branch,
      ...copyForId(simulationEnglishCopy.responseBranches, branch.id),
    })),
  };
}
