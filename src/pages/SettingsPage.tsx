import { Download, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { exportJson } from "@/database/repositories";
import { RULE_SET_VERSION, activeRules } from "@/engine/rule-registry";
import { useWorkspace } from "@/store/workspace";

export function SettingsPage() {
  const { clearAll, loadSample, refresh, settings } = useWorkspace();

  async function downloadExport() {
    const json = await exportJson();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kinguide-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="page-enter space-y-6">
      <PageHeader
        title="Settings"
        subtitle="Privacy, data control, and application information."
      />

      <section className="surface space-y-2 p-5 text-sm text-kg-ink">
        <h2 className="font-display text-lg font-semibold">Privacy</h2>
        <p className="text-kg-muted">
          KinGuide stores data in this browser&apos;s IndexedDB. Browser storage is not automatically
          encrypted.
        </p>
        <p className="text-kg-muted">On a shared computer, export then delete your data when finished.</p>
        <p className="text-kg-muted">No mandatory account. No KinGuide cloud sync in v1.</p>
      </section>

      <section className="surface space-y-3 p-5">
        <h2 className="font-display text-lg font-semibold text-kg-ink">Data</h2>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-secondary" onClick={() => void downloadExport()}>
            <Download className="h-4 w-4" />
            Export JSON backup
          </button>
          <button type="button" className="btn-secondary" onClick={() => void loadSample()}>
            Load sample family
          </button>
          <button
            type="button"
            className="btn-danger"
            onClick={() => {
              if (confirm("Delete all local KinGuide data?")) void clearAll();
            }}
          >
            <Trash2 className="h-4 w-4" />
            Delete all local data
          </button>
        </div>
      </section>

      <section className="surface space-y-2 p-5 text-sm">
        <h2 className="font-display text-lg font-semibold text-kg-ink">Rule set</h2>
        <p className="text-kg-muted">
          Version: <code className="rounded bg-kg-mint px-1.5 py-0.5 text-kg-forest">{RULE_SET_VERSION}</code>
        </p>
        <p className="text-kg-muted">Language setting: {settings?.language ?? "en"} (full i18n later)</p>
        <ul className="mt-2 space-y-1 text-kg-ink">
          {activeRules().map((r) => (
            <li key={r.id} className="rounded-xl border border-kg-border bg-kg-bg/50 px-3 py-2">
              {r.name} — {r.reviewStatus}
            </li>
          ))}
        </ul>
        <button type="button" className="btn-secondary mt-2" onClick={() => void refresh()}>
          Refresh workspace
        </button>
      </section>
    </div>
  );
}
