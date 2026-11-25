import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { AssessmentsPage } from "@/pages/AssessmentsPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { FindingsPage } from "@/pages/FindingsPage";
import { HistoryPage } from "@/pages/HistoryPage";
import { MembersPage } from "@/pages/MembersPage";
import { MissingPage } from "@/pages/MissingPage";
import { ReportsPage } from "@/pages/ReportsPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { TreePage } from "@/pages/TreePage";
import { WelcomePage } from "@/pages/WelcomePage";
import { useWorkspace } from "@/store/workspace";

function Gate() {
  const { ready, settings, refresh } = useWorkspace();

  useEffect(() => {
    void refresh();
  }, [refresh]);

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center text-slate-600">Loading KinGuide…</div>
    );
  }

  if (!settings?.onboardingDone) {
    return <WelcomePage />;
  }

  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<DashboardPage />} />
        <Route path="tree" element={<TreePage />} />
        <Route path="members" element={<MembersPage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="missing" element={<MissingPage />} />
        <Route path="assessments" element={<AssessmentsPage />} />
        <Route path="findings" element={<FindingsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Gate />
    </BrowserRouter>
  );
}
