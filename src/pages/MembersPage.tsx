import { useState, type FormEvent } from "react";
import { deletePerson, upsertPerson } from "@/database/repositories";
import { newId } from "@/lib/utils";
import { useWorkspace } from "@/store/workspace";
import type { LivingStatus, RelationRole, Sex } from "@/types/domain";

const ROLES: RelationRole[] = [
  "self",
  "mother",
  "father",
  "sister",
  "brother",
  "daughter",
  "son",
  "maternal_grandmother",
  "maternal_grandfather",
  "paternal_grandmother",
  "paternal_grandfather",
  "maternal_aunt",
  "maternal_uncle",
  "paternal_aunt",
  "paternal_uncle",
  "spouse",
  "other",
];

export function MembersPage() {
  const { persons, refresh } = useWorkspace();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [sex, setSex] = useState<Sex>("unknown");
  const [livingStatus, setLivingStatus] = useState<LivingStatus>("unknown");
  const [relationHint, setRelationHint] = useState<RelationRole>("other");
  const [approximateAge, setApproximateAge] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!firstName.trim()) {
      setError("First name is required.");
      return;
    }
    const now = new Date().toISOString();
    await upsertPerson({
      id: newId(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      sex,
      birthDate: null,
      approximateAge: approximateAge === "" ? null : Number(approximateAge),
      livingStatus,
      notes: "",
      relationHint,
      createdAt: now,
      updatedAt: now,
    });
    setFirstName("");
    setLastName("");
    setApproximateAge("");
    await refresh();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-navy-950">Family members</h1>
        <p className="mt-1 text-slate-600">Add people without forcing facts you do not know.</p>
      </div>

      <form onSubmit={(e) => void onSubmit(e)} className="grid gap-3 border border-slate-200 bg-white p-4 sm:grid-cols-2">
        <label className="text-sm font-semibold">
          First name
          <input className="mt-1 w-full border border-slate-300 px-3 py-2" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </label>
        <label className="text-sm font-semibold">
          Last name
          <input className="mt-1 w-full border border-slate-300 px-3 py-2" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </label>
        <label className="text-sm font-semibold">
          Relation hint
          <select className="mt-1 w-full border border-slate-300 px-3 py-2" value={relationHint} onChange={(e) => setRelationHint(e.target.value as RelationRole)}>
            {ROLES.map((r) => (
              <option key={r} value={r}>{r.replaceAll("_", " ")}</option>
            ))}
          </select>
        </label>
        <label className="text-sm font-semibold">
          Sex
          <select className="mt-1 w-full border border-slate-300 px-3 py-2" value={sex} onChange={(e) => setSex(e.target.value as Sex)}>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="unknown">Unknown</option>
          </select>
        </label>
        <label className="text-sm font-semibold">
          Living status
          <select className="mt-1 w-full border border-slate-300 px-3 py-2" value={livingStatus} onChange={(e) => setLivingStatus(e.target.value as LivingStatus)}>
            <option value="alive">Alive</option>
            <option value="deceased">Deceased</option>
            <option value="unknown">Unknown</option>
          </select>
        </label>
        <label className="text-sm font-semibold">
          Approximate age (optional)
          <input className="mt-1 w-full border border-slate-300 px-3 py-2" inputMode="numeric" value={approximateAge} onChange={(e) => setApproximateAge(e.target.value.replace(/[^\d]/g, ""))} />
        </label>
        {error ? <p className="text-sm text-red-700 sm:col-span-2">{error}</p> : null}
        <div className="sm:col-span-2">
          <button type="submit" className="btn-primary">Add member</button>
        </div>
      </form>

      <div className="space-y-2">
        {persons.map((p) => (
          <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 border border-slate-200 bg-white px-4 py-3">
            <div>
              <div className="font-semibold text-navy-900">{p.firstName} {p.lastName}</div>
              <div className="text-sm text-slate-500">
                {p.relationHint.replaceAll("_", " ")} · {p.sex} · {p.livingStatus}
                {p.approximateAge != null ? ` · ~${p.approximateAge}` : ""}
              </div>
            </div>
            <button
              type="button"
              className="btn-danger"
              onClick={() => {
                if (confirm(`Remove ${p.firstName}?`)) {
                  void deletePerson(p.id).then(() => refresh());
                }
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
