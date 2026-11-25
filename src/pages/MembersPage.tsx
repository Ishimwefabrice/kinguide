import { useState, type FormEvent } from "react";
import { Users } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
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
    <div className="page-enter space-y-6">
      <PageHeader
        title="Family members"
        subtitle="Add people without forcing facts you do not know."
      />

      <form onSubmit={(e) => void onSubmit(e)} className="surface grid gap-4 p-5 sm:grid-cols-2">
        <label className="text-sm font-semibold text-kg-ink">
          First name
          <input className="field" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </label>
        <label className="text-sm font-semibold text-kg-ink">
          Last name
          <input className="field" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </label>
        <label className="text-sm font-semibold text-kg-ink">
          Relation hint
          <select className="field" value={relationHint} onChange={(e) => setRelationHint(e.target.value as RelationRole)}>
            {ROLES.map((r) => (
              <option key={r} value={r}>{r.replaceAll("_", " ")}</option>
            ))}
          </select>
        </label>
        <label className="text-sm font-semibold text-kg-ink">
          Sex
          <select className="field" value={sex} onChange={(e) => setSex(e.target.value as Sex)}>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="unknown">Unknown</option>
          </select>
        </label>
        <label className="text-sm font-semibold text-kg-ink">
          Living status
          <select className="field" value={livingStatus} onChange={(e) => setLivingStatus(e.target.value as LivingStatus)}>
            <option value="alive">Alive</option>
            <option value="deceased">Deceased</option>
            <option value="unknown">Unknown</option>
          </select>
        </label>
        <label className="text-sm font-semibold text-kg-ink">
          Approximate age (optional)
          <input className="field" inputMode="numeric" value={approximateAge} onChange={(e) => setApproximateAge(e.target.value.replace(/[^\d]/g, ""))} />
        </label>
        {error ? <p className="text-sm text-red-700 sm:col-span-2">{error}</p> : null}
        <div className="sm:col-span-2">
          <button type="submit" className="btn-primary">Add member</button>
        </div>
      </form>

      {persons.length === 0 ? (
        <EmptyState icon={Users} title="No members yet" description="Use the form above to add the first person on your tree." />
      ) : (
        <div className="space-y-3">
          {persons.map((p) => (
            <div key={p.id} className="surface flex flex-wrap items-center justify-between gap-3 px-4 py-3.5 transition hover:shadow-[var(--shadow-lift)]">
              <div>
                <div className="font-display font-semibold text-kg-ink">{p.firstName} {p.lastName}</div>
                <div className="text-sm text-kg-muted">
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
      )}
    </div>
  );
}
