import { THIRD_VALUE_META, type NullUndefinedInputs } from "./types";

export function getCode({ thirdValue }: NullUndefinedInputs): string[] {
  return [
    "let a;",
    "let b = null;",
    `let c = ${THIRD_VALUE_META[thirdValue].literal};`,
    "",
    "typeof a;",
    "typeof b;",
    "typeof c;",
  ];
}
