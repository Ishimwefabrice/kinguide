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
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-navy-950">Settings</h1>
        <p className="mt-1 text-slate-600">Privacy, data control, and application information.</p>
      </div>

      <section className="border border-slate-200 bg-white p-4 space-y-2 text-sm">
        <h2 className="font-display text-lg text-navy-900">Privacy</h2>
        <p>KinGuide stores data in this browser&apos;s IndexedDB. Browser storage is not automatically encrypted.</p>
        <p>On a shared computer, export then delete your data when finished.</p>
        <p>No mandatory account. No KinGuide cloud sync in v1.</p>
      </section>

      <section className="border border-slate-200 bg-white p-4 space-y-3">
        <h2 className="font-display text-lg text-navy-900">Data</h2>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-secondary" onClick={() => void downloadExport()}>
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
            Delete all local data
          </button>
        </div>
      </section>

      <section className="border border-slate-200 bg-white p-4 text-sm space-y-2">
        <h2 className="font-display text-lg text-navy-900">Rule set</h2>
        <p>Version: <code>{RULE_SET_VERSION}</code></p>
        <p>Language setting: {settings?.language ?? "en"} (full i18n en/rw/fr comes in Phase 7)</p>
        <ul className="list-disc pl-5">
          {activeRules().map((r) => (
            <li key={r.id}>{r.name} — {r.reviewStatus}</li>
          ))}
        </ul>
        <button type="button" className="btn-secondary" onClick={() => void refresh()}>
          Refresh workspace
        </button>
      </section>
    </div>
  );
}
