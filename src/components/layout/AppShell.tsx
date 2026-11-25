import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  Activity,
  AlertCircle,
  ClipboardList,
  FileText,
  GitBranch,
  LayoutDashboard,
  Menu,
  Settings,
  ShieldCheck,
  Stethoscope,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/tree", label: "Family Tree", icon: GitBranch },
  { to: "/members", label: "Family Members", icon: Users },
  { to: "/history", label: "Medical History", icon: Stethoscope },
  { to: "/missing", label: "Missing Info", icon: AlertCircle },
  { to: "/assessments", label: "Assessments", icon: ClipboardList },
  { to: "/findings", label: "Findings", icon: Activity },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function AppShell() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
      <aside
        className={cn(
          "no-print pattern-imigongo z-30 border-kg-border bg-kg-forest text-white lg:relative lg:block lg:min-h-screen lg:border-r",
          open ? "fixed inset-0 block" : "hidden lg:block",
        )}
      >
        <div className="flex h-full flex-col bg-gradient-to-b from-kg-forest to-[#053a2e]">
          <div className="flex items-start justify-between px-5 py-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-kg-gold/90 text-sm font-bold text-kg-forest shadow-sm">
                  KG
                </span>
                <div className="font-display text-2xl font-bold tracking-tight">KinGuide</div>
              </div>
              <p className="mt-2 text-xs text-white/65">Family history · educational patterns</p>
            </div>
            <button
              type="button"
              className="rounded-lg p-2 text-white/80 hover:bg-white/10 lg:hidden"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex flex-1 flex-col gap-1 px-3 pb-6">
            {NAV.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                    isActive
                      ? "bg-white text-kg-forest shadow-sm"
                      : "text-white/80 hover:bg-white/10 hover:text-white",
                  )
                }
              >
                <Icon className="h-4 w-4 shrink-0 opacity-90" />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="mx-3 mb-5 rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-xs text-white/70">
            <div className="mb-1 flex items-center gap-1.5 font-semibold text-kg-gold">
              <ShieldCheck className="h-3.5 w-3.5" />
              Educational use
            </div>
            Not a medical device. Data stays on this device.
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="no-print sticky top-0 z-20 border-b border-kg-border bg-kg-white/90 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
            <button
              type="button"
              className="rounded-xl border border-kg-border p-2 text-kg-navy lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-kg-muted">
                Educational prototype — unknown facts stay unknown.
              </p>
            </div>
            <span className="hidden rounded-full bg-kg-mint px-3 py-1 text-xs font-semibold text-kg-green sm:inline">
              Local-first
            </span>
          </div>
        </header>
        <main className="page-enter px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
