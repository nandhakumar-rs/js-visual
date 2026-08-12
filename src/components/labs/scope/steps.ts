import type { ExecutionStep } from "@/lib/execution/types";
import type { ScopeStepState, ScopeVarEntry } from "./types";

const appName: ScopeVarEntry = { name: "appName", displayValue: '"JS Visual Lab"', status: "set" };
const greetUser: ScopeVarEntry = { name: "greetUser", displayValue: "ƒ", status: "set" };
const userName: ScopeVarEntry = { name: "userName", displayValue: '"Maya"', status: "set" };
const message: ScopeVarEntry = { name: "message", displayValue: '"Welcome, Maya"', status: "set" };

// The walkthrough is fixed — nothing about it varies with inputs.
export function buildInitialSteps(): ExecutionStep<ScopeStepState>[] {
  return [
    {
      id: "global-start",
      title: "Global scope is ready",
      description: "The script begins in the global scope, where appName and the greetUser function are both declared.",
      whyExplanation:
        "JavaScript starts in the global scope. `appName` is available from here and from scopes created inside it.",
      activeCodeLines: [1],
      state: {
        currentScope: "global",
        functionOpen: false,
        blockOpen: false,
        globalVars: [appName, greetUser],
        functionVars: [],
        blockVars: [],
      },
    },
    {
      id: "function-called",
      title: "greetUser() is called",
      description: "Calling greetUser() opens a new function scope inside the global scope.",
      whyExplanation: "Calling `greetUser()` creates a function scope inside the global scope.",
      activeCodeLines: [12],
      state: {
        currentScope: "function",
        functionOpen: true,
        blockOpen: false,
        globalVars: [appName, greetUser],
        functionVars: [],
        blockVars: [],
      },
    },
    {
      id: "username-created",
      title: "userName is created",
      description: "userName is declared inside greetUser(), so it belongs to the function scope.",
      whyExplanation:
        "`userName` belongs to the function. Code inside `greetUser()` can use it, but global code cannot look inward to reach it.",
      activeCodeLines: [4],
      state: {
        currentScope: "function",
        functionOpen: true,
        blockOpen: false,
        globalVars: [appName, greetUser],
        functionVars: [userName],
        blockVars: [],
      },
    },
    {
      id: "enters-block",
      title: "JavaScript enters the block",
      description: "JavaScript looks up userName in the current function scope, finds it, and enters the if block.",
      whyExplanation:
        "JavaScript finds `userName` in the current function scope. Because it has a value, execution enters the block.",
      activeCodeLines: [6],
      state: {
        currentScope: "block",
        functionOpen: true,
        blockOpen: true,
        globalVars: [appName, greetUser],
        functionVars: [userName],
        blockVars: [],
        lookups: [{ variable: "userName", path: ["function"], foundIn: "function" }],
      },
    },
    {
      id: "message-created",
      title: "message is created",
      description:
        "message is declared inside the if block, so it belongs to the block scope. It can still read userName from the enclosing function.",
      whyExplanation: "`message` belongs only to this block. The block can still look outward and use `userName`.",
      activeCodeLines: [7],
      state: {
        currentScope: "block",
        functionOpen: true,
        blockOpen: true,
        globalVars: [appName, greetUser],
        functionVars: [userName],
        blockVars: [message],
        lookups: [{ variable: "userName", path: ["block", "function"], foundIn: "function" }],
      },
    },
    {
      id: "values-resolved",
      title: "Values are resolved",
      description:
        "console.log(message, appName) runs. message resolves immediately; appName is found only after walking out to the global scope.",
      whyExplanation:
        "JavaScript finds `message` nearby. It cannot find `appName` in the block or function, so it keeps looking outward until it reaches the global scope.",
      activeCodeLines: [8],
      consoleOutput: [
        { id: "log-cmd", kind: "command", content: "console.log(message, appName)" },
        { id: "log-out", kind: "output", content: "Welcome, Maya JS Visual Lab" },
      ],
      state: {
        currentScope: "block",
        functionOpen: true,
        blockOpen: true,
        globalVars: [appName, greetUser],
        functionVars: [userName],
        blockVars: [message],
        lookups: [
          { variable: "message", path: ["block"], foundIn: "block" },
          { variable: "appName", path: ["block", "function", "global"], foundIn: "global" },
        ],
      },
    },
    {
      id: "scopes-finish",
      title: "Inner scopes finish",
      description: "The block and function finish and their scopes close. Only the global scope remains.",
      whyExplanation:
        "After the block and function finish, global code still cannot access `message` or `userName`. Those bindings belonged to inner scopes.",
      activeCodeLines: [9, 10],
      state: {
        currentScope: "global",
        functionOpen: false,
        blockOpen: false,
        globalVars: [appName, greetUser],
        functionVars: [],
        blockVars: [],
      },
    },
  ];
}
