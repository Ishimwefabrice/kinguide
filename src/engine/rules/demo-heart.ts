import { ageAtCondition, displayName, firstDegreeHint, hasCondition } from "../evidence";
import type { EducationalRule } from "../rule-types";

/** DEMONSTRATION — NON-CLINICAL early heart-attack teaching thresholds. */
export const demoHeartRule: EducationalRule = {
  id: "demo-heart-v1",
  name: "Demonstration: early heart disease family history",
  version: "1.0.0",
  description:
    "Shows how two demo age cut-offs can disagree. Not clinical FH/NICE guidance.",
  sourceOrganization: "KinGuide demonstration pack",
  sourceDocument: "NON-CLINICAL demonstration rule",
  sourceDate: "2026-11-25",
  reviewStatus: "demonstration",
  evaluate(ctx) {
    const steps = [];
    const triggered = new Set<string>();
    const missing: string[] = [];

    const mi = ctx.persons.filter((p) => hasCondition(ctx, p, "early_heart_attack") === "yes");
    mi
      .filter((p) => ageAtCondition(ctx, p, "early_heart_attack") == null)
      .forEach((p) => missing.push(`${displayName(p)}: heart-attack age unknown`));

    steps.push({
      id: "mi-present",
      label: "Any relative with a recorded heart attack?",
      result: mi.length ? ("yes" as const) : ("no" as const),
      detail: mi.length ? mi.map((p) => displayName(p)).join(", ") : "None documented.",
    });
    mi.forEach((p) => triggered.add(p.id));

    const cutA = mi.filter((p) => {
      const age = ageAtCondition(ctx, p, "early_heart_attack");
      if (age == null) return false;
      if (p.sex === "male") return age < 60;
      if (p.sex === "female") return age < 65;
      return age < 60;
    });

    const cutB = mi.filter((p) => {
      const age = ageAtCondition(ctx, p, "early_heart_attack");
      return p.sex === "male" && age != null && age < 55;
    });

    steps.push({
      id: "cut-a",
      label: "Demo cut-off A: men <60 / women <65?",
      result: cutA.length
        ? ("yes" as const)
        : mi.some((p) => ageAtCondition(ctx, p, "early_heart_attack") == null)
          ? ("unknown" as const)
          : ("no" as const),
      detail: cutA.length
        ? cutA
            .map((p) => `${displayName(p)} (${ageAtCondition(ctx, p, "early_heart_attack")})`)
            .join(", ")
        : "No match at cut-off A.",
    });

    steps.push({
      id: "cut-b",
      label: "Demo cut-off B (stricter): male <55?",
      result: cutB.length
        ? ("yes" as const)
        : mi.some((p) => p.sex === "male" && ageAtCondition(ctx, p, "early_heart_attack") == null)
          ? ("unknown" as const)
          : ("no" as const),
      detail: cutB.length
        ? cutB
            .map((p) => `${displayName(p)} (${ageAtCondition(ctx, p, "early_heart_attack")})`)
            .join(", ")
        : "No male case under 55.",
    });

    const fh = ctx.persons.filter((p) => hasCondition(ctx, p, "high_cholesterol") === "yes");
    steps.push({
      id: "fh-flag",
      label: "Very high cholesterol / FH suspected documented?",
      result: fh.length ? ("yes" as const) : ("no" as const),
      detail: fh.length ? fh.map((p) => displayName(p)).join(", ") : "None documented.",
    });
    fh.forEach((p) => triggered.add(p.id));

    const firstDegreeEarly = cutA.filter(
      (p) => firstDegreeHint(p.relationHint) || p.relationHint === "self",
    );

    let level: "meets" | "discuss" | "none" = "none";
    let summary =
      "Demonstration: no early heart pattern matched. Not a clinical clearance.";

    if (firstDegreeEarly.length || cutB.length) {
      level = "meets";
      summary =
        "Demonstration: a teaching cut-off matched. Note cut-offs can disagree — discuss with a clinician.";
    } else if (mi.length || fh.length || missing.length) {
      level = "discuss";
      summary =
        "Demonstration: heart history or missing ages present. Worth discussing; unknown ≠ healthy.";
    }

    if (cutA.length && !cutB.length && mi.some((p) => p.sex === "male")) {
      missing.push(
        "Teaching note: a male heart attack between 55–59 can match cut-off A but miss cut-off B.",
      );
    }

    return {
      ruleId: demoHeartRule.id,
      ruleName: demoHeartRule.name,
      ruleVersion: demoHeartRule.version,
      level,
      summary,
      steps,
      triggeredPersonIds: [...triggered],
      missingFacts: missing,
      reviewStatus: "demonstration",
    };
  },
};
