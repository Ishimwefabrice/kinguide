import { useMemo } from "react";
import { Copy, Printer } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { conditionLabel } from "@/data/conditions";
import { computeMissing } from "@/services/missing";
import { useWorkspace } from "@/store/workspace";

export function ReportsPage() {
  const { persons, history, assessments, findings } = useWorkspace();
  const latest = assessments[0];
  const rows = findings.filter((f) => f.assessmentId === latest?.id);
  const missing = computeMissing(persons, history);

  const text = useMemo(() => {
    const lines: string[] = [];
    lines.push("KinGuide — clinician conversation sheet");
    lines.push("Educational summary of user-provided family history. NOT a medical device.");
    lines.push(`Generated: ${new Date().toISOString()}`);
    lines.push("");
    lines.push("Family members");
    for (const p of persons) {
      lines.push(
        `- ${p.firstName} ${p.lastName} · ${p.relationHint} · ${p.sex} · ${p.livingStatus}` +
          (p.approximateAge != null ? ` · age ~${p.approximateAge}` : ""),
      );
    }
    lines.push("");
    lines.push("Documented conditions");
    for (const h of history) {
      const p = persons.find((x) => x.id === h.personId);
      lines.push(
        `- ${p ? `${p.firstName} ${p.lastName}` : h.personId}: ${conditionLabel(h.conditionId)} (${h.evidenceStatus}` +
          (h.ageAtDiagnosis != null ? `, age ${h.ageAtDiagnosis}` : ", age unknown") +
          `)`,
      );
    }
    lines.push("");
    lines.push("Unknown / incomplete information");
    if (!missing.length) lines.push("- None flagged");
    missing.forEach((m) => lines.push(`- ${m.personName}: ${m.what}`));
    lines.push("");
    lines.push("Educational findings (demonstration rules unless marked approved)");
    if (!rows.length) lines.push("- No assessment yet");
    for (const f of rows) {
      lines.push(`### ${f.ruleName} [${f.level}] v${f.ruleVersion} (${f.reviewStatus})`);
      lines.push(f.summary);
      f.steps.forEach((s) => lines.push(`  - [${s.result}] ${s.label} — ${s.detail}`));
    }
    lines.push("");
    lines.push("Questions for a healthcare professional");
    lines.push("- Which of these family patterns matter for my situation?");
    lines.push("- What information should I try to confirm?");
    lines.push("- Do I need any specialist referral based on clinical judgement?");
    lines.push("");
    lines.push("Disclaimer: KinGuide does not diagnose, predict risk percentages, or recommend treatment.");
    return lines.join("\n");
  }, [persons, history, missing, rows]);

  return (
    <div className="page-enter space-y-6">
      <div className="no-print">
        <PageHeader
          title="Reports"
          subtitle="Preview, copy, or print a calm conversation sheet for clinic."
          actions={
            <>
              <button type="button" className="btn-primary" onClick={() => void navigator.clipboard.writeText(text)}>
                <Copy className="h-4 w-4" />
                Copy report
              </button>
              <button type="button" className="btn-secondary" onClick={() => window.print()}>
                <Printer className="h-4 w-4" />
                Print
              </button>
            </>
          }
        />
      </div>
      <pre className="surface overflow-auto bg-kg-forest p-5 text-xs leading-relaxed text-kg-mint whitespace-pre-wrap sm:text-[13px]">
        {text}
      </pre>
    </div>
  );
}
