import type { AddLinkInputs } from "./types";

export function getCode({ href, text }: AddLinkInputs): string[] {
  return [
    'const link = document.createElement("a");',
    `link.href = ${JSON.stringify(href)};`,
    `link.textContent = ${JSON.stringify(text)};`,
    "",
    "container.appendChild(link);",
  ];
}
