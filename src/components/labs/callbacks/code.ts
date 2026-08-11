import type { CallbacksInputs } from "./types";

export function getCode({ delayMs }: CallbacksInputs): string[] {
  return [
    "function getUser(id, callback) {",
    "  setTimeout(() => {",
    '    callback({ id, name: "Maya" });',
    `  }, ${delayMs});`,
    "}",
    "",
    "getUser(1, (user) => {",
    "  console.log(user);",
    "});",
  ];
}
