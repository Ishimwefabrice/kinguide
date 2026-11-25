import { Link } from "react-router-dom";
import { HeartHandshake, Lock, Sparkles } from "lucide-react";
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
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 pattern-hills" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 pattern-imigongo opacity-60" />

      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-4 py-12 sm:px-8">
        <div className="surface overflow-hidden">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
            <div className="p-8 sm:p-10 lg:p-12">
              <div className="inline-flex items-center gap-2 rounded-full bg-kg-mint px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-kg-green">
                <span className="h-1.5 w-1.5 rounded-full bg-kg-gold" />
                KinGuide
              </div>
              <h1 className="font-display mt-5 text-4xl font-bold leading-[1.1] text-kg-ink sm:text-5xl">
                Understand your family&apos;s health story.
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-kg-muted sm:text-lg">
                Build your family medical history, explore documented educational patterns, and
                prepare meaningful conversations with healthcare professionals.
              </p>

              <div className="mt-6 space-y-3 rounded-2xl border border-kg-border bg-kg-mint/60 px-4 py-4 text-sm text-kg-ink">
                <p className="flex gap-2">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-kg-green" />
                  <span>
                    <strong>Educational prototype.</strong> Not a medical device. No diagnoses, no
                    risk percentages, no treatment advice.
                  </span>
                </p>
                <p className="flex gap-2">
                  <Lock className="mt-0.5 h-4 w-4 shrink-0 text-kg-navy" />
                  <span>
                    <strong>Privacy:</strong> Data stays in this browser. Nothing is sent to a
                    KinGuide server.
                  </span>
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <button type="button" onClick={() => void startEmpty()} className="btn-primary">
                  Create family history
                </button>
                <button type="button" onClick={() => void startSample()} className="btn-secondary">
                  Explore sample family
                </button>
                <Link to="/settings" className="btn-secondary">
                  Privacy &amp; settings
                </Link>
              </div>
            </div>

            <div className="relative hidden overflow-hidden bg-kg-forest p-8 text-white lg:block">
              <div className="absolute inset-0 pattern-imigongo opacity-40" />
              <div className="relative flex h-full flex-col justify-between">
                <div>
                  <HeartHandshake className="h-10 w-10 text-kg-gold" />
                  <h2 className="font-display mt-6 text-2xl font-semibold">
                    Built for calm, clear conversations
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-white/75">
                    A subtle Rwanda-inspired identity — green hills, gold accents, and clean clinical
                    navy — without noise or dashboard clutter.
                  </p>
                </div>
                <ul className="space-y-3 text-sm text-white/80">
                  <li className="rounded-xl bg-white/10 px-3 py-2">Visual family tree</li>
                  <li className="rounded-xl bg-white/10 px-3 py-2">Explainable educational findings</li>
                  <li className="rounded-xl bg-white/10 px-3 py-2">Clinician conversation sheet</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
