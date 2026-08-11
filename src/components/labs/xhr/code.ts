export function getCode(): string[] {
  return [
    "const xhr = new XMLHttpRequest();",
    'xhr.open("GET", "/users");',
    "",
    "xhr.onload = () => {",
    "  console.log(xhr.response);",
    "};",
    "",
    "xhr.onerror = () => {",
    '  console.error("Request failed");',
    "};",
    "",
    "xhr.send();",
  ];
}
