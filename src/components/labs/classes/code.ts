import type { ClassesInputs } from "./types";

export function getCode({ name, showInheritance }: ClassesInputs): string[] {
  const base = [
    "class Employee {",
    "  constructor(name) {",
    "    this.name = name;",
    "  }",
    "",
    "  greet() {",
    "    return `Hello ${this.name}`;",
    "  }",
    "}",
  ];

  if (!showInheritance) {
    return [...base, "", `const employee = new Employee(${JSON.stringify(name)});`, "employee.greet();"];
  }

  return [
    ...base,
    "",
    "class Manager extends Employee {",
    "  constructor(name, team) {",
    "    super(name);",
    "    this.team = team;",
    "  }",
    "",
    "  greet() {",
    "    return `${super.greet()}, manager of ${this.team}`;",
    "  }",
    "}",
    "",
    `const manager = new Manager(${JSON.stringify(name)}, "Design");`,
    "manager.greet();",
  ];
}
