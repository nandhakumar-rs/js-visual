export function getCode(): string[] {
  return [
    'const appName = "Visualize JS";',
    "",
    "function greetUser() {",
    '  const userName = "Maya";',
    "",
    "  if (userName) {",
    "    const message = `Welcome, ${userName}`;",
    "    console.log(message, appName);",
    "  }",
    "}",
    "",
    "greetUser();",
  ];
}
