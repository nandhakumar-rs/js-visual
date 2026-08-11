import type { UserExistenceInputs } from "./types";

export function getCode({ searchName, method }: UserExistenceInputs): string[] {
  const q = JSON.stringify(searchName);
  switch (method) {
    case "for":
      return [
        "let found;",
        "for (let i = 0; i < users.length; i++) {",
        `  if (users[i] === ${q}) {`,
        "    found = users[i];",
        "    break;",
        "  }",
        "}",
      ];
    case "some":
      return [`const exists = users.some(name => name === ${q});`];
    case "find":
      return [`const user = users.find(name => name === ${q});`];
    case "findIndex":
      return [`const index = users.findIndex(name => name === ${q});`];
  }
}
