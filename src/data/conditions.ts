import type { ConditionDef } from "@/types/domain";

/** Controlled catalogue — labels only, no clinical thresholds. */
export const CONDITION_CATALOGUE: ConditionDef[] = [
  { id: "breast_cancer", label: "Breast cancer", category: "cancer" },
  { id: "ovarian_cancer", label: "Ovarian cancer", category: "cancer" },
  { id: "colorectal_cancer", label: "Bowel / colorectal cancer", category: "cancer" },
  { id: "early_heart_attack", label: "Heart attack (myocardial infarction)", category: "cardiovascular" },
  { id: "high_cholesterol", label: "Very high cholesterol / FH suspected", category: "metabolic" },
  { id: "diabetes", label: "Diabetes", category: "metabolic" },
  { id: "stroke", label: "Stroke", category: "neurological" },
  { id: "other", label: "Other documented condition", category: "other" },
];

export function conditionLabel(id: string): string {
  return CONDITION_CATALOGUE.find((c) => c.id === id)?.label ?? id;
}
