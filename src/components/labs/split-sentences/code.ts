import type { SplitSentencesInputs } from "./types";

export function getCode({ text }: SplitSentencesInputs): string[] {
  return [`const text = ${JSON.stringify(text)};`, "const sentences = text.split(/(?<=[.?!])\\s+/);"];
}
