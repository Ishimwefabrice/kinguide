import {
  ageAtCondition,
  displayName,
  firstDegreeHint,
  hasCondition,
} from "../evidence";
import type { EducationalRule, FamilyContext } from "../rule-types";

/**
 * DEMONSTRATION rule only — NON-CLINICAL.
 * Inspired by early first-degree breast-cancer teaching patterns.
 * Not an implementation of NICE or any hospital protocol.
 */
export const demoBreastOvarianRule: EducationalRule = {
  id: "demo-breast-ovarian-v1",
  name: "Demonstration: breast & ovarian family patterns",
  version: "1.0.0",
  description:
    "Fictional teaching rule to exercise the engine. Not clinical guidance.",
  sourceOrganization: "KinGuide demonstration pack",
  sourceDocument: "NON-CLINICAL demonstration rule",
  sourceDate: "2026-11-25",
  reviewStatus: "demonstration",
  evaluate(ctx: FamilyContext) {
    const steps = [];
    const triggered = new Set<string>();
    const missing: string[] = [];

    const earlyBreast = ctx.persons.filter((p) => {
      if (hasCondition(ctx, p, "breast_cancer") !== "yes") return false;
      if (!firstDegreeHint(p.relationHint) && p.relationHint !== "self") return false;
      const age = ageAtCondition(ctx, p, "breast_cancer");
      if (age == null) {
        missing.push(`${displayName(p)}: breast cancer age at diagnosis unknown`);
        return false;
      }
      return age < 40;
    });

    steps.push({
      id: "fd-breast-under-40",
      label: "First-degree relative with breast cancer under 40? (demo threshold)",
      result: earlyBreast.length
        ? ("yes" as const)
        : missing.length
          ? ("unknown" as const)
          : ("no" as const),
      detail: earlyBreast.length
        ? earlyBreast.map((p) => `${displayName(p)} (${ageAtCondition(ctx, p, "breast_cancer")})`).join(", ")
        : "No confirmed first-degree case under 40 in demo data.",
    });
    earlyBreast.forEach((p) => triggered.add(p.id));

    const ovarian = ctx.persons.filter((p) => hasCondition(ctx, p, "ovarian_cancer") === "yes");
    ovarian
      .filter((p) => ageAtCondition(ctx, p, "ovarian_cancer") == null)
      .forEach((p) =>
        missing.push(`${displayName(p)}: ovarian cancer age at diagnosis unknown`),
      );

    steps.push({
      id: "ovarian-any",
      label: "Any relative with ovarian cancer documented?",
      result: ovarian.length ? ("yes" as const) : ("no" as const),
      detail: ovarian.length
        ? ovarian.map((p) => displayName(p)).join(", ")
        : "None documented.",
    });
    ovarian.forEach((p) => triggered.add(p.id));

    const maleBreast = ctx.persons.filter(
      (p) => p.sex === "male" && hasCondition(ctx, p, "breast_cancer") === "yes",
    );
    steps.push({
      id: "male-breast",
      label: "Male relative with breast cancer?",
      result: maleBreast.length ? ("yes" as const) : ("no" as const),
      detail: maleBreast.length
        ? maleBreast.map((p) => displayName(p)).join(", ")
        : "None documented.",
    });
    maleBreast.forEach((p) => triggered.add(p.id));

    let level: "meets" | "discuss" | "none" = "none";
    let summary =
      "Demonstration: no pattern matched from available facts. This is not a clinical clearance.";

    if (earlyBreast.length || maleBreast.length) {
      level = "meets";
      summary =
        "Demonstration: configured teaching pattern matched. Discuss with a clinician — this is not a diagnosis.";
    } else if (ovarian.length || missing.length) {
      level = "discuss";
      summary =
        "Demonstration: incomplete or uncertain evidence. Worth discussing; unknown ages were not treated as healthy.";
    }

    return {
      ruleId: demoBreastOvarianRule.id,
      ruleName: demoBreastOvarianRule.name,
      ruleVersion: demoBreastOvarianRule.version,
      level,
      summary,
      steps,
      triggeredPersonIds: [...triggered],
      missingFacts: missing,
      reviewStatus: "demonstration",
    };
  },
};
