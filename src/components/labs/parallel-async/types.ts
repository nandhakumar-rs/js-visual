export type AsyncTaskMode = "sequential" | "parallel";

export interface ParallelAsyncInputs {
  mode: AsyncTaskMode;
}

export interface AsyncTaskState {
  id: string;
  label: string;
  durationMs: number;
  elapsedMs: number;
  status: "pending" | "running" | "done";
}

export interface ParallelAsyncStepState {
  tasks: AsyncTaskState[];
  totalElapsed: number;
}

export const TASKS = [
  { id: "user", label: "Get User", durationMs: 800 },
  { id: "posts", label: "Get Posts", durationMs: 1200 },
  { id: "settings", label: "Get Settings", durationMs: 500 },
];
