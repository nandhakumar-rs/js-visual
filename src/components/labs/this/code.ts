import type { ThisInputs } from "./types";

export function getCode({ scenario, useBind }: ThisInputs): string[] {
  switch (scenario) {
    case "object-method":
      return [
        "const person = {",
        '  name: "Maya",',
        "  sayHello() {",
        "    return this.name;",
        "  }",
        "};",
        "",
        "person.sayHello();",
      ];
    case "regular-function":
      return ["function sayHello() {", "  return this;", "}", "", "sayHello();"];
    case "arrow-function":
      return [
        "const person = {",
        '  name: "Maya",',
        "  sayHello: () => {",
        "    return this.name;",
        "  }",
        "};",
        "",
        "person.sayHello();",
      ];
    case "class-method":
      return [
        "class Person {",
        "  constructor(name) {",
        "    this.name = name;",
        "  }",
        "  sayHello() {",
        "    return this.name;",
        "  }",
        "}",
        "",
        'const maya = new Person("Maya");',
        "maya.sayHello();",
      ];
    case "detached-method": {
      const lines = [
        "const person = {",
        '  name: "Maya",',
        "  sayHello() {",
        "    return this.name;",
        "  }",
        "};",
        "",
        "const detached = person.sayHello;",
      ];
      return useBind
        ? [...lines, "const bound = detached.bind(person);", "bound();"]
        : [...lines, "detached();"];
    }
  }
}
