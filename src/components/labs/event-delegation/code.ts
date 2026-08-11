import type { EventDelegationInputs } from "./types";

export function getCode({ mode, itemCount }: EventDelegationInputs): string[] {
  if (mode === "individual") {
    return [
      "// One listener PER item",
      "items.forEach(item => {",
      '  item.addEventListener("click", handleClick);',
      "});",
      "",
      `// ${itemCount} listeners registered`,
    ];
  }
  return [
    "// ONE listener on the shared parent",
    'list.addEventListener("click", (event) => {',
    '  if (event.target.matches("button")) {',
    "    handleClick(event);",
    "  }",
    "});",
    "",
    "// 1 listener registered",
  ];
}
