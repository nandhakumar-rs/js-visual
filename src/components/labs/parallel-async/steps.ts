import type { ExecutionStep } from "@/lib/execution/types";
import { TASKS, type AsyncTaskState, type ParallelAsyncInputs, type ParallelAsyncStepState } from "./types";

function initialTasks(): AsyncTaskState[] {
  return TASKS.map((t) => ({ ...t, elapsedMs: 0, status: "pending" }));
}

export function buildInitialSteps({ mode }: ParallelAsyncInputs): ExecutionStep<ParallelAsyncStepState>[] {
  const seed: ExecutionStep<ParallelAsyncStepState> = {
    id: "seed",
    title: "Ready to start",
    description: "Three independent requests are about to be made.",
    activeCodeLines: [],
    state: { tasks: initialTasks(), totalElapsed: 0 },
  };

  if (mode === "sequential") {
    const steps: ExecutionStep<ParallelAsyncStepState>[] = [seed];
    let elapsedTotal = 0;
    const tasks = initialTasks();

    TASKS.forEach((task, i) => {
      tasks[i] = { ...tasks[i], status: "running" };
      steps.push({
        id: `${task.id}-start`,
        title: `await ${task.label.replace("Get ", "get").replace(" ", "")}() starts`,
        description: `Execution pauses here until ${task.label} resolves — the next request hasn't started yet.`,
        activeCodeLines: [i],
        durationMs: Math.min(task.durationMs, 900),
        state: { tasks: tasks.map((t) => ({ ...t })), totalElapsed: elapsedTotal },
      });

      elapsedTotal += task.durationMs;
      tasks[i] = { ...tasks[i], status: "done", elapsedMs: task.durationMs };
      steps.push({
        id: `${task.id}-done`,
        title: `${task.label} resolves (${task.durationMs}ms)`,
        description: `Running total so far: ${elapsedTotal}ms.`,
        activeCodeLines: [i],
        state: { tasks: tasks.map((t) => ({ ...t })), totalElapsed: elapsedTotal },
      });
    });

    steps.push({
      id: "done",
      title: "All requests complete",
      description: `Sequential total: ${elapsedTotal}ms — the sum of every individual duration.`,
      whyExplanation: "Awaiting each call one at a time means each one waits for the previous one to fully finish before starting.",
      activeCodeLines: [4],
      consoleOutput: [{ id: "log-1", kind: "output", content: `Sequential total: ${elapsedTotal}ms` }],
      state: { tasks: tasks.map((t) => ({ ...t })), totalElapsed: elapsedTotal },
    });

    return steps;
  }

  // Parallel: all tasks start together; total is the longest single duration.
  const maxDuration = Math.max(...TASKS.map((t) => t.durationMs));
  const runningTasks = initialTasks().map((t) => ({ ...t, status: "running" as const }));

  const startStep: ExecutionStep<ParallelAsyncStepState> = {
    id: "start-all",
    title: "All three requests start together",
    description: "Promise.all() fires every request at once instead of waiting between them.",
    activeCodeLines: [0, 1, 2, 3],
    durationMs: Math.min(maxDuration, 900),
    state: { tasks: runningTasks, totalElapsed: 0 },
  };

  const completionSteps: ExecutionStep<ParallelAsyncStepState>[] = [...TASKS]
    .sort((a, b) => a.durationMs - b.durationMs)
    .map((task) => {
      const tasksAtThisPoint = runningTasks.map((t) =>
        t.durationMs <= task.durationMs ? { ...t, status: "done" as const, elapsedMs: t.durationMs } : t
      );
      return {
        id: `${task.id}-done`,
        title: `${task.label} resolves (${task.durationMs}ms)`,
        description: `The other requests keep running in the background — they don't wait for each other.`,
        activeCodeLines: [1, 2, 3],
        state: { tasks: tasksAtThisPoint, totalElapsed: task.durationMs },
      };
    });

  const doneStep: ExecutionStep<ParallelAsyncStepState> = {
    id: "done",
    title: "Promise.all() resolves",
    description: `Parallel total: ${maxDuration}ms — bounded by the slowest request, not the sum of all of them.`,
    whyExplanation: "Promise.all() waits only for the LAST promise to settle. Since they all started together, the total is just the longest individual duration.",
    activeCodeLines: [4],
    consoleOutput: [{ id: "log-1", kind: "output", content: `Parallel total: ${maxDuration}ms` }],
    state: { tasks: runningTasks.map((t) => ({ ...t, status: "done", elapsedMs: t.durationMs })), totalElapsed: maxDuration },
  };

  return [seed, startStep, ...completionSteps, doneStep];
}
