import { useState, type FormEvent } from "react";
import { Stethoscope } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { CONDITION_CATALOGUE, conditionLabel } from "@/data/conditions";
import { deleteHistory, upsertHistory } from "@/database/repositories";
import { newId } from "@/lib/utils";
import { useWorkspace } from "@/store/workspace";
import type { EvidenceStatus } from "@/types/domain";

export function HistoryPage() {
  const { persons, history, refresh } = useWorkspace();
  const [personId, setPersonId] = useState("");
  const [conditionId, setConditionId] = useState(CONDITION_CATALOGUE[0]?.id ?? "");
  const [evidenceStatus, setEvidenceStatus] = useState<EvidenceStatus>("reported");
  const [ageAtDiagnosis, setAgeAtDiagnosis] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!personId) {
      setError("Select a family member.");
      return;
    }
    const now = new Date().toISOString();
    await upsertHistory({
      id: newId(),
      personId,
      conditionId,
      evidenceStatus,
      ageAtDiagnosis: ageAtDiagnosis === "" ? null : Number(ageAtDiagnosis),
      approximateDiagnosisAge: ageAtDiagnosis === "",
      source: "family_report",
      notes: "",
      recordedAt: now,
      updatedAt: now,
    });
    setAgeAtDiagnosis("");
    await refresh();
  }

  return (
    <div className="page-enter space-y-6">
      <PageHeader
        title="Medical history"
        subtitle="Absence of an entry is not “disease-free.” Evidence can be confirmed, reported, suspected, or unknown."
      />

      <form onSubmit={(e) => void onSubmit(e)} className="surface grid gap-4 p-5 sm:grid-cols-2">
        <label className="text-sm font-semibold text-kg-ink">
          Family member
          <select className="field" value={personId} onChange={(e) => setPersonId(e.target.value)}>
            <option value="">Select…</option>
            {persons.map((p) => (
              <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
            ))}
          </select>
        </label>
        <label className="text-sm font-semibold text-kg-ink">
          Condition
          <select className="field" value={conditionId} onChange={(e) => setConditionId(e.target.value)}>
            {CONDITION_CATALOGUE.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </label>
        <label className="text-sm font-semibold text-kg-ink">
          Evidence status
          <select className="field" value={evidenceStatus} onChange={(e) => setEvidenceStatus(e.target.value as EvidenceStatus)}>
            <option value="confirmed">Confirmed</option>
            <option value="reported">Reported</option>
            <option value="suspected">Suspected</option>
            <option value="unknown">Unknown</option>
          </select>
        </label>
        <label className="text-sm font-semibold text-kg-ink">
          Age at diagnosis (optional)
          <input className="field" inputMode="numeric" value={ageAtDiagnosis} onChange={(e) => setAgeAtDiagnosis(e.target.value.replace(/[^\d]/g, ""))} />
        </label>
        {error ? <p className="text-sm text-red-700 sm:col-span-2">{error}</p> : null}
        <div className="sm:col-span-2">
          <button type="submit" className="btn-primary">Add history entry</button>
        </div>
      </form>

      {history.length === 0 ? (
        <EmptyState icon={Stethoscope} title="No history entries" description="Record conditions only when you have information. Leave ages blank if unknown." />
      ) : (
        <div className="space-y-3">
          {history.map((h) => {
            const person = persons.find((p) => p.id === h.personId);
            return (
              <div key={h.id} className="surface flex flex-wrap items-center justify-between gap-3 px-4 py-3.5">
                <div>
                  <div className="font-display font-semibold text-kg-ink">{conditionLabel(h.conditionId)}</div>
                  <div className="text-sm text-kg-muted">
                    {person ? `${person.firstName} ${person.lastName}` : h.personId} · {h.evidenceStatus}
                    {h.ageAtDiagnosis != null ? ` · age ${h.ageAtDiagnosis}` : " · age unknown"}
                  </div>
                </div>
                <button type="button" className="btn-danger" onClick={() => void deleteHistory(h.id).then(() => refresh())}>
                  Delete
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
