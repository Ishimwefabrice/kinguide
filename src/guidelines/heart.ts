import { ageAt, firstDegree, hasCondition } from "../tree";
import type { Finding, Guideline, Person, RuleStep } from "../types";

/**
 * Educational early coronary disease / FH family-history style checks.
 * Thresholds differ by sex in some published tools; we show both for teaching.
 */
export const heartGuideline: Guideline = {
  id: "early-heart-fh-style",
  title: "Early heart disease & FH-style family history",
  area: "Cardiology (education)",
  source: "Inspired by early-onset CHD / familial hypercholesterolaemia family-history ideas",
  disclaimer:
    "Educational prototype. Does not diagnose heart disease or FH. Discuss with a clinician.",
  evaluate(people: Person[]): Finding {
    const steps: RuleStep[] = [];
    const triggered = new Set<string>();
    const missing: string[] = [];

    const mi = people.filter((p) => hasCondition(p, "early_heart_attack") === "yes");
    mi
      .filter((p) => ageAt(p, "early_heart_attack") == null)
      .forEach((p) => missing.push(`${p.name}: heart-attack age unknown`));

    const niceStyle = mi.filter((p) => {
      const age = ageAt(p, "early_heart_attack");
      if (age == null) return false;
      if (p.sex === "male") return age < 60;
      if (p.sex === "female") return age < 65;
      return age < 60;
    });

    const dutchStyleMen = mi.filter((p) => {
      const age = ageAt(p, "early_heart_attack");
      return p.sex === "male" && age != null && age < 55;
    });

    steps.push({
      id: "mi-present",
      label: "Any relative with a recorded heart attack?",
      result: mi.length ? "yes" : "no",
      detail: mi.length ? mi.map((p) => p.name).join(", ") : "None recorded.",
    });
    mi.forEach((p) => triggered.add(p.id));

    steps.push({
      id: "nice-threshold",
      label: "Early heart attack under common NICE-style ages (men <60, women <65)?",
      result: niceStyle.length
        ? "yes"
        : mi.some((p) => ageAt(p, "early_heart_attack") == null)
          ? "unknown"
          : "no",
      detail: niceStyle.length
        ? niceStyle
            .map((p) => `${p.name} (${ageAt(p, "early_heart_attack")})`)
            .join(", ")
        : "No confirmed early case at this threshold.",
    });

    steps.push({
      id: "dutch-men",
      label: "Male relative with heart attack under 55 (stricter FH-style item)?",
      result: dutchStyleMen.length
        ? "yes"
        : mi.some((p) => p.sex === "male" && ageAt(p, "early_heart_attack") == null)
          ? "unknown"
          : "no",
      detail: dutchStyleMen.length
        ? dutchStyleMen
            .map((p) => `${p.name} (${ageAt(p, "early_heart_attack")})`)
            .join(", ")
        : "No male case under 55 confirmed.",
    });

    const fh = people.filter((p) => hasCondition(p, "high_cholesterol") === "yes");
    steps.push({
      id: "fh-flag",
      label: "Very high cholesterol / FH suspected on the tree?",
      result: fh.length ? "yes" : "no",
      detail: fh.length ? fh.map((p) => p.name).join(", ") : "None recorded.",
    });
    fh.forEach((p) => triggered.add(p.id));

    const firstDegreeEarly = niceStyle.filter((p) => firstDegree(p.relation) || p.relation === "self");

    let level: Finding["level"] = "none";
    let summary = "No early heart-disease family pattern met from the facts entered so far.";

    if (firstDegreeEarly.length || dutchStyleMen.length || fh.length) {
      level = firstDegreeEarly.length || dutchStyleMen.length ? "meets" : "discuss";
      summary =
        level === "meets"
          ? "Family pattern meets an educational early-onset heart-disease criterion. Guidelines disagree on exact ages — see steps. Bring this to a clinician."
          : "Cholesterol / FH suspicion alone is worth discussing; add ages for heart attacks if known.";
    } else if (mi.length || missing.length) {
      level = "discuss";
      summary =
        "Heart-attack history is present or ages are missing. Worth discussing; incomplete ages can hide an early-onset pattern.";
    }

    // Teaching point: same father can meet one threshold and miss another
    if (niceStyle.length && !dutchStyleMen.length && mi.some((p) => p.sex === "male")) {
      missing.push(
        "Teaching note: a male heart attack between 55 and 59 can meet a NICE-style age cut-off but miss a stricter <55 FH-style item.",
      );
    }

    return {
      guidelineId: heartGuideline.id,
      guidelineTitle: heartGuideline.title,
      level,
      summary,
      steps,
      triggeredPersonIds: [...triggered],
      missingFacts: missing,
    };
  },
};
