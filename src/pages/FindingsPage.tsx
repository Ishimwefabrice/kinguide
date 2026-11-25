import { useWorkspace } from "@/store/workspace";

const BADGE: Record<string, string> = {
  meets: "bg-green-700 text-white",
  discuss: "bg-amber-700 text-white",
  none: "bg-slate-500 text-white",
};

export function FindingsPage() {
  const { assessments, findings, persons } = useWorkspace();
  const latest = assessments[0];
  const rows = findings.filter((f) => f.assessmentId === latest?.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-navy-950">Findings</h1>
        <p className="mt-1 text-slate-600">Step-by-step reasoning from the latest assessment.</p>
      </div>

      {!latest ? (
        <p className="text-slate-500">Run an assessment first.</p>
      ) : (
        <>
          {latest.outdated ? (
            <div className="border border-amber-400 bg-amber-50 px-4 py-3 text-sm text-amber-950">
              This assessment is <strong>outdated</strong> because family data changed after it ran.
              Re-run assessment for current findings.
            </div>
          ) : null}
          <div className="space-y-4">
            {rows.map((f) => (
              <article key={f.id} className="border border-slate-200 bg-white p-4">
                <span className={`inline-block px-2 py-0.5 text-xs font-bold uppercase ${BADGE[f.level]}`}>
                  {f.level}
                </span>
                <h2 className="font-display mt-2 text-xl text-navy-900">{f.ruleName}</h2>
                <p className="mt-1 text-sm text-slate-500">
                  v{f.ruleVersion} · {f.reviewStatus} · {new Date(f.createdAt).toLocaleString()}
                </p>
                <p className="mt-3 text-slate-800">{f.summary}</p>
                <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-700">
                  {f.steps.map((s) => (
                    <li key={s.id}>
                      <strong>[{s.result.toUpperCase()}]</strong> {s.label}
                      <div className="text-slate-500">{s.detail}</div>
                    </li>
                  ))}
                </ol>
                {f.missingFacts.length ? (
                  <div className="mt-3 border border-dashed border-amber-400 bg-amber-50 px-3 py-2 text-sm">
                    {f.missingFacts.map((m) => (
                      <div key={m}>{m}</div>
                    ))}
                  </div>
                ) : null}
                {f.triggeredPersonIds.length ? (
                  <p className="mt-3 text-sm text-slate-500">
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
