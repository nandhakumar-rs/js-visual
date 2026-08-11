import type { UserExistenceInputs } from "./types";

export function getCode({ searchName, outcome }: UserExistenceInputs): string[] {
  const q = JSON.stringify(searchName);
  switch (outcome) {
    case "some":
      return [`const exists = users.some(`, `  user => user.name === ${q}`, `);`];
    case "find":
      return [`const foundUser = users.find(`, `  user => user.name === ${q}`, `);`];
    case "findIndex":
      return [`const foundIndex = users.findIndex(`, `  user => user.name === ${q}`, `);`];
    case "forOf":
      return [
        "let exists = false;",
        "",
        "for (const user of users) {",
        `  if (user.name === ${q}) {`,
        "    exists = true;",
        "    break;",
        "  }",
        "}",
      ];
  }
}
