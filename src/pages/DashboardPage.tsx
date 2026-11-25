import { Link } from "react-router-dom";
import { computeMissing } from "@/services/missing";
import { useWorkspace } from "@/store/workspace";

export function DashboardPage() {
  const { persons, history, assessments, findings, assess } = useWorkspace();
  const missing = computeMissing(persons, history);
  const generations = new Set(persons.map((p) => p.relationHint)).size;
  const latest = assessments[0];
  const latestFindings = findings.filter((f) => f.assessmentId === latest?.id);

  const stats = [
    { label: "Family members", value: persons.length },
    { label: "Relation roles represented", value: generations },
    { label: "Medical history entries", value: history.length },
    { label: "Missing / incomplete items", value: missing.length },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-navy-950">Dashboard</h1>
        <p className="mt-1 text-slate-600">Live counts from your local KinGuide workspace.</p>
      </div>

      {persons.length === 0 ? (
        <div className="border border-dashed border-slate-300 bg-white px-5 py-8 text-slate-600">
          No family data yet.{" "}
          <Link className="font-semibold text-teal-700 underline" to="/members">
            Add a family member
          </Link>{" "}
          or load the sample from Welcome / Settings.
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="border border-slate-200 bg-white px-4 py-4">
            <div className="text-3xl font-semibold text-navy-900">{s.value}</div>
            <div className="mt-1 text-sm text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <Link className="btn-primary" to="/members">
          Add family member
        </Link>
        <Link className="btn-secondary" to="/tree">
          Build family tree
        </Link>
        <Link className="btn-secondary" to="/history">
          Record medical history
        </Link>
        <button type="button" className="btn-primary" onClick={() => void assess()}>
          Run assessment
        </button>
        <Link className="btn-secondary" to="/reports">
          Generate report
        </Link>
      </div>

      <section className="border border-slate-200 bg-white p-4">
        <h2 className="font-display text-xl text-navy-900">Recent assessment</h2>
        {!latest ? (
          <p className="mt-2 text-sm text-slate-500">No assessments yet.</p>
        ) : (
          <div className="mt-3 space-y-2 text-sm">
            <p>
              {new Date(latest.createdAt).toLocaleString()} · rules{" "}
              <code>{latest.ruleSetVersion}</code>
              {latest.outdated ? (
                <span className="ml-2 font-semibold text-amber-700">OUTDATED</span>
              ) : (
                <span className="ml-2 font-semibold text-green-700">CURRENT</span>
              )}
            </p>
            <ul className="space-y-1">
              {latestFindings.map((f) => (
                <li key={f.id}>
                  <span className="font-semibold uppercase text-slate-500">{f.level}</span> —{" "}
                  {f.ruleName}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}
