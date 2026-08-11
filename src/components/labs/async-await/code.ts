import type { AsyncAwaitInputs } from "./types";

export function getCode({ style }: AsyncAwaitInputs): string[] {
  if (style === "promises") {
    return [
      "Promise.all([getUsers(), getStatuses()])",
      "  .then(([users, statuses]) => {",
      "    const combined = users.map((user, i) => ({",
      "      name: user.name,",
      "      active: statuses[i],",
      "    }));",
      "    console.log(combined);",
      "  })",
      "  .catch(error => console.error(error));",
    ];
  }
  return [
    "try {",
    "  const [users, statuses] = await Promise.all([",
    "    getUsers(),",
    "    getStatuses(),",
    "  ]);",
    "",
    "  const combined = users.map((user, i) => ({",
    "    name: user.name,",
    "    active: statuses[i],",
    "  }));",
    "",
    "  console.log(combined);",
    "} catch (error) {",
    "  console.error(error);",
    "}",
  ];
}
