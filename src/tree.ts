import type { ConditionId, Person, Relation, Sex, TriState } from "./types";

export const RELATION_LABELS: Record<Relation, string> = {
  self: "You (proband)",
  mother: "Mother",
  father: "Father",
  sister: "Sister",
  brother: "Brother",
  daughter: "Daughter",
  son: "Son",
  maternal_grandmother: "Maternal grandmother",
  maternal_grandfather: "Maternal grandfather",
  paternal_grandmother: "Paternal grandmother",
  paternal_grandfather: "Paternal grandfather",
  maternal_aunt: "Maternal aunt",
  maternal_uncle: "Maternal uncle",
  paternal_aunt: "Paternal aunt",
  paternal_uncle: "Paternal uncle",
};

export const CONDITION_LABELS: Record<ConditionId, string> = {
  breast_cancer: "Breast cancer",
  ovarian_cancer: "Ovarian cancer",
  colorectal_cancer: "Bowel / colorectal cancer",
  early_heart_attack: "Heart attack (myocardial infarction)",
  high_cholesterol: "Very high cholesterol / FH suspected",
};

export function newId(): string {
  return crypto.randomUUID();
}

export function createPerson(
  partial: Partial<Person> & Pick<Person, "relation" | "name">,
): Person {
  return {
    id: partial.id ?? newId(),
    name: partial.name,
    relation: partial.relation,
    sex: partial.sex ?? sexForRelation(partial.relation),
    living: partial.living ?? "unknown",
    age: partial.age ?? null,
    conditions: partial.conditions ?? [],
  };
}

export function sexForRelation(relation: Relation): Sex {
  if (
    relation === "mother" ||
    relation === "sister" ||
    relation === "daughter" ||
    relation === "maternal_grandmother" ||
    relation === "paternal_grandmother" ||
    relation === "maternal_aunt" ||
    relation === "paternal_aunt"
  ) {
    return "female";
  }
  if (
    relation === "father" ||
    relation === "brother" ||
    relation === "son" ||
    relation === "maternal_grandfather" ||
    relation === "paternal_grandfather" ||
    relation === "maternal_uncle" ||
    relation === "paternal_uncle"
  ) {
    return "male";
  }
  return "unknown";
}

export function firstDegree(relation: Relation): boolean {
  return ["mother", "father", "sister", "brother", "daughter", "son"].includes(
    relation,
  );
}

export function secondDegree(relation: Relation): boolean {
  return [
    "maternal_grandmother",
    "maternal_grandfather",
    "paternal_grandmother",
    "paternal_grandfather",
    "maternal_aunt",
    "maternal_uncle",
    "paternal_aunt",
    "paternal_uncle",
  ].includes(relation);
}

export function maternalSide(relation: Relation): boolean {
  return relation.startsWith("maternal_") || relation === "mother";
}

export function paternalSide(relation: Relation): boolean {
  return relation.startsWith("paternal_") || relation === "father";
}

export function hasCondition(
  person: Person,
  id: ConditionId,
): TriState {
  const hit = person.conditions.find((c) => c.id === id);
  if (!hit) return "no";
  return "yes";
}

export function ageAt(
  person: Person,
  id: ConditionId,
): number | null {
  return person.conditions.find((c) => c.id === id)?.ageAtDiagnosis ?? null;
}

export function sampleFamily(): Person[] {
  return [
    createPerson({
      name: "Aline (you)",
      relation: "self",
      sex: "female",
      living: "yes",
      age: 34,
    }),
    createPerson({
      name: "Mum",
      relation: "mother",
      living: "yes",
      age: 58,
      conditions: [{ id: "breast_cancer", ageAtDiagnosis: 38 }],
    }),
    createPerson({
      name: "Dad",
      relation: "father",
      living: "yes",
      age: 61,
      conditions: [{ id: "early_heart_attack", ageAtDiagnosis: 54 }],
    }),
    createPerson({
      name: "Maternal aunt",
      relation: "maternal_aunt",
      living: "unknown",
      age: null,
      conditions: [{ id: "ovarian_cancer", ageAtDiagnosis: null }],
    }),
    createPerson({
      name: "Paternal grandfather",
      relation: "paternal_grandfather",
      living: "no",
      age: null,
      conditions: [{ id: "colorectal_cancer", ageAtDiagnosis: 48 }],
    }),
  ];
}

export function gapsInTree(people: Person[]): string[] {
  const gaps: string[] = [];
  const hasMother = people.some((p) => p.relation === "mother");
  const hasFather = people.some((p) => p.relation === "father");
  if (!hasMother) gaps.push("Mother is not on the tree yet.");
  if (!hasFather) gaps.push("Father is not on the tree yet.");
  for (const p of people) {
    if (p.conditions.some((c) => c.ageAtDiagnosis == null)) {
      gaps.push(`${p.name}: age at diagnosis is unknown for at least one condition.`);
    }
    if (p.living === "unknown") {
      gaps.push(`${p.name}: living status is unknown.`);
    }
  }
  return gaps;
}
