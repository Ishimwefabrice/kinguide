import { describe, expect, it } from "vitest";
import { createPerson } from "../tree";
import { breastOvarianGuideline } from "./breastOvarian";
import { colorectalGuideline } from "./colorectal";
import { heartGuideline } from "./heart";

describe("breastOvarianGuideline", () => {
  it("meets when mother had breast cancer under 40", () => {
    const people = [
      createPerson({ name: "You", relation: "self", sex: "female" }),
      createPerson({
        name: "Mum",
        relation: "mother",
        conditions: [{ id: "breast_cancer", ageAtDiagnosis: 38 }],
      }),
    ];
    const finding = breastOvarianGuideline.evaluate(people);
    expect(finding.level).toBe("meets");
  });

  it("discusses when ovarian cancer age is unknown", () => {
    const people = [
      createPerson({ name: "You", relation: "self", sex: "female" }),
      createPerson({
        name: "Aunt",
        relation: "maternal_aunt",
        conditions: [{ id: "ovarian_cancer", ageAtDiagnosis: null }],
      }),
    ];
    const finding = breastOvarianGuideline.evaluate(people);
    expect(finding.level).toBe("discuss");
    expect(finding.missingFacts.length).toBeGreaterThan(0);
  });
});

describe("heartGuideline", () => {
  it("shows guideline disagreement for male MI at 57", () => {
    const people = [
      createPerson({ name: "You", relation: "self", sex: "female" }),
      createPerson({
        name: "Dad",
        relation: "father",
        sex: "male",
        conditions: [{ id: "early_heart_attack", ageAtDiagnosis: 57 }],
      }),
    ];
    const finding = heartGuideline.evaluate(people);
    expect(finding.level).toBe("meets");
    const nice = finding.steps.find((s) => s.id === "nice-threshold");
    const dutch = finding.steps.find((s) => s.id === "dutch-men");
    expect(nice?.result).toBe("yes");
    expect(dutch?.result).toBe("no");
  });
});

describe("colorectalGuideline", () => {
  it("returns none with empty tree", () => {
    const finding = colorectalGuideline.evaluate([]);
    expect(finding.level).toBe("none");
  });
});
