import { ageAt, firstDegree, hasCondition, secondDegree } from "../tree";
import type { Finding, Guideline, Person, RuleStep } from "../types";

/**
 * Educational simplification inspired by Amsterdam II-style clustering ideas.
 * Not a clinical Lynch syndrome tool.
 */
export const colorectalGuideline: Guideline = {
  id: "colorectal-amsterdam-style",
  title: "Bowel cancer family clustering",
  area: "Cancer genetics (education)",
  source: "Inspired by Amsterdam II-style clustering (heavily simplified for teaching)",
  disclaimer:
    "Educational prototype. Does not diagnose Lynch syndrome. Discuss with a clinician.",
  evaluate(people: Person[]): Finding {
    const steps: RuleStep[] = [];
    const triggered = new Set<string>();
    const missing: string[] = [];

    const crc = people.filter((p) => hasCondition(p, "colorectal_cancer") === "yes");
    crc
      .filter((p) => ageAt(p, "colorectal_cancer") == null)
      .forEach((p) =>
        missing.push(`${p.name}: colorectal cancer age at diagnosis unknown`),
      );

    steps.push({
      id: "crc-count",
      label: "How many relatives have bowel / colorectal cancer?",
      result: crc.length >= 1 ? "yes" : "no",
      detail: crc.length ? `${crc.length}: ${crc.map((p) => p.name).join(", ")}` : "None recorded.",
    });
    crc.forEach((p) => triggered.add(p.id));

    const under50 = crc.filter((p) => {
      const age = ageAt(p, "colorectal_cancer");
      return age != null && age < 50;
    });
    const under50Unknown = crc.some((p) => ageAt(p, "colorectal_cancer") == null);

    steps.push({
      id: "crc-under-50",
      label: "At least one bowel cancer diagnosed under 50?",
      result: under50.length ? "yes" : under50Unknown ? "unknown" : "no",
      detail: under50.length
        ? under50.map((p) => `${p.name} (${ageAt(p, "colorectal_cancer")})`).join(", ")
        : under50Unknown
          ? "Age missing for at least one case."
          : "No confirmed case under 50.",
    });

    const generations = new Set<string>();
    for (const p of crc) {
      if (p.relation === "self" || firstDegree(p.relation)) generations.add("g1");
      if (secondDegree(p.relation)) generations.add("g2");
    }

    steps.push({
      id: "two-generations",
      label: "Bowel cancer across more than one generation on the tree?",
      result: generations.size >= 2 ? "yes" : crc.length ? "no" : "no",
      detail:
        generations.size >= 2
          ? "Cases appear in more than one generation."
          : "Not clearly across generations from current data.",
    });

    let level: Finding["level"] = "none";
    let summary = "No bowel-cancer clustering pattern met from the facts entered so far.";

    if (crc.length >= 3 && under50.length >= 1 && generations.size >= 2) {
      level = "meets";
      summary =
        "Family pattern meets a strong educational clustering criterion (multiple relatives, early case, more than one generation). Bring this to a clinician.";
    } else if (crc.length >= 1 && (under50.length >= 1 || under50Unknown || generations.size >= 2 || missing.length)) {
      level = "discuss";
      summary =
        "Worth discussing. There is bowel cancer on the tree, but ages or relatives may be incomplete.";
    } else if (crc.length >= 2) {
      level = "discuss";
      summary = "Two or more bowel cancer cases — worth a clinician conversation even if formal teaching criteria are not fully met.";
    }

    return {
      guidelineId: colorectalGuideline.id,
      guidelineTitle: colorectalGuideline.title,
      level,
      summary,
      steps,
      triggeredPersonIds: [...triggered],
      missingFacts: missing,
    };
  },
};
