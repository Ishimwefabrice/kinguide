import { CONDITION_LABELS, RELATION_LABELS, gapsInTree } from "./tree";
import type { Finding, Person } from "./types";

export function buildReport(people: Person[], findings: Finding[]): string {
  const lines: string[] = [];
  lines.push("KinGuide — family history conversation sheet");
  lines.push("Educational prototype. Not a medical device. Not a diagnosis.");
  lines.push(`Generated: ${new Date().toISOString().slice(0, 10)}`);
  lines.push("");
  lines.push("Family members");
  for (const p of people) {
    const cond =
      p.conditions.length === 0
        ? "no conditions recorded"
        : p.conditions
            .map((c) => {
              const age = c.ageAtDiagnosis == null ? "age unknown" : `age ${c.ageAtDiagnosis}`;
              return `${CONDITION_LABELS[c.id]} (${age})`;
            })
            .join("; ");
    lines.push(
      `- ${p.name} · ${RELATION_LABELS[p.relation]} · ${p.sex} · living: ${p.living} · ${cond}`,
    );
  }
  lines.push("");
  lines.push("Findings");
  for (const f of findings) {
    lines.push(`### ${f.guidelineTitle} [${f.level.toUpperCase()}]`);
    lines.push(f.summary);
    for (const s of f.steps) {
      lines.push(`  - [${s.result}] ${s.label} — ${s.detail}`);
    }
    if (f.missingFacts.length) {
      lines.push(`  Missing / notes: ${f.missingFacts.join(" | ")}`);
    }
    lines.push("");
  }
  const gaps = gapsInTree(people);
  if (gaps.length) {
    lines.push("What we don't know yet");
    gaps.forEach((g) => lines.push(`- ${g}`));
  }
  lines.push("");
  lines.push("Next step: take this sheet to a clinician. Do not change medicines based on this app.");
  return lines.join("\n");
}
