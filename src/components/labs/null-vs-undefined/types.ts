export type ThirdValueOption = "undefined" | "null" | "0" | "empty-string" | "false";

export interface NullUndefinedInputs {
  thirdValue: ThirdValueOption;
}

export interface NullUndefinedStepState {
  revealedTypeofs: ("a" | "b" | "c")[];
}

export const THIRD_VALUE_META: Record<ThirdValueOption, { literal: string; value: unknown; typeofResult: string }> = {
  undefined: { literal: "undefined", value: undefined, typeofResult: "undefined" },
  null: { literal: "null", value: null, typeofResult: "object" },
  "0": { literal: "0", value: 0, typeofResult: "number" },
  "empty-string": { literal: '""', value: "", typeofResult: "string" },
  false: { literal: "false", value: false, typeofResult: "boolean" },
};
