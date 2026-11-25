import Dexie, { type EntityTable } from "dexie";
import type {
  AppSettings,
  Assessment,
  Finding,
  MedicalHistoryEntry,
  Person,
  Relationship,
} from "@/types/domain";

export class KinGuideDB extends Dexie {
  persons!: EntityTable<Person, "id">;
  relationships!: EntityTable<Relationship, "id">;
  medicalHistory!: EntityTable<MedicalHistoryEntry, "id">;
  assessments!: EntityTable<Assessment, "id">;
  findings!: EntityTable<Finding, "id">;
  settings!: EntityTable<AppSettings, "id">;

  constructor() {
    super("kinguide");
    this.version(1).stores({
      persons: "id, lastName, firstName, relationHint, updatedAt",
      relationships: "id, fromPersonId, toPersonId, type",
      medicalHistory: "id, personId, conditionId, evidenceStatus, updatedAt",
      assessments: "id, createdAt, outdated",
      findings: "id, assessmentId, ruleId, level, createdAt",
      settings: "id",
    });
  }
}

export const db = new KinGuideDB();
