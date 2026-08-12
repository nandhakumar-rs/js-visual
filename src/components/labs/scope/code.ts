export function getCode(): string[] {
  return [
    'const appName = "JS Visual Lab";',
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
