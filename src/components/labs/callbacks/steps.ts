import type { ExecutionStep } from "@/lib/execution/types";
import type { CallbacksInputs, CallbacksStepState } from "./types";

function rightAwaySteps(): ExecutionStep<CallbacksStepState>[] {
  const base = {
    receiverName: "greet()",
    parameterName: "formatter",
  };

  return [
    {
      id: "shout-declared",
      title: "shout is a value",
      description:
        "shout is declared like any other function. Right now nothing has called it — it is simply a value sitting in the program, the same way a number or a string would be.",
      whyExplanation:
        "This is the whole idea the lesson rests on: `shout` is the function itself, and `shout()` is the result of running it. Only one of those can be handed to somebody else.",
      activeCodeLines: [1, 2, 3],
      state: {
        ...base,
        phase: "handing-over",
        callerStatus: "running",
        receiverStatus: "idle",
      },
    },
    {
      id: "handed-over",
      title: "greet is called with shout, not shout()",
      description:
        "greet receives two arguments: the string \"maya\", and the shout function itself. There are no parentheses after shout, so it is handed over uncalled.",
      whyExplanation:
        "Writing `shout()` here would run it first and hand `greet` the string it produced. Writing `shout` hands over the function, which lets `greet` decide when it runs.",
      activeCodeLines: [10],
      state: {
        ...base,
        phase: "held",
        callerStatus: "running",
        receiverStatus: "holding",
      },
    },
    {
      id: "receiver-names-it",
      title: "greet knows it as formatter",
      description:
        "Inside greet the second parameter is called formatter. It is the same function, under a name the receiving code chose.",
      whyExplanation:
        "The name `callback` has no special meaning in JavaScript. A function that receives one can call the parameter whatever it likes — here, `formatter`.",
      activeCodeLines: [5],
      state: {
        ...base,
        phase: "held",
        callerStatus: "running",
        receiverStatus: "holding",
        note: "Your code is still inside greet() — nothing has moved on.",
      },
    },
    {
      id: "invoked",
      title: "greet decides when — and picks now",
      description:
        "formatter(name) runs the function that was handed over, passing it the name greet was given.",
      whyExplanation:
        "Whoever receives the function is in charge of calling it. `greet` could have called it three times, or never. It calls it once, immediately.",
      activeCodeLines: [6],
      state: {
        ...base,
        phase: "calling-back",
        callerStatus: "running",
        receiverStatus: "calling",
        calledWith: [{ name: "name", displayValue: '"maya"', status: "set" }],
      },
    },
    {
      id: "returns",
      title: "shout returns its answer straight back",
      description:
        "shout builds \"MAYA!\" and returns it. Because greet called it right there on line 6, the returned value lands in text on the same line.",
      whyExplanation:
        "A return value works here because the answer already exists by the time `formatter(name)` finishes. That is exactly what stops working once the work finishes later — the next scenario.",
      activeCodeLines: [2, 6],
      state: {
        ...base,
        phase: "calling-back",
        callerStatus: "running",
        receiverStatus: "calling",
        calledWith: [{ name: "name", displayValue: '"maya"', status: "set" }],
        note: "The answer came back as a return value, not through another function.",
      },
    },
    {
      id: "logged",
      title: "greet logs the result",
      description: "console.log(text) prints MAYA! and the program is done.",
      whyExplanation:
        "Everything here happened in order, top to bottom. Handing a function to another function did not make any of it asynchronous.",
      activeCodeLines: [7],
      consoleOutput: [{ id: "ra-out-1", kind: "output", content: "MAYA!" }],
      state: {
        ...base,
        phase: "done",
        callerStatus: "finished",
        receiverStatus: "returned",
        calledWith: [{ name: "name", displayValue: '"maya"', status: "set" }],
      },
    },
  ];
}

function laterSteps(): ExecutionStep<CallbacksStepState>[] {
  const base = {
    receiverName: "getUser()",
    parameterName: "callback",
  };

  return [
    {
      id: "handed-over",
      title: "getUser is called with a function",
      description:
        "The arrow function written on lines 7 to 9 is handed to getUser as its second argument. getUser knows it as callback.",
      whyExplanation:
        "It is passed the same way `shout` was — as a value, uncalled. Writing it inline just means it has no name of its own.",
      activeCodeLines: [7, 8, 9],
      state: {
        ...base,
        phase: "held",
        callerStatus: "running",
        receiverStatus: "holding",
      },
    },
    {
      id: "schedules",
      title: "getUser hands the work to a timer and returns",
      description:
        "setTimeout asks a timer to run that inner function in one second. getUser does not wait for it — it reaches the end of its body and returns immediately.",
      whyExplanation:
        "getUser has no user to give back yet, so it returns without one. The timer holds the work in the meantime.",
      activeCodeLines: [2, 4],
      state: {
        ...base,
        phase: "working",
        callerStatus: "moved-on",
        receiverStatus: "working",
        note: "getUser() has already returned. Your callback has not run yet.",
      },
    },
    {
      id: "moves-on",
      title: "Your code keeps going",
      description:
        "Line 11 runs next and logs straight away — while the timer is still counting. This line is below the getUser call, but its output arrives first.",
      whyExplanation:
        "Nothing paused. `getUser` returned a moment ago, so the very next line ran, and the timer is still waiting in the background.",
      activeCodeLines: [11],
      consoleOutput: [{ id: "la-out-1", kind: "output", content: "getUser already returned" }],
      state: {
        ...base,
        phase: "working",
        callerStatus: "moved-on",
        receiverStatus: "working",
      },
    },
    {
      id: "timer-done",
      title: "A second later, the timer finishes",
      description:
        "The waiting is over, so the inner function runs — and the first thing it does is call the function you handed over.",
      whyExplanation:
        "Where your function waited during that second, and what decided this exact moment to run it, is the Event Loop lesson. For now: the timer kept it, and now hands it back.",
      activeCodeLines: [3],
      state: {
        ...base,
        phase: "calling-back",
        callerStatus: "moved-on",
        receiverStatus: "calling",
      },
    },
    {
      id: "called-back",
      title: "Your function is called with the user",
      description:
        "callback({ id: 1, name: \"Maya\" }) runs. The user object arrives as the argument named user, back on line 7.",
      whyExplanation:
        "This is the only route back into your code. `getUser` could not return the user, so it calls the function you gave it and passes the user as an argument instead.",
      activeCodeLines: [3, 7],
      state: {
        ...base,
        phase: "calling-back",
        callerStatus: "moved-on",
        receiverStatus: "calling",
        calledWith: [{ name: "user", displayValue: '{ id: 1, name: "Maya" }', status: "set" }],
      },
    },
    {
      id: "logged",
      title: "Maya is logged, last",
      description:
        "Line 8 runs and prints Maya — a full second after the line written below it had already printed.",
      whyExplanation:
        "The order the lines are written in is not the order they ran in. Anything that has to wait produces its output later, however far up the page it appears.",
      activeCodeLines: [8],
      consoleOutput: [{ id: "la-out-2", kind: "output", content: "Maya" }],
      state: {
        ...base,
        phase: "done",
        callerStatus: "finished",
        receiverStatus: "returned",
        calledWith: [{ name: "user", displayValue: '{ id: 1, name: "Maya" }', status: "set" }],
      },
    },
  ];
}

function failsSteps(): ExecutionStep<CallbacksStepState>[] {
  const base = {
    receiverName: "getUser()",
    parameterName: "callback",
  };

  return [
    {
      id: "handed-over",
      title: "This callback takes two parameters",
      description:
        "getUser is called with id 0 and a function that expects (error, user) — the error first, the result second.",
      whyExplanation:
        "This shape is a convention, not a language rule. Everyone agrees to put the error first so that every callback can be read the same way.",
      activeCodeLines: [11, 12, 13],
      state: {
        ...base,
        phase: "held",
        callerStatus: "running",
        receiverStatus: "holding",
      },
    },
    {
      id: "schedules",
      title: "getUser hands the work to a timer and returns",
      description:
        "As before, getUser sets a timer and returns immediately. Whether the lookup succeeds is not known yet.",
      whyExplanation:
        "getUser cannot return a user, and it cannot return an error either — neither exists at the moment it returns.",
      activeCodeLines: [2, 8],
      state: {
        ...base,
        phase: "working",
        callerStatus: "moved-on",
        receiverStatus: "working",
        note: "getUser() has already returned. Nothing has been decided yet.",
      },
    },
    {
      id: "branch",
      title: "The work fails",
      description: "A second later the timer fires and the check runs. id is 0, so there is no such user.",
      whyExplanation:
        "The failure happens inside the timer's function, long after `getUser` returned. There is no caller left standing there to hand it to.",
      activeCodeLines: [3],
      state: {
        ...base,
        phase: "working",
        callerStatus: "moved-on",
        receiverStatus: "working",
      },
    },
    {
      id: "called-error",
      title: "Your function is called with an error",
      description:
        "callback is called with an Error in the first slot and null in the second. Your function runs — it just gets bad news instead of a user.",
      whyExplanation:
        "Errors travel the same route results do. The callback is called either way; only which slot is filled changes.",
      activeCodeLines: [4],
      state: {
        ...base,
        phase: "calling-back",
        callerStatus: "moved-on",
        receiverStatus: "calling",
        failed: true,
        calledWith: [
          { name: "error", displayValue: "Error: No user 0", status: "error" },
          { name: "user", displayValue: "null", status: "null" },
        ],
      },
    },
    {
      id: "checks",
      title: "Your callback checks error first",
      description:
        "Line 12 finds an error, so it logs the failure and line 13 never runs. There is no user to print.",
      whyExplanation:
        "This is why the error goes first: every callback starts by asking whether it was handed a problem, before touching the result.",
      activeCodeLines: [11, 12],
      consoleOutput: [{ id: "fa-out-1", kind: "output", content: "Failed: No user 0" }],
      state: {
        ...base,
        phase: "done",
        callerStatus: "finished",
        receiverStatus: "returned",
        failed: true,
        calledWith: [
          { name: "error", displayValue: "Error: No user 0", status: "error" },
          { name: "user", displayValue: "null", status: "null" },
        ],
      },
    },
    {
      id: "not-thrown",
      title: "The error was delivered, never thrown",
      description:
        "Nothing here threw. The Error was created and passed as an ordinary argument, so wrapping the getUser call in try/catch would have caught nothing.",
      whyExplanation:
        "A `catch` block only sees errors thrown while it is running, and `getUser` had already returned. That gap is a large part of why Promises were introduced.",
      activeCodeLines: [11],
      state: {
        ...base,
        phase: "done",
        callerStatus: "finished",
        receiverStatus: "returned",
        failed: true,
        calledWith: [
          { name: "error", displayValue: "Error: No user 0", status: "error" },
          { name: "user", displayValue: "null", status: "null" },
        ],
        note: "try/catch around getUser(0, ...) would not have caught this.",
      },
    },
  ];
}

export function buildInitialSteps({ scenario }: CallbacksInputs): ExecutionStep<CallbacksStepState>[] {
  if (scenario === "right-away") return rightAwaySteps();
  if (scenario === "later") return laterSteps();
  return failsSteps();
}
