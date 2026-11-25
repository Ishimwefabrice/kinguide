import type { FamilyContext } from "./rule-types";
import type { MedicalHistoryEntry, Person, TriState } from "@/types/domain";

export function displayName(p: Person): string {
  return [p.firstName, p.lastName].filter(Boolean).join(" ").trim() || "Unnamed";
}

export function entriesFor(
  ctx: FamilyContext,
  personId: string,
  conditionId: string,
): MedicalHistoryEntry[] {
  return ctx.history.filter(
    (h) => h.personId === personId && h.conditionId === conditionId,
  );
}

export function hasCondition(
  ctx: FamilyContext,
  person: Person,
  conditionId: string,
): TriState {
  const entries = entriesFor(ctx, person.id, conditionId);
  if (entries.length === 0) return "no";
  if (entries.some((e) => e.evidenceStatus === "unknown")) return "unknown";
  if (entries.some((e) => e.evidenceStatus === "suspected")) return "unknown";
  return "yes";
}

export function ageAtCondition(
  ctx: FamilyContext,
  person: Person,
  conditionId: string,
): number | null {
  const entries = entriesFor(ctx, person.id, conditionId);
  const withAge = entries.find((e) => e.ageAtDiagnosis != null);
  return withAge?.ageAtDiagnosis ?? null;
}

export function firstDegreeHint(role: string): boolean {
  return ["mother", "father", "sister", "brother", "daughter", "son"].includes(role);
}

export function secondDegreeHint(role: string): boolean {
  return [
    "maternal_grandmother",
    "maternal_grandfather",
    "paternal_grandmother",
    "paternal_grandfather",
    "maternal_aunt",
    "maternal_uncle",
    "paternal_aunt",
    "paternal_uncle",
  ].includes(role);
}
