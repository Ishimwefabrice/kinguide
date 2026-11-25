import { activeRules, RULE_SET_VERSION } from "./rule-registry";
import type { EngineFinding, FamilyContext } from "./rule-types";

export function evaluateFamily(ctx: FamilyContext): {
  ruleSetVersion: string;
  findings: EngineFinding[];
} {
  const findings = activeRules().map((rule) => rule.evaluate(ctx));
  return { ruleSetVersion: RULE_SET_VERSION, findings };
}

export function fingerprintInput(ctx: FamilyContext): string {
  const payload = {
    persons: ctx.persons.map((p) => ({
      id: p.id,
      updatedAt: p.updatedAt,
      livingStatus: p.livingStatus,
      approximateAge: p.approximateAge,
      sex: p.sex,
      relationHint: p.relationHint,
    })),
    history: ctx.history.map((h) => ({
      id: h.id,
      personId: h.personId,
      conditionId: h.conditionId,
      evidenceStatus: h.evidenceStatus,
      ageAtDiagnosis: h.ageAtDiagnosis,
      updatedAt: h.updatedAt,
    })),
  };
  return btoa(unescape(encodeURIComponent(JSON.stringify(payload)))).slice(0, 64);
}
