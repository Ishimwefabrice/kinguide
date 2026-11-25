import { ageAt, firstDegree, hasCondition, maternalSide, paternalSide } from "../tree";
import type { Finding, Guideline, Person, RuleStep } from "../types";

/**
 * Educational simplification inspired by NICE CG164-style referral patterns.
 * Not a clinical implementation of NICE. For AUCA teaching / conversation prep only.
 */
export const breastOvarianGuideline: Guideline = {
  id: "breast-ovarian-cg164-style",
  title: "Breast & ovarian family patterns",
  area: "Cancer genetics (education)",
  source: "Inspired by NICE CG164-style first-degree / early-onset patterns (simplified)",
  disclaimer:
    "Educational prototype. Does not diagnose cancer risk. Discuss findings with a clinician.",
  evaluate(people: Person[]): Finding {
    const steps: RuleStep[] = [];
    const triggered = new Set<string>();
    const missing: string[] = [];

    const mothersBreastEarly = people.filter((p) => {
      if (hasCondition(p, "breast_cancer") !== "yes") return false;
      const age = ageAt(p, "breast_cancer");
      if (age == null) {
        missing.push(`${p.name}: breast cancer age at diagnosis unknown`);
        return false;
      }
      return age < 40 && (p.relation === "mother" || firstDegree(p.relation));
    });

    steps.push({
      id: "fd-breast-under-40",
      label: "First-degree relative with breast cancer diagnosed under 40?",
      result: mothersBreastEarly.length ? "yes" : missing.length ? "unknown" : "no",
      detail: mothersBreastEarly.length
        ? mothersBreastEarly.map((p) => `${p.name} (${ageAt(p, "breast_cancer")})`).join(", ")
        : "No confirmed first-degree relative under 40.",
    });
    mothersBreastEarly.forEach((p) => triggered.add(p.id));

    const ovarianAny = people.filter((p) => hasCondition(p, "ovarian_cancer") === "yes");
    const ovarianAgeUnknown = ovarianAny.filter((p) => ageAt(p, "ovarian_cancer") == null);
    ovarianAgeUnknown.forEach((p) =>
      missing.push(`${p.name}: ovarian cancer age at diagnosis unknown`),
    );

    steps.push({
      id: "ovarian-relative",
      label: "Any relative with ovarian cancer on the tree?",
      result: ovarianAny.length ? "yes" : "no",
      detail: ovarianAny.length
        ? ovarianAny.map((p) => p.name).join(", ")
        : "No ovarian cancer recorded.",
    });
    ovarianAny.forEach((p) => triggered.add(p.id));

    const breastBothSides =
      people.some(
        (p) =>
          hasCondition(p, "breast_cancer") === "yes" &&
          (maternalSide(p.relation) || p.relation === "mother" || p.relation === "sister"),
      ) &&
      people.some(
        (p) =>
          hasCondition(p, "breast_cancer") === "yes" &&
          (paternalSide(p.relation) || p.relation === "father"),
      );

    // Father with breast cancer is rare but high signal — treat as discuss if present
    const maleBreast = people.filter(
      (p) => p.sex === "male" && hasCondition(p, "breast_cancer") === "yes",
    );
    steps.push({
      id: "male-breast",
      label: "Male relative with breast cancer?",
      result: maleBreast.length ? "yes" : "no",
      detail: maleBreast.length ? maleBreast.map((p) => p.name).join(", ") : "None recorded.",
    });
    maleBreast.forEach((p) => triggered.add(p.id));

    steps.push({
      id: "both-sides",
      label: "Breast cancer on both sides of the family?",
      result: breastBothSides ? "yes" : "no",
      detail: breastBothSides
        ? "Breast cancer appears on maternal and paternal sides."
        : "Not clearly on both sides from current data.",
    });

    const yesCount = steps.filter((s) => s.result === "yes").length;
    const unknownCount = steps.filter((s) => s.result === "unknown").length;

    let level: Finding["level"] = "none";
    let summary =
      "No breast/ovarian referral-style pattern met from the facts entered so far.";

    if (mothersBreastEarly.length || maleBreast.length || (ovarianAny.length && firstDegreeOvarian(people))) {
      level = "meets";
      summary =
        "Family pattern meets an educational referral-style criterion (early first-degree breast cancer, male breast cancer, or first-degree ovarian cancer). Bring this to a clinician.";
    } else if (ovarianAny.length || yesCount >= 1 || unknownCount >= 1 || missing.length) {
      level = "discuss";
      summary =
        "Worth discussing with a clinician. Some cancer history is present, or key ages are missing so a firm educational match cannot be made.";
    }

    return {
      guidelineId: breastOvarianGuideline.id,
      guidelineTitle: breastOvarianGuideline.title,
      level,
      summary,
      steps,
      triggeredPersonIds: [...triggered],
      missingFacts: missing,
    };
  },
};

function firstDegreeOvarian(people: Person[]): boolean {
  return people.some(
    (p) => firstDegree(p.relation) && hasCondition(p, "ovarian_cancer") === "yes",
  );
}
