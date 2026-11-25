import { NavLink, Outlet } from "react-router-dom";
import {
  Activity,
  ClipboardList,
  FileText,
  GitBranch,
  LayoutDashboard,
  Settings,
  Stethoscope,
  Users,
  AlertCircle,
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
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="no-print border-b border-slate-200 bg-navy-950 text-slate-100 lg:min-h-screen lg:border-b-0 lg:border-r lg:border-navy-800">
        <div className="px-5 py-6">
          <div className="font-display text-2xl tracking-tight text-white">KinGuide</div>
          <p className="mt-1 text-xs text-slate-400">Family history · educational patterns</p>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-4 lg:flex-col">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm transition",
                  isActive
                    ? "bg-teal-600 text-white"
                    : "text-slate-300 hover:bg-navy-800 hover:text-white",
                )
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="min-w-0">
        <header className="no-print sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur sm:px-6">
          <p className="text-sm text-slate-600">
            Educational prototype — not a medical device. Unknown facts stay unknown.
          </p>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
