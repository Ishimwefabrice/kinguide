import type { FindingLevel, Person, ReviewStatus, RuleStep, TriState } from "@/types/domain";
import type { MedicalHistoryEntry } from "@/types/domain";

export interface FamilyContext {
  persons: Person[];
  history: MedicalHistoryEntry[];
}

export interface EngineFinding {
  ruleId: string;
  ruleName: string;
  ruleVersion: string;
  level: FindingLevel;
  summary: string;
  steps: RuleStep[];
  triggeredPersonIds: string[];
  missingFacts: string[];
  reviewStatus: ReviewStatus;
}

export interface EducationalRule {
  id: string;
  name: string;
  version: string;
  description: string;
  sourceOrganization: string;
  sourceDocument: string;
  sourceDate: string;
  reviewStatus: ReviewStatus;
  evaluate: (ctx: FamilyContext) => EngineFinding;
}

export type { TriState };
