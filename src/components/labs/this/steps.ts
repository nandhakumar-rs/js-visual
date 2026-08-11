import type { ExecutionStep } from "@/lib/execution/types";
import type { ThisInputs, ThisStepState } from "./types";

export function buildInitialSteps({ scenario, useBind }: ThisInputs): ExecutionStep<ThisStepState>[] {
  switch (scenario) {
    case "object-method":
      return [
        {
          id: "define",
          title: "person object defined",
          description: "person has a name property and a sayHello method.",
          activeCodeLines: [1, 2, 3, 4, 5, 6],
          state: { thisLabel: "(not called yet)", result: "", isError: false },
        },
        {
          id: "call",
          title: "person.sayHello() runs",
          description: "sayHello is called AS A METHOD of person, so this is bound to person.",
          whyExplanation: "When a function is called as obj.method(), this is set to obj — that's implicit binding.",
          activeCodeLines: [8],
          consoleOutput: [
            { id: "log-1", kind: "command", content: "person.sayHello()" },
            { id: "log-2", kind: "output", content: '"Maya"' },
          ],
          state: { thisLabel: "person", result: "Maya", isError: false },
        },
      ];

    case "regular-function":
      return [
        {
          id: "define",
          title: "sayHello defined",
          description: "A plain function, not attached to any object.",
          activeCodeLines: [1, 2, 3],
          state: { thisLabel: "(not called yet)", result: "", isError: false },
        },
        {
          id: "call",
          title: "sayHello() runs",
          description: "Called with no receiving object, so this is undefined (in strict mode / ES modules).",
          whyExplanation:
            "A plain function call like sayHello() has no object before the dot, so there's nothing to bind this to — modern (strict-mode) JavaScript leaves it as undefined instead of falling back to the global object.",
          activeCodeLines: [5],
          consoleOutput: [
            { id: "log-1", kind: "command", content: "sayHello()" },
            { id: "log-2", kind: "output", content: "undefined" },
          ],
          state: { thisLabel: "undefined", result: "undefined", isError: false },
        },
      ];

    case "arrow-function":
      return [
        {
          id: "define",
          title: "person object defined",
          description: "sayHello is an arrow function this time.",
          activeCodeLines: [1, 2, 3, 4, 5, 6],
          state: { thisLabel: "(not called yet)", result: "", isError: false },
        },
        {
          id: "call",
          title: "person.sayHello() runs",
          description: "Arrow functions don't have their own this — they use this from where they were DEFINED, not how they're called.",
          whyExplanation:
            "sayHello was defined at the top level, so its this is the surrounding (outer) this, not person — calling it as person.sayHello() doesn't change that.",
          activeCodeLines: [8],
          consoleOutput: [
            { id: "log-1", kind: "command", content: "person.sayHello()" },
            { id: "log-2", kind: "output", content: "undefined" },
          ],
          state: { thisLabel: "outer scope (not person)", result: "undefined", isError: false },
        },
      ];

    case "class-method":
      return [
        {
          id: "define",
          title: "Person class defined",
          description: "The constructor sets this.name; sayHello reads this.name.",
          activeCodeLines: [1, 2, 3, 4, 5, 6, 7, 8],
          state: { thisLabel: "(not called yet)", result: "", isError: false },
        },
        {
          id: "construct",
          title: "new Person(\"Maya\")",
          description: "new creates a fresh object and binds this to it inside the constructor.",
          whyExplanation: "The `new` keyword creates a new object, sets this to that object for the constructor call, and returns it.",
          activeCodeLines: [10],
          state: { thisLabel: "new instance", result: "", isError: false },
        },
        {
          id: "call",
          title: "maya.sayHello()",
          description: "Called as a method on maya, so this is maya — same implicit-binding rule as any object method.",
          activeCodeLines: [11],
          consoleOutput: [
            { id: "log-1", kind: "command", content: "maya.sayHello()" },
            { id: "log-2", kind: "output", content: '"Maya"' },
          ],
          state: { thisLabel: "maya", result: "Maya", isError: false },
        },
      ];

    case "detached-method": {
      const defineStep: ExecutionStep<ThisStepState> = {
        id: "define",
        title: "detached = person.sayHello",
        description: "Copying the method into a plain variable detaches it from person — only the function itself is copied, not its connection to person.",
        activeCodeLines: [1, 2, 3, 4, 5, 6, 8],
        state: { thisLabel: "(not called yet)", result: "", isError: false },
      };

      if (useBind) {
        return [
          defineStep,
          {
            id: "bind",
            title: "detached.bind(person)",
            description: "bind() returns a new function permanently locked to this = person, no matter how it's later called.",
            whyExplanation: "bind() is explicit binding — it hard-wires this so that even a detached call can't change it.",
            activeCodeLines: [9],
            state: { thisLabel: "person (bound)", result: "", isError: false },
          },
          {
            id: "call",
            title: "bound()",
            description: "Because this was bound to person, the call works correctly.",
            activeCodeLines: [10],
            consoleOutput: [
              { id: "log-1", kind: "command", content: "bound()" },
              { id: "log-2", kind: "output", content: '"Maya"' },
            ],
            state: { thisLabel: "person (bound)", result: "Maya", isError: false },
          },
        ];
      }

      return [
        defineStep,
        {
          id: "call",
          title: "detached()",
          description: "Called with no object before the dot, so this is undefined — reading this.name throws.",
          whyExplanation: "Detaching a method from its object loses the implicit binding. Without bind(), this reverts to undefined on a plain call.",
          activeCodeLines: [9],
          consoleOutput: [
            { id: "log-1", kind: "command", content: "detached()" },
            { id: "log-2", kind: "error", content: "Uncaught TypeError: Cannot read properties of undefined (reading 'name')" },
          ],
          state: { thisLabel: "undefined", result: "TypeError", isError: true },
        },
      ];
    }
  }
}
