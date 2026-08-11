import type { ExecutionStep } from "@/lib/execution/types";
import type { ClassesInputs, ClassesStepState } from "./types";

export function buildInitialSteps({ name, showInheritance }: ClassesInputs): ExecutionStep<ClassesStepState>[] {
  const defineEmployee: ExecutionStep<ClassesStepState> = {
    id: "define-employee",
    title: "Employee class defined",
    description: "The constructor runs whenever a new Employee is created; greet() is shared by every instance via the prototype.",
    activeCodeLines: [1, 2, 3, 4, 6, 7, 8, 9],
    state: { props: [] },
  };

  if (!showInheritance) {
    return [
      defineEmployee,
      {
        id: "create-employee",
        title: `new Employee(${JSON.stringify(name)})`,
        description: `A new object is created, and the constructor runs with this bound to it, setting name = "${name}".`,
        whyExplanation: "The `new` keyword creates a fresh object, runs the constructor with this pointing at it, and returns that object.",
        activeCodeLines: [11],
        state: { instanceLabel: "employee", className: "Employee", props: [{ key: "name", value: name }] },
      },
      {
        id: "call-employee",
        title: "employee.greet()",
        description: `greet() runs with this = employee, returning "Hello ${name}".`,
        activeCodeLines: [12],
        consoleOutput: [
          { id: "log-1", kind: "command", content: "employee.greet()" },
          { id: "log-2", kind: "output", content: `"Hello ${name}"` },
        ],
        state: {
          instanceLabel: "employee",
          className: "Employee",
          props: [{ key: "name", value: name }],
          result: `Hello ${name}`,
        },
      },
    ];
  }

  return [
    defineEmployee,
    {
      id: "define-manager",
      title: "Manager extends Employee",
      description: "Manager inherits everything from Employee, then overrides greet() and adds its own constructor.",
      whyExplanation: "extends wires Manager's prototype chain to Employee.prototype, so Manager instances fall back to Employee's methods unless overridden.",
      activeCodeLines: [11, 12, 13, 14, 15, 17, 18, 19, 20],
      state: { props: [] },
    },
    {
      id: "create-manager",
      title: `new Manager(${JSON.stringify(name)}, "Design")`,
      description: `super(name) calls Employee's constructor first (setting name), then this.team = "Design" runs.`,
      whyExplanation: "super(...) must run before you can use `this` in a subclass constructor — it delegates to the parent class's constructor.",
      activeCodeLines: [13, 14],
      state: {
        instanceLabel: "manager",
        className: "Manager",
        props: [
          { key: "name", value: name },
          { key: "team", value: "Design" },
        ],
      },
    },
    {
      id: "call-manager",
      title: "manager.greet()",
      description: "Manager's own greet() runs, calling super.greet() to reuse Employee's version, then adding the team.",
      whyExplanation: "super.greet() explicitly calls the parent class's version of the method — a common pattern for extending, not just replacing, inherited behavior.",
      activeCodeLines: [18],
      consoleOutput: [
        { id: "log-1", kind: "command", content: "manager.greet()" },
        { id: "log-2", kind: "output", content: `"Hello ${name}, manager of Design"` },
      ],
      state: {
        instanceLabel: "manager",
        className: "Manager",
        props: [
          { key: "name", value: name },
          { key: "team", value: "Design" },
        ],
        result: `Hello ${name}, manager of Design`,
      },
    },
  ];
}
