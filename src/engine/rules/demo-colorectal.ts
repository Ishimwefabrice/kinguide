import {
  ageAtCondition,
  displayName,
  firstDegreeHint,
  hasCondition,
  secondDegreeHint,
} from "../evidence";
import type { EducationalRule } from "../rule-types";

/** DEMONSTRATION — NON-CLINICAL clustering exercise. */
export const demoColorectalRule: EducationalRule = {
  id: "demo-colorectal-v1",
  name: "Demonstration: bowel cancer clustering",
  version: "1.0.0",
  description: "Fictional teaching rule for multi-relative clustering.",
  sourceOrganization: "KinGuide demonstration pack",
  sourceDocument: "NON-CLINICAL demonstration rule",
  sourceDate: "2026-11-25",
  reviewStatus: "demonstration",
  evaluate(ctx) {
    const steps = [];
    const triggered = new Set<string>();
    const missing: string[] = [];

    const crc = ctx.persons.filter((p) => hasCondition(ctx, p, "colorectal_cancer") === "yes");
    crc
      .filter((p) => ageAtCondition(ctx, p, "colorectal_cancer") == null)
      .forEach((p) =>
        missing.push(`${displayName(p)}: colorectal cancer age unknown`),
      );

    steps.push({
      id: "crc-count",
      label: "How many relatives have bowel cancer documented?",
      result: crc.length ? ("yes" as const) : ("no" as const),
      detail: crc.length
        ? `${crc.length}: ${crc.map((p) => displayName(p)).join(", ")}`
        : "None documented.",
    });
    crc.forEach((p) => triggered.add(p.id));

    const under50 = crc.filter((p) => {
      const age = ageAtCondition(ctx, p, "colorectal_cancer");
      return age != null && age < 50;
    });
    const ageUnknown = crc.some((p) => ageAtCondition(ctx, p, "colorectal_cancer") == null);

    steps.push({
      id: "crc-under-50",
      label: "At least one bowel cancer under 50? (demo threshold)",
      result: under50.length
        ? ("yes" as const)
        : ageUnknown
          ? ("unknown" as const)
          : ("no" as const),
      detail: under50.length
        ? under50
            .map((p) => `${displayName(p)} (${ageAtCondition(ctx, p, "colorectal_cancer")})`)
            .join(", ")
        : ageUnknown
          ? "Age missing for at least one case."
          : "No confirmed case under 50.",
    });

    const gens = new Set<string>();
    for (const p of crc) {
      if (p.relationHint === "self" || firstDegreeHint(p.relationHint)) gens.add("g1");
      if (secondDegreeHint(p.relationHint)) gens.add("g2");
    }

    steps.push({
      id: "two-gens",
      label: "Bowel cancer across more than one generation on the tree?",
      result: gens.size >= 2 ? ("yes" as const) : ("no" as const),
      detail:
        gens.size >= 2
          ? "Cases appear in more than one generation (demo layout)."
          : "Not clearly across generations from relation hints.",
    });

    let level: "meets" | "discuss" | "none" = "none";
    let summary =
      "Demonstration: no clustering pattern matched. Not a clinical clearance.";

    if (crc.length >= 3 && under50.length >= 1 && gens.size >= 2) {
      level = "meets";
      summary =
        "Demonstration: strong teaching cluster matched. Bring to a clinician — not a diagnosis.";
    } else if (crc.length >= 1) {
      level = "discuss";
      summary =
        "Demonstration: bowel cancer is documented or ages are incomplete. Worth discussing.";
    }

    return {
      ruleId: demoColorectalRule.id,
      ruleName: demoColorectalRule.name,
      ruleVersion: demoColorectalRule.version,
      level,
      summary,
      steps,
      triggeredPersonIds: [...triggered],
      missingFacts: missing,
      reviewStatus: "demonstration",
    };
  },
};
