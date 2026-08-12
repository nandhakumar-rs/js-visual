import type { ValuesRefInputs } from "./types";

export function getCode({ startingArray, newValue, mode }: ValuesRefInputs): string[] {
  const arrayLiteral = `[${startingArray.join(", ")}]`;

  if (mode === "share-mutate") {
    return [
      `const original = ${arrayLiteral};`,
      "const alias = original;",
      "",
      `alias.push(${newValue});`,
      "",
      'console.log("original:", original);',
      'console.log("alias:", alias);',
    ];
  }

  return [
    `const original = ${arrayLiteral};`,
    `const updated = [...original, ${newValue}];`,
    "",
    'console.log("original:", original);',
    'console.log("updated:", updated);',
  ];
}
