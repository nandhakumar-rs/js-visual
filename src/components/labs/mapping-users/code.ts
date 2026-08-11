import type { MappingInputs } from "./types";

export function getCode({ users, property }: MappingInputs): string[] {
  return [
    "const users = [",
    ...users.map((u, i) => `  { name: ${JSON.stringify(u.name)}, age: ${u.age} }${i < users.length - 1 ? "," : ""}`),
    "];",
    "",
    `const result = users.map(user => user.${property});`,
  ];
}
