import { z } from "zod";

export const personSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string().min(1).max(80),
  lastName: z.string().max(80).default(""),
  sex: z.enum(["female", "male", "unknown"]),
  birthDate: z.string().nullable(),
  approximateAge: z.number().int().min(0).max(120).nullable(),
  livingStatus: z.enum(["alive", "deceased", "unknown"]),
  notes: z.string().max(2000).default(""),
  relationHint: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const medicalHistorySchema = z.object({
  id: z.string().uuid(),
  personId: z.string().uuid(),
  conditionId: z.string().min(1),
  evidenceStatus: z.enum(["confirmed", "reported", "suspected", "unknown"]),
  ageAtDiagnosis: z.number().int().min(0).max(120).nullable(),
  approximateDiagnosisAge: z.boolean(),
  source: z.enum(["family_report", "medical_document", "other", "unknown"]),
  notes: z.string().max(2000),
  recordedAt: z.string(),
  updatedAt: z.string(),
});
