export function getCode(): string[] {
  return [
    'fetch("/users")',
    "  .then(response => response.json())",
    "  .then(users => console.log(users))",
    "  .catch(error => console.error(error));",
  ];
}
