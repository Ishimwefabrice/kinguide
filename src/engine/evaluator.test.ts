import { describe, expect, it } from "vitest";
import { evaluateFamily } from "./evaluator";
import { buildSampleFamily } from "@/database/sample";

describe("evaluateFamily", () => {
  it("returns demonstration findings for the sample family", () => {
    const sample = buildSampleFamily();
    const { findings, ruleSetVersion } = evaluateFamily({
      persons: sample.persons,
      history: sample.history,
    });
    expect(ruleSetVersion).toContain("demo");
    expect(findings.length).toBe(3);
    expect(findings.every((f) => f.reviewStatus === "demonstration")).toBe(true);
    const breast = findings.find((f) => f.ruleId.includes("breast"));
    expect(breast?.level).toBe("meets");
  });

  it("does not treat empty history as disease-free meets", () => {
    const sample = buildSampleFamily();
    const { findings } = evaluateFamily({
      persons: sample.persons,
      history: [],
    });
    expect(findings.every((f) => f.level === "none")).toBe(true);
  });
});
