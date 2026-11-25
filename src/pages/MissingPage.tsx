import { Link } from "react-router-dom";
import { computeMissing } from "@/services/missing";
import { useWorkspace } from "@/store/workspace";

export function MissingPage() {
  const { persons, history } = useWorkspace();
  const items = computeMissing(persons, history);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-navy-950">Missing information</h1>
        <p className="mt-1 text-slate-600">
          Unknown stays unknown. KinGuide never converts missing facts into “no disease.”
        </p>
      </div>
      {items.length === 0 ? (
        <p className="border border-dashed border-slate-300 bg-white px-4 py-6 text-slate-500">
          No gaps flagged from current data.
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="border border-slate-200 bg-white px-4 py-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  {item.required ? "Needed for demo rules" : "Optional"}
                </span>
                <span className="font-semibold text-navy-900">{item.personName}</span>
              </div>
              <p className="mt-1 text-sm text-slate-800">{item.what}</p>
              <p className="mt-1 text-sm text-slate-500">{item.why}</p>
              {item.personId ? (
                <Link className="mt-2 inline-block text-sm font-semibold text-teal-700 underline" to="/members">
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
