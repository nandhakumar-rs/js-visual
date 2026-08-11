export function getCode(): string[] {
  return [
    "const [users, statuses] = await Promise.all([",
    "  getUsers(),",
    "  getStatuses(),",
    "]);",
    "",
    "const combined = users.map((user, i) => ({",
    "  name: user.name,",
    "  active: statuses[i],",
    "}));",
  ];
}
