import { conditionLabel } from "@/data/conditions";
import type { MedicalHistoryEntry, Person } from "@/types/domain";

export interface MissingItem {
  id: string;
  personId: string | null;
  personName: string;
  what: string;
  why: string;
  required: boolean;
}

export function computeMissing(
  persons: Person[],
  history: MedicalHistoryEntry[],
): MissingItem[] {
  const items: MissingItem[] = [];
  const hasMother = persons.some((p) => p.relationHint === "mother");
  const hasFather = persons.some((p) => p.relationHint === "father");
  if (!hasMother) {
    items.push({
      id: "gap-mother",
      personId: null,
      personName: "Family tree",
      what: "Mother is not on the tree yet",
      why: "Many educational patterns look at first-degree relatives.",
      required: false,
    });
  }
  if (!hasFather) {
    items.push({
      id: "gap-father",
      personId: null,
      personName: "Family tree",
      what: "Father is not on the tree yet",
      why: "Many educational patterns look at first-degree relatives.",
      required: false,
    });
  }
  for (const p of persons) {
    const name = `${p.firstName} ${p.lastName}`.trim();
    if (p.livingStatus === "unknown") {
      items.push({
        id: `living-${p.id}`,
        personId: p.id,
        personName: name,
        what: "Living status is unknown",
        why: "Unknown living status is kept as UNKNOWN — never treated as healthy.",
        required: false,
      });
    }
    if (p.approximateAge == null && !p.birthDate) {
      items.push({
        id: `age-${p.id}`,
        personId: p.id,
        personName: name,
        what: "Age / birth date not provided",
        why: "Optional, but useful when reviewing family patterns.",
        required: false,
      });
    }
  }
  for (const h of history) {
    const person = persons.find((p) => p.id === h.personId);
    const name = person ? `${person.firstName} ${person.lastName}`.trim() : "Unknown person";
    if (h.ageAtDiagnosis == null) {
      items.push({
        id: `dxage-${h.id}`,
        personId: h.personId,
        personName: name,
        what: `Age at diagnosis unknown for ${conditionLabel(h.conditionId)}`,
        why: "Demo rules that use age thresholds cannot answer YES without this fact.",
        required: true,
      });
    }
    if (h.evidenceStatus === "unknown" || h.evidenceStatus === "suspected") {
      items.push({
        id: `ev-${h.id}`,
        personId: h.personId,
        personName: name,
        what: `${conditionLabel(h.conditionId)} is ${h.evidenceStatus}`,
        why: "Unconfirmed evidence stays UNKNOWN in the engine — never converted to NO.",
        required: true,
      });
    }
  }
  return items;
}
