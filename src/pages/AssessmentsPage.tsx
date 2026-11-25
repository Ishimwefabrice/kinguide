import { PageHeader } from "@/components/ui/PageHeader";
import { activeRules } from "@/engine/rule-registry";
import { computeMissing } from "@/services/missing";
import { useWorkspace } from "@/store/workspace";

export function AssessmentsPage() {
  const { persons, history, assessments, assess } = useWorkspace();
  const missing = computeMissing(persons, history).filter((m) => m.required);

  return (
    <div className="page-enter space-y-6">
      <PageHeader
        title="Assessments"
        subtitle="Runs the deterministic demonstration rule pack. Clinical registry stays empty until reviewed."
        actions={
          <button type="button" className="btn-primary" onClick={() => void assess()} disabled={persons.length === 0}>
            Start assessment
          </button>
        }
      />

      <div className="rounded-2xl border border-[#f2c94c]/50 bg-[#fff9e8] px-4 py-3 text-sm text-[#6b4b00]">
        Active rules are labelled <strong>demonstration / NON-CLINICAL</strong>. They prove the engine —
        they do not guide care.
      </div>

      <div className="surface p-5">
        <h2 className="font-display text-lg font-semibold text-kg-ink">Active rules</h2>
        <ul className="mt-3 space-y-2">
          {activeRules().map((r) => (
            <li key={r.id} className="rounded-xl border border-kg-border bg-kg-bg/60 px-3 py-2 text-sm text-kg-ink">
              {r.name} · v{r.version} · <span className="text-kg-muted">{r.reviewStatus}</span>
            </li>
          ))}
        </ul>
      </div>

      {missing.length > 0 ? (
        <div className="surface p-5 text-sm">
          <h2 className="font-display font-semibold text-kg-ink">Missing evidence that may affect demo rules</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-kg-muted">
            {missing.map((m) => (
              <li key={m.id}>{m.personName}: {m.what}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="space-y-3">
        {assessments.map((a) => (
          <div key={a.id} className="surface px-4 py-3.5 text-sm">
            <div className="font-display font-semibold text-kg-ink">{new Date(a.createdAt).toLocaleString()}</div>
            <div className="mt-1 text-kg-muted">
              {a.ruleSetVersion} · {a.outdated ? "OUTDATED after data change" : "CURRENT"} ·{" "}
              {a.findingIds.length} findings
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
