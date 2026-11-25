import { db } from "./db";
import { buildSampleFamily } from "./sample";
import type {
  Assessment,
  Finding,
  MedicalHistoryEntry,
  Person,
  Relationship,
} from "@/types/domain";
import { evaluateFamily, fingerprintInput } from "@/engine/evaluator";
import { newId } from "@/lib/utils";

export async function ensureSettings() {
  const existing = await db.settings.get("settings");
  if (!existing) {
    await db.settings.put({
      id: "settings",
      language: "en",
      onboardingDone: false,
    });
  }
}

export async function loadWorkspace() {
  await ensureSettings();
  const [persons, relationships, history, assessments, findings, settings] =
    await Promise.all([
      db.persons.toArray(),
      db.relationships.toArray(),
      db.medicalHistory.toArray(),
      db.assessments.orderBy("createdAt").reverse().toArray(),
      db.findings.toArray(),
      db.settings.get("settings"),
    ]);
  return { persons, relationships, history, assessments, findings, settings: settings! };
}

export async function clearAllData() {
  await Promise.all([
    db.persons.clear(),
    db.relationships.clear(),
    db.medicalHistory.clear(),
    db.assessments.clear(),
    db.findings.clear(),
  ]);
}

export async function loadSampleFamily() {
  await clearAllData();
  const sample = buildSampleFamily();
  await db.transaction(
    "rw",
    db.persons,
    db.relationships,
    db.medicalHistory,
    async () => {
      await db.persons.bulkAdd(sample.persons);
      await db.relationships.bulkAdd(sample.relationships);
      await db.medicalHistory.bulkAdd(sample.history);
    },
  );
}

export async function upsertPerson(person: Person) {
  await db.persons.put(person);
}

export async function deletePerson(id: string) {
  await db.transaction(
    "rw",
    db.persons,
    db.relationships,
    db.medicalHistory,
    async () => {
      await db.persons.delete(id);
      await db.relationships
        .where("fromPersonId")
        .equals(id)
        .or("toPersonId")
        .equals(id)
        .delete();
      await db.medicalHistory.where("personId").equals(id).delete();
    },
  );
  await markAssessmentsOutdated();
}

export async function upsertRelationship(rel: Relationship) {
  if (rel.fromPersonId === rel.toPersonId) {
    throw new Error("A person cannot be related to themselves.");
  }
  if (rel.type === "parent_of" && (await wouldCreateCycle(rel))) {
    throw new Error("That parent link would create a cycle.");
  }
  await db.relationships.put(rel);
  await markAssessmentsOutdated();
}

async function wouldCreateCycle(rel: Relationship): Promise<boolean> {
  if (rel.type !== "parent_of") return false;
  const all = await db.relationships.toArray();
  const parentOf = new Map<string, string[]>();
  for (const r of all) {
    if (r.type !== "parent_of") continue;
    const list = parentOf.get(r.fromPersonId) ?? [];
    list.push(r.toPersonId);
    parentOf.set(r.fromPersonId, list);
  }
  const stack = [rel.toPersonId];
  const seen = new Set<string>();
  while (stack.length) {
    const cur = stack.pop()!;
    if (cur === rel.fromPersonId) return true;
    if (seen.has(cur)) continue;
    seen.add(cur);
    for (const child of parentOf.get(cur) ?? []) stack.push(child);
  }
  return false;
}

export async function upsertHistory(entry: MedicalHistoryEntry) {
  await db.medicalHistory.put(entry);
  await markAssessmentsOutdated();
}

export async function deleteHistory(id: string) {
  await db.medicalHistory.delete(id);
  await markAssessmentsOutdated();
}

export async function markAssessmentsOutdated() {
  const rows = await db.assessments.toArray();
  await Promise.all(
    rows.filter((a) => !a.outdated).map((a) => db.assessments.update(a.id, { outdated: true })),
  );
}

export async function runAssessment(): Promise<{
  assessment: Assessment;
  findings: Finding[];
}> {
  const persons = await db.persons.toArray();
  const history = await db.medicalHistory.toArray();
  const { ruleSetVersion, findings: engineFindings } = evaluateFamily({
    persons,
    history,
  });
  const assessmentId = newId();
  const createdAt = new Date().toISOString();
  const findings: Finding[] = engineFindings.map((f) => ({
    id: newId(),
    assessmentId,
    ruleId: f.ruleId,
    ruleName: f.ruleName,
    ruleVersion: f.ruleVersion,
    level: f.level,
    summary: f.summary,
    steps: f.steps,
    triggeredPersonIds: f.triggeredPersonIds,
    missingFacts: f.missingFacts,
    reviewStatus: f.reviewStatus,
    createdAt,
  }));
  const assessment: Assessment = {
    id: assessmentId,
    createdAt,
    ruleSetVersion,
    inputFingerprint: fingerprintInput({ persons, history }),
    findingIds: findings.map((f) => f.id),
    outdated: false,
  };
  await db.transaction("rw", db.assessments, db.findings, async () => {
    await markAssessmentsOutdated();
    await db.assessments.add(assessment);
    await db.findings.bulkAdd(findings);
  });
  return { assessment, findings };
}

export async function exportJson(): Promise<string> {
  const data = await loadWorkspace();
  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      app: "KinGuide",
      version: 1,
      ...data,
    },
    null,
    2,
  );
}
