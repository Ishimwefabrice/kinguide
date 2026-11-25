import { Activity } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { useWorkspace } from "@/store/workspace";

export function FindingsPage() {
  const { assessments, findings, persons } = useWorkspace();
  const latest = assessments[0];
  const rows = findings.filter((f) => f.assessmentId === latest?.id);

  return (
    <div className="page-enter space-y-6">
      <PageHeader
        title="Findings"
        subtitle="Step-by-step reasoning from the latest assessment."
      />

      {!latest ? (
        <EmptyState
          icon={Activity}
          title="No findings yet"
          description="Run an assessment to see explainable demonstration results."
        />
      ) : (
        <>
          {latest.outdated ? (
            <div className="rounded-2xl border border-[#f2c94c]/60 bg-[#fff9e8] px-4 py-3 text-sm text-[#6b4b00]">
              This assessment is <strong>outdated</strong> because family data changed after it ran.
              Re-run assessment for current findings.
            </div>
          ) : null}
          <div className="space-y-4">
            {rows.map((f) => (
              <article key={f.id} className="surface p-5">
                <span className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-bold uppercase badge-${f.level}`}>
                  {f.level}
                </span>
                <h2 className="font-display mt-3 text-xl font-semibold text-kg-ink">{f.ruleName}</h2>
                <p className="mt-1 text-sm text-kg-muted">
                  v{f.ruleVersion} · {f.reviewStatus} · {new Date(f.createdAt).toLocaleString()}
                </p>
                <p className="mt-3 text-kg-ink">{f.summary}</p>
                <ol className="mt-4 space-y-3 border-t border-kg-border pt-4">
                  {f.steps.map((s, i) => (
                    <li key={s.id} className="text-sm">
                      <div className="font-semibold text-kg-navy">
                        Step {i + 1} · [{s.result.toUpperCase()}] {s.label}
                      </div>
                      <div className="mt-0.5 text-kg-muted">{s.detail}</div>
                    </li>
                  ))}
                </ol>
                {f.missingFacts.length ? (
                  <div className="mt-4 rounded-xl border border-dashed border-[#f2c94c] bg-[#fff9e8] px-3 py-2 text-sm text-[#6b4b00]">
                    {f.missingFacts.map((m) => (
                      <div key={m}>{m}</div>
                    ))}
                  </div>
                ) : null}
                {f.triggeredPersonIds.length ? (
                  <p className="mt-3 text-sm text-kg-muted">
                    Related people:{" "}
                    {f.triggeredPersonIds
                      .map((id) => {
                        const p = persons.find((x) => x.id === id);
                        return p ? `${p.firstName} ${p.lastName}` : id;
                      })
                      .join(", ")}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
