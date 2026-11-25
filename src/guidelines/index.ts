import type { Finding, Guideline, Person } from "../types";
import { breastOvarianGuideline } from "./breastOvarian";
import { colorectalGuideline } from "./colorectal";
import { heartGuideline } from "./heart";

export const GUIDELINES: Guideline[] = [
  breastOvarianGuideline,
  colorectalGuideline,
  heartGuideline,
];

export function evaluateAll(people: Person[]): Finding[] {
  return GUIDELINES.map((g) => g.evaluate(people));
}
