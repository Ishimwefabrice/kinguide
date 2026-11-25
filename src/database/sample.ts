import { newId } from "@/lib/utils";
import type { MedicalHistoryEntry, Person, Relationship } from "@/types/domain";

export function buildSampleFamily(): {
  persons: Person[];
  relationships: Relationship[];
  history: MedicalHistoryEntry[];
} {
  const now = new Date().toISOString();
  const aline: Person = {
    id: newId(),
    firstName: "Aline",
    lastName: "Uwase",
    sex: "female",
    birthDate: null,
    approximateAge: 34,
    livingStatus: "alive",
    notes: "Fictional sample — not a real person.",
    relationHint: "self",
    createdAt: now,
    updatedAt: now,
  };
  const mum: Person = {
    id: newId(),
    firstName: "Claire",
    lastName: "Uwase",
    sex: "female",
    birthDate: null,
    approximateAge: 58,
    livingStatus: "alive",
    notes: "",
    relationHint: "mother",
    createdAt: now,
    updatedAt: now,
  };
  const dad: Person = {
    id: newId(),
    firstName: "Jean",
    lastName: "Uwase",
    sex: "male",
    birthDate: null,
    approximateAge: 61,
    livingStatus: "alive",
    notes: "",
    relationHint: "father",
    createdAt: now,
    updatedAt: now,
  };
  const aunt: Person = {
    id: newId(),
    firstName: "Beatrice",
    lastName: "Mukamana",
    sex: "female",
    birthDate: null,
    approximateAge: null,
    livingStatus: "unknown",
    notes: "",
    relationHint: "maternal_aunt",
    createdAt: now,
    updatedAt: now,
  };
  const grandpa: Person = {
    id: newId(),
    firstName: "Emmanuel",
    lastName: "Uwase",
    sex: "male",
    birthDate: null,
    approximateAge: null,
    livingStatus: "deceased",
    notes: "",
    relationHint: "paternal_grandfather",
    createdAt: now,
    updatedAt: now,
  };

  const persons = [aline, mum, dad, aunt, grandpa];
  const relationships: Relationship[] = [
    {
      id: newId(),
      fromPersonId: mum.id,
      toPersonId: aline.id,
      type: "parent_of",
      createdAt: now,
    },
    {
      id: newId(),
      fromPersonId: dad.id,
      toPersonId: aline.id,
      type: "parent_of",
      createdAt: now,
    },
    {
      id: newId(),
      fromPersonId: mum.id,
      toPersonId: dad.id,
      type: "spouse_of",
      createdAt: now,
    },
    {
      id: newId(),
      fromPersonId: grandpa.id,
      toPersonId: dad.id,
      type: "parent_of",
      createdAt: now,
    },
  ];

  const history: MedicalHistoryEntry[] = [
    {
      id: newId(),
      personId: mum.id,
      conditionId: "breast_cancer",
      evidenceStatus: "reported",
      ageAtDiagnosis: 38,
      approximateDiagnosisAge: false,
      source: "family_report",
      notes: "Fictional sample entry",
      recordedAt: now,
      updatedAt: now,
    },
    {
      id: newId(),
      personId: dad.id,
      conditionId: "early_heart_attack",
      evidenceStatus: "reported",
      ageAtDiagnosis: 54,
      approximateDiagnosisAge: false,
      source: "family_report",
      notes: "",
      recordedAt: now,
      updatedAt: now,
    },
    {
      id: newId(),
      personId: aunt.id,
      conditionId: "ovarian_cancer",
      evidenceStatus: "suspected",
      ageAtDiagnosis: null,
      approximateDiagnosisAge: true,
      source: "family_report",
      notes: "Age unknown — must stay UNKNOWN",
      recordedAt: now,
      updatedAt: now,
    },
    {
      id: newId(),
      personId: grandpa.id,
      conditionId: "colorectal_cancer",
      evidenceStatus: "reported",
      ageAtDiagnosis: 48,
      approximateDiagnosisAge: false,
      source: "family_report",
      notes: "",
      recordedAt: now,
      updatedAt: now,
    },
  ];

  return { persons, relationships, history };
}
