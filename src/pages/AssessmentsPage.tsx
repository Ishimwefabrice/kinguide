import { activeRules } from "@/engine/rule-registry";
import { computeMissing } from "@/services/missing";
import { useWorkspace } from "@/store/workspace";

export function AssessmentsPage() {
  const { persons, history, assessments, assess } = useWorkspace();
  const missing = computeMissing(persons, history).filter((m) => m.required);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-navy-950">Assessments</h1>
        <p className="mt-1 text-slate-600">
          Runs the deterministic demonstration rule pack. Clinical registry is empty until reviewed.
        </p>
      </div>

      <div className="border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950">
        Active rules are labelled <strong>demonstration / NON-CLINICAL</strong>. They exist to prove the
        engine — not to guide care.
      </div>

      <div className="border border-slate-200 bg-white p-4">
        <h2 className="font-display text-lg">Active rules</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
          {activeRules().map((r) => (
            <li key={r.id}>
              {r.name} · v{r.version} · {r.reviewStatus}
            </li>
          ))}
        </ul>
      </div>

      {missing.length > 0 ? (
        <div className="border border-slate-200 bg-white p-4 text-sm">
          <h2 className="font-semibold text-navy-900">Missing evidence that may affect demo rules</h2>
          <ul className="mt-2 list-disc pl-5 text-slate-600">
            {missing.map((m) => (
              <li key={m.id}>{m.personName}: {m.what}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <button type="button" className="btn-primary" onClick={() => void assess()} disabled={persons.length === 0}>
        Start assessment
      </button>

      <div className="space-y-2">
        {assessments.map((a) => (
          <div key={a.id} className="border border-slate-200 bg-white px-4 py-3 text-sm">
            <div className="font-semibold text-navy-900">{new Date(a.createdAt).toLocaleString()}</div>
            <div className="text-slate-500">
              {a.ruleSetVersion} · {a.outdated ? "OUTDATED after data change" : "CURRENT"} ·{" "}
              {a.findingIds.length} findings
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
