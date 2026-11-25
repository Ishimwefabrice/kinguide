import type { EducationalRule } from "./rule-types";
import { demoBreastOvarianRule } from "./rules/demo-breast-ovarian";
import { demoColorectalRule } from "./rules/demo-colorectal";
import { demoHeartRule } from "./rules/demo-heart";

/** Clinical registry is empty until rules are professionally reviewed. */
export const CLINICAL_RULES: EducationalRule[] = [];

/** Active demonstration pack — clearly NON-CLINICAL. */
export const DEMONSTRATION_RULES: EducationalRule[] = [
  demoBreastOvarianRule,
  demoColorectalRule,
  demoHeartRule,
];

export const RULE_SET_VERSION = "demo-pack-1.0.0";

export function activeRules(): EducationalRule[] {
  return [...CLINICAL_RULES, ...DEMONSTRATION_RULES];
}
