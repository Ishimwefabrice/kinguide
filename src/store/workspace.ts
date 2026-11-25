import { create } from "zustand";
import {
  clearAllData,
  loadSampleFamily,
  loadWorkspace,
  runAssessment,
} from "@/database/repositories";
import type {
  AppSettings,
  Assessment,
  Finding,
  MedicalHistoryEntry,
  Person,
  Relationship,
} from "@/types/domain";

interface WorkspaceState {
  ready: boolean;
  persons: Person[];
  relationships: Relationship[];
  history: MedicalHistoryEntry[];
  assessments: Assessment[];
  findings: Finding[];
  settings: AppSettings | null;
  refresh: () => Promise<void>;
  loadSample: () => Promise<void>;
  clearAll: () => Promise<void>;
  assess: () => Promise<void>;
}

export const useWorkspace = create<WorkspaceState>((set, get) => ({
  ready: false,
  persons: [],
  relationships: [],
  history: [],
  assessments: [],
  findings: [],
  settings: null,
  async refresh() {
    const data = await loadWorkspace();
    set({ ...data, ready: true });
  },
  async loadSample() {
    await loadSampleFamily();
    await get().refresh();
  },
  async clearAll() {
    await clearAllData();
    await get().refresh();
  },
  async assess() {
    await runAssessment();
    await get().refresh();
  },
}));
