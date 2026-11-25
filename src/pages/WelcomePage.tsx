import { Link } from "react-router-dom";
import { useWorkspace } from "@/store/workspace";
import { db } from "@/database/db";

export function WelcomePage() {
  const { loadSample, refresh } = useWorkspace();

  async function startEmpty() {
    await db.settings.put({ id: "settings", language: "en", onboardingDone: true });
    await refresh();
  }

  async function startSample() {
    await loadSample();
    await db.settings.put({ id: "settings", language: "en", onboardingDone: true });
    await refresh();
  }

  return (
    <div className="mx-auto max-w-3xl py-10">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-600">KinGuide</p>
      <h1 className="font-display mt-3 text-4xl text-navy-950 sm:text-5xl">
        Understand your family&apos;s health story.
      </h1>
      <p className="mt-4 text-lg text-slate-600">
        Build your family medical history, explore documented educational patterns, and prepare
        meaningful conversations with healthcare professionals.
      </p>
      <div className="mt-6 space-y-3 border-l-4 border-amber-500 bg-amber-50 px-4 py-3 text-sm text-amber-950">
        <p>
          <strong>Educational prototype.</strong> Not a medical device. No diagnoses, no risk
          percentages, no treatment advice.
        </p>
        <p>
          <strong>Privacy:</strong> Data stays in this browser (IndexedDB). Nothing is sent to a
          KinGuide server.
        </p>
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => void startEmpty()}
          className="rounded-md bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800"
        >
          Create family history
        </button>
        <button
          type="button"
          onClick={() => void startSample()}
          className="rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-navy-900 hover:bg-slate-50"
        >
          Explore sample family
        </button>
        <Link
          to="/settings"
          className="rounded-md px-5 py-2.5 text-sm font-semibold text-teal-700 hover:underline"
        >
          Privacy &amp; settings
        </Link>
      </div>
    </div>
  );
}
