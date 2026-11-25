import { useMemo, useState } from "react";
import { evaluateAll, GUIDELINES } from "./guidelines";
import { buildReport } from "./report";
import {
  CONDITION_LABELS,
  RELATION_LABELS,
  createPerson,
  gapsInTree,
  newId,
  sampleFamily,
} from "./tree";
import type { ConditionId, Person, Relation, Sex, TriState } from "./types";

const CONDITION_OPTIONS = Object.keys(CONDITION_LABELS) as ConditionId[];
const RELATION_OPTIONS = Object.keys(RELATION_LABELS) as Relation[];

export default function App() {
  const [people, setPeople] = useState<Person[]>(() => sampleFamily());
  const [name, setName] = useState("");
  const [relation, setRelation] = useState<Relation>("sister");
  const [sex, setSex] = useState<Sex>("female");
  const [living, setLiving] = useState<TriState>("unknown");
  const [age, setAge] = useState("");
  const [conditionId, setConditionId] = useState<ConditionId | "">("");
  const [conditionAge, setConditionAge] = useState("");

  const findings = useMemo(() => evaluateAll(people), [people]);
  const gaps = useMemo(() => gapsInTree(people), [people]);
  const report = useMemo(() => buildReport(people, findings), [people, findings]);
  const highlighted = useMemo(() => {
    const ids = new Set<string>();
    findings.forEach((f) => f.triggeredPersonIds.forEach((id) => ids.add(id)));
    return ids;
  }, [findings]);

  function addPerson() {
    if (!name.trim()) return;
    const conditions =
      conditionId === ""
        ? []
        : [
            {
              id: conditionId,
              ageAtDiagnosis: conditionAge === "" ? null : Number(conditionAge),
            },
          ];
    setPeople((prev) => [
      ...prev,
      createPerson({
        id: newId(),
        name: name.trim(),
        relation,
        sex,
        living,
        age: age === "" ? null : Number(age),
        conditions,
      }),
    ]);
    setName("");
    setAge("");
    setConditionId("");
    setConditionAge("");
  }

  function removePerson(id: string) {
    setPeople((prev) => prev.filter((p) => p.id !== id));
  }

  function copyReport() {
    void navigator.clipboard.writeText(report);
  }

  return (
    <div className="app">
      <header className="hero">
        <h1 className="brand">KinGuide</h1>
        <p className="tagline">
          Your family tree, checked against educational clinical-referral patterns —
          so you walk into the appointment knowing what to ask.
        </p>
        <div className="hero-actions">
          <button className="btn btn-primary" type="button" onClick={() => setPeople(sampleFamily())}>
            Load sample family
          </button>
          <button className="btn btn-secondary" type="button" onClick={copyReport}>
            Copy doctor sheet
          </button>
          <button className="btn btn-danger" type="button" onClick={() => setPeople([])}>
            Clear everything
          </button>
        </div>
        <div className="disclaimer">
          KinGuide is an AUCA teaching prototype for family-history decision support.
          It is <strong>not</strong> a medical device, does not give risk percentages, and never
          replaces a clinician. Data stays in this browser only.
        </div>
      </header>

      <div className="layout">
        <section className="panel">
          <h2>Family tree</h2>
          <p className="lead">Add relatives you know. Unknown is allowed — never treated as healthy.</p>

          <div className="person-list">
            {people.length === 0 && <p className="meta">No people yet. Load the sample or add someone.</p>}
            {people.map((p) => (
              <article key={p.id} className={`person ${highlighted.has(p.id) ? "hit" : ""}`}>
                <div className="person-top">
                  <strong>{p.name}</strong>
                  <button className="btn btn-danger" type="button" onClick={() => removePerson(p.id)}>
                    Remove
                  </button>
                </div>
                <div className="meta">
                  {RELATION_LABELS[p.relation]} · {p.sex} · living: {p.living}
                  {p.age != null ? ` · age ${p.age}` : ""}
                </div>
                <div className="chips">
                  {p.conditions.length === 0 && <span className="chip">No conditions</span>}
                  {p.conditions.map((c) => (
                    <span key={c.id} className="chip">
                      {CONDITION_LABELS[c.id]}
                      {c.ageAtDiagnosis == null ? " · age ?" : ` · ${c.ageAtDiagnosis}`}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className="form-grid">
            <div className="row two">
              <label>
                Name
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Aunt Claire" />
              </label>
              <label>
                Relation
                <select value={relation} onChange={(e) => setRelation(e.target.value as Relation)}>
                  {RELATION_OPTIONS.map((r) => (
                    <option key={r} value={r}>
                      {RELATION_LABELS[r]}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="row two">
              <label>
                Sex
                <select value={sex} onChange={(e) => setSex(e.target.value as Sex)}>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="unknown">Unknown</option>
                </select>
              </label>
              <label>
                Living
                <select value={living} onChange={(e) => setLiving(e.target.value as TriState)}>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="unknown">Unknown</option>
                </select>
              </label>
            </div>
            <div className="row two">
              <label>
                Current age (optional)
                <input
                  inputMode="numeric"
                  value={age}
                  onChange={(e) => setAge(e.target.value.replace(/[^\d]/g, ""))}
                  placeholder="e.g. 54"
                />
              </label>
              <label>
                Condition (optional)
                <select
                  value={conditionId}
                  onChange={(e) => setConditionId(e.target.value as ConditionId | "")}
                >
                  <option value="">None</option>
                  {CONDITION_OPTIONS.map((id) => (
                    <option key={id} value={id}>
                      {CONDITION_LABELS[id]}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label>
              Age at diagnosis (optional — leave blank if unknown)
              <input
                inputMode="numeric"
                value={conditionAge}
                onChange={(e) => setConditionAge(e.target.value.replace(/[^\d]/g, ""))}
                placeholder="e.g. 38"
                disabled={conditionId === ""}
              />
            </label>
            <button className="btn btn-primary" type="button" onClick={addPerson}>
              Add to tree
            </button>
          </div>

          {gaps.length > 0 && (
            <div className="missing">
              <strong>What we don’t know</strong>
              <ul>
                {gaps.map((g) => (
                  <li key={g}>{g}</li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <section className="panel">
          <h2>Guideline findings</h2>
          <p className="lead">
            {GUIDELINES.length} educational rule sets. Each step is yes / no / unknown — never a silent
            “healthy.”
          </p>
          <div className="findings">
            {findings.map((f) => (
              <article key={f.guidelineId} className={`finding ${f.level}`}>
                <span className={`badge ${f.level}`}>{f.level}</span>
                <h3 style={{ margin: "0 0 0.35rem", fontFamily: "Fraunces, Georgia, serif" }}>
                  {f.guidelineTitle}
                </h3>
                <p style={{ margin: 0 }}>{f.summary}</p>
                <ol className="steps">
                  {f.steps.map((s) => (
                    <li key={s.id}>
                      <strong>[{s.result}]</strong> {s.label} — {s.detail}
                    </li>
                  ))}
                </ol>
                {f.missingFacts.length > 0 && (
                  <div className="missing">
                    {f.missingFacts.map((m) => (
                      <div key={m}>{m}</div>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className="panel" style={{ marginTop: "1.25rem" }}>
        <h2>Doctor conversation sheet</h2>
        <p className="lead">Print or copy. Names can be edited on the tree before you share.</p>
        <pre className="report">{report}</pre>
      </section>

      <p className="footer-note">
        Built for an AUCA final-year portfolio. Sources are simplified teaching patterns, not hospital
        protocol. Keep KinGuide offline-first: no accounts, no server, no analytics in this MVP.
      </p>
    </div>
  );
}
