import { Link } from "react-router-dom";
import { HeartHandshake, Lock, Sparkles } from "lucide-react";
import { useWorkspace } from "@/store/workspace";
import { db } from "@/database/db";

/** Best hero: Rwanda tea hills — matches KinGuide green identity. */
const HERO = "/images/rwanda/hero-tea-hills.jpg";
const PANEL = "/images/rwanda/panel-kigali.jpg";

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
      {/* Full-bleed Rwanda hero */}
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${HERO})` }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-kg-forest/85 via-kg-forest/70 to-kg-navy/75" />
      <div className="pointer-events-none absolute inset-0 pattern-imigongo opacity-30" />

      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-4 py-12 sm:px-8">
        <div className="surface overflow-hidden shadow-[var(--shadow-lift)]">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
            <div className="p-8 sm:p-10 lg:p-12">
              <div className="inline-flex items-center gap-2 rounded-full bg-kg-mint px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-kg-green">
                <span className="h-1.5 w-1.5 rounded-full bg-kg-gold" />
                KinGuide · Rwanda
              </div>
              <h1 className="font-display mt-5 text-4xl font-bold leading-[1.1] text-kg-ink sm:text-5xl">
                Understand your family&apos;s health story.
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-kg-muted sm:text-lg">
                Built in Rwanda for calm, clear conversations — organise family medical history and
                prepare meaningful questions for healthcare professionals.
              </p>

              <div className="mt-6 space-y-3 rounded-2xl border border-kg-border bg-kg-mint/70 px-4 py-4 text-sm text-kg-ink">
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

            <div className="relative hidden min-h-[420px] overflow-hidden lg:block">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${PANEL})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-kg-forest/90 via-kg-forest/45 to-transparent" />
              <div className="relative flex h-full flex-col justify-end p-8 text-white">
                <HeartHandshake className="h-9 w-9 text-kg-gold" />
                <h2 className="font-display mt-4 text-2xl font-semibold">
                  From the land of a thousand hills
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-white/80">
                  Tea hills and Kigali on the horizon — a quiet Rwandan identity for a serious health
                  education product.
                </p>
                <ul className="mt-5 space-y-2 text-sm text-white/85">
                  <li className="rounded-xl bg-white/10 px-3 py-2 backdrop-blur-sm">Visual family tree</li>
                  <li className="rounded-xl bg-white/10 px-3 py-2 backdrop-blur-sm">
                    Explainable educational findings
                  </li>
                  <li className="rounded-xl bg-white/10 px-3 py-2 backdrop-blur-sm">
                    Clinician conversation sheet
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <p className="mt-4 text-center text-[11px] text-white/70">
          Visuals: Rwanda-inspired landscapes for KinGuide branding (prototype assets).
        </p>
      </div>
    </div>
  );
}
