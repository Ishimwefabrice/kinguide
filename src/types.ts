export type Sex = "female" | "male" | "unknown";

export type ConditionId =
  | "breast_cancer"
  | "ovarian_cancer"
  | "colorectal_cancer"
  | "early_heart_attack"
  | "high_cholesterol";

export type Relation =
  | "self"
  | "mother"
  | "father"
  | "sister"
  | "brother"
  | "daughter"
  | "son"
  | "maternal_grandmother"
  | "maternal_grandfather"
  | "paternal_grandmother"
  | "paternal_grandfather"
  | "maternal_aunt"
  | "maternal_uncle"
  | "paternal_aunt"
  | "paternal_uncle";

export type TriState = "yes" | "no" | "unknown";

export interface Condition {
  id: ConditionId;
  ageAtDiagnosis: number | null;
  note?: string;
}

export interface Person {
  id: string;
  name: string;
  relation: Relation;
  sex: Sex;
  living: TriState;
  age: number | null;
  conditions: Condition[];
}

export type FindingLevel = "meets" | "discuss" | "none";

export interface RuleStep {
  id: string;
  label: string;
  result: TriState;
  detail: string;
}

export interface Finding {
  guidelineId: string;
  guidelineTitle: string;
  level: FindingLevel;
  summary: string;
  steps: RuleStep[];
  triggeredPersonIds: string[];
  missingFacts: string[];
}

export interface Guideline {
  id: string;
  title: string;
  area: string;
  source: string;
  disclaimer: string;
  evaluate: (people: Person[]) => Finding;
}
