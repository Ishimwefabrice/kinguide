import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { computeMissing } from "@/services/missing";
import { useWorkspace } from "@/store/workspace";

export function MissingPage() {
  const { persons, history } = useWorkspace();
  const items = computeMissing(persons, history);

  return (
    <div className="page-enter space-y-6">
      <PageHeader
        title="Missing information"
        subtitle="Unknown stays unknown. KinGuide never converts missing facts into “no disease.”"
      />
      {items.length === 0 ? (
        <EmptyState
          icon={AlertCircle}
          title="No gaps flagged"
          description="Current data does not show incomplete fields that affect the demonstration rules."
        />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="surface px-4 py-4">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-bold uppercase ${
                    item.required ? "bg-[#fff6db] text-[#8a5b00]" : "bg-kg-mint text-kg-forest"
                  }`}
                >
                  {item.required ? "Needed for demo rules" : "Optional"}
                </span>
                <span className="font-display font-semibold text-kg-ink">{item.personName}</span>
              </div>
              <p className="mt-2 text-sm text-kg-ink">{item.what}</p>
              <p className="mt-1 text-sm text-kg-muted">{item.why}</p>
              {item.personId ? (
                <Link className="mt-3 inline-flex text-sm font-semibold text-kg-green hover:underline" to="/members">
                  Update family members
                </Link>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
