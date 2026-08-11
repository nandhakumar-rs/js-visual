import type { CallbackToPromiseInputs } from "./types";

export function getCode({ style }: CallbackToPromiseInputs): string[] {
  if (style === "callback") {
    return [
      "function getUser(id, callback) {",
      "  setTimeout(() => {",
      '    callback(null, { id, name: "Maya" });',
      "  }, 800);",
      "}",
      "",
      "getUser(1, (err, user) => {",
      "  console.log(user);",
      "});",
    ];
  }
  return [
    "function getUser(id) {",
    "  return new Promise((resolve, reject) => {",
    "    setTimeout(() => {",
    '      resolve({ id, name: "Maya" });',
    "    }, 800);",
    "  });",
    "}",
    "",
    "getUser(1).then(user => console.log(user));",
  ];
}
