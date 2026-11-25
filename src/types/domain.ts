export type Sex = "female" | "male" | "unknown";
export type LivingStatus = "alive" | "deceased" | "unknown";
export type TriState = "yes" | "no" | "unknown";
export type EvidenceStatus = "confirmed" | "reported" | "suspected" | "unknown";
export type FindingLevel = "meets" | "discuss" | "none";
export type ReviewStatus = "demonstration" | "pending_review" | "approved";

export type RelationRole =
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
  | "paternal_uncle"
  | "spouse"
  | "other";

export type ConditionCategory =
  | "cardiovascular"
  | "metabolic"
  | "cancer"
  | "neurological"
  | "other";

export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  sex: Sex;
  birthDate: string | null;
  approximateAge: number | null;
  livingStatus: LivingStatus;
  notes: string;
  relationHint: RelationRole;
  createdAt: string;
  updatedAt: string;
}

export interface Relationship {
  id: string;
  fromPersonId: string;
  toPersonId: string;
  type: "parent_of" | "spouse_of";
  createdAt: string;
}

export interface ConditionDef {
  id: string;
  label: string;
  category: ConditionCategory;
}

export interface MedicalHistoryEntry {
  id: string;
  personId: string;
  conditionId: string;
  evidenceStatus: EvidenceStatus;
  ageAtDiagnosis: number | null;
  approximateDiagnosisAge: boolean;
  source: "family_report" | "medical_document" | "other" | "unknown";
  notes: string;
  recordedAt: string;
  updatedAt: string;
}

export interface RuleStep {
  id: string;
  label: string;
  result: TriState;
  detail: string;
}

export interface Finding {
  id: string;
  assessmentId: string;
  ruleId: string;
  ruleName: string;
  ruleVersion: string;
  level: FindingLevel;
  summary: string;
  steps: RuleStep[];
  triggeredPersonIds: string[];
  missingFacts: string[];
  reviewStatus: ReviewStatus;
  createdAt: string;
}

export interface Assessment {
  id: string;
  createdAt: string;
  ruleSetVersion: string;
  inputFingerprint: string;
  findingIds: string[];
  outdated: boolean;
}

export interface AppSettings {
  id: "settings";
  language: "en" | "rw" | "fr";
  onboardingDone: boolean;
}
