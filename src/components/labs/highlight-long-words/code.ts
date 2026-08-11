import type { HighlightInputs } from "./types";

export function getCode({ text, threshold }: HighlightInputs): string[] {
  return [
    `const text = ${JSON.stringify(text)};`,
    'const words = text.split(" ");',
    "",
    "const highlighted = words",
    `  .map(word => word.length > ${threshold} ? \`<mark>\${word}</mark>\` : word)`,
    '  .join(" ");',
  ];
}
