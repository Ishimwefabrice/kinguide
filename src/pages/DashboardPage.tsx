import { Link } from "react-router-dom";
import {
  AlertCircle,
  ClipboardList,
  FileText,
  GitBranch,
  Stethoscope,
  Users,
} from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { computeMissing } from "@/services/missing";
import { useWorkspace } from "@/store/workspace";

export function DashboardPage() {
  const { persons, history, assessments, findings, assess } = useWorkspace();
  const missing = computeMissing(persons, history);
  const generations = new Set(persons.map((p) => p.relationHint)).size;
  const latest = assessments[0];
  const latestFindings = findings.filter((f) => f.assessmentId === latest?.id);

  const stats = [
    { label: "Family members", value: persons.length, icon: Users, tone: "bg-kg-mint text-kg-green" },
    { label: "Relation roles", value: generations, icon: GitBranch, tone: "bg-[#e8eef5] text-kg-navy" },
    { label: "History entries", value: history.length, icon: Stethoscope, tone: "bg-kg-mint text-kg-forest" },
    { label: "Missing items", value: missing.length, icon: AlertCircle, tone: "bg-[#fff6db] text-[#8a5b00]" },
  ];

  return (
    <div className="page-enter space-y-8">
      <div className="surface mb-6 overflow-hidden">
        <div
          className="relative h-28 bg-cover bg-center sm:h-36"
          style={{ backgroundImage: "url(/images/rwanda/hero-tea-hills.jpg)" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-kg-forest/80 to-kg-forest/25" />
          <div className="relative flex h-full items-end p-5">
            <p className="font-display text-lg font-semibold text-white sm:text-xl">
              KinGuide · Land of a thousand hills
            </p>
          </div>
        </div>
      </div>

      <PageHeader
        title="Dashboard"
        subtitle="Live counts from your local KinGuide workspace."
        actions={
          <button type="button" className="btn-primary" onClick={() => void assess()} disabled={!persons.length}>
            Run assessment
          </button>
        }
      />

      {persons.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No family data yet"
          description="Add relatives or load the fictional sample family to explore the full flow."
          action={
            <Link className="btn-primary" to="/members">
              Add a family member
            </Link>
          }
        />
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="surface group p-5 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
          >
            <div className={`mb-4 inline-flex rounded-xl p-2.5 ${s.tone}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div className="font-display text-3xl font-bold text-kg-ink">{s.value}</div>
            <div className="mt-1 text-sm text-kg-muted">{s.label}</div>
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
        <Link className="btn-secondary" to="/reports">
          <FileText className="h-4 w-4" />
          Generate report
        </Link>
      </div>

      <section className="surface p-5 sm:p-6">
        <div className="mb-3 flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-kg-green" />
          <h2 className="font-display text-xl font-semibold text-kg-ink">Recent assessment</h2>
        </div>
        {!latest ? (
          <p className="text-sm text-kg-muted">No assessments yet. Run one when your tree is ready.</p>
        ) : (
          <div className="space-y-3 text-sm">
            <p className="text-kg-muted">
              {new Date(latest.createdAt).toLocaleString()} ·{" "}
              <code className="rounded bg-kg-mint px-1.5 py-0.5 text-kg-forest">{latest.ruleSetVersion}</code>
              {latest.outdated ? (
                <span className="ml-2 rounded-full bg-[#fff6db] px-2 py-0.5 text-xs font-semibold text-[#8a5b00]">
                  OUTDATED
                </span>
              ) : (
                <span className="ml-2 rounded-full bg-kg-mint px-2 py-0.5 text-xs font-semibold text-kg-green">
                  CURRENT
                </span>
              )}
            </p>
            <ul className="space-y-2">
              {latestFindings.map((f) => (
                <li
                  key={f.id}
                  className="flex flex-wrap items-center gap-2 rounded-xl border border-kg-border bg-kg-bg/70 px-3 py-2"
                >
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold uppercase badge-${f.level}`}>
                    {f.level}
                  </span>
                  <span className="text-kg-ink">{f.ruleName}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}
