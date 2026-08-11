import type { PrototypesInputs } from "./types";

export function getCode({ property }: PrototypesInputs): string[] {
  return [
    "class Employee {",
    "  constructor(name) {",
    "    this.name = name;",
    "  }",
    "",
    "  greet() {",
    '    return `Hello ${this.name}`;',
    "  }",
    "}",
    "",
    'const maya = new Employee("Maya");',
    "",
    `maya.${property};`,
  ];
}
