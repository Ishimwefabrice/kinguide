import { useState, type FormEvent } from "react";
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
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-navy-950">Medical history</h1>
        <p className="mt-1 text-slate-600">
          Absence of an entry is not the same as “disease-free.” Evidence can be confirmed, reported,
          suspected, or unknown.
        </p>
      </div>

      <form onSubmit={(e) => void onSubmit(e)} className="grid gap-3 border border-slate-200 bg-white p-4 sm:grid-cols-2">
        <label className="text-sm font-semibold">
          Family member
          <select className="mt-1 w-full border border-slate-300 px-3 py-2" value={personId} onChange={(e) => setPersonId(e.target.value)}>
            <option value="">Select…</option>
            {persons.map((p) => (
              <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
            ))}
          </select>
        </label>
        <label className="text-sm font-semibold">
          Condition
          <select className="mt-1 w-full border border-slate-300 px-3 py-2" value={conditionId} onChange={(e) => setConditionId(e.target.value)}>
            {CONDITION_CATALOGUE.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </label>
        <label className="text-sm font-semibold">
          Evidence status
          <select className="mt-1 w-full border border-slate-300 px-3 py-2" value={evidenceStatus} onChange={(e) => setEvidenceStatus(e.target.value as EvidenceStatus)}>
            <option value="confirmed">Confirmed</option>
            <option value="reported">Reported</option>
            <option value="suspected">Suspected</option>
            <option value="unknown">Unknown</option>
          </select>
        </label>
        <label className="text-sm font-semibold">
          Age at diagnosis (optional)
          <input className="mt-1 w-full border border-slate-300 px-3 py-2" inputMode="numeric" value={ageAtDiagnosis} onChange={(e) => setAgeAtDiagnosis(e.target.value.replace(/[^\d]/g, ""))} />
        </label>
        {error ? <p className="text-sm text-red-700 sm:col-span-2">{error}</p> : null}
        <div className="sm:col-span-2">
          <button type="submit" className="btn-primary">Add history entry</button>
        </div>
      </form>

      <div className="space-y-2">
        {history.map((h) => {
          const person = persons.find((p) => p.id === h.personId);
          return (
            <div key={h.id} className="flex flex-wrap items-center justify-between gap-3 border border-slate-200 bg-white px-4 py-3">
              <div>
                <div className="font-semibold text-navy-900">{conditionLabel(h.conditionId)}</div>
                <div className="text-sm text-slate-500">
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
    </div>
  );
}
