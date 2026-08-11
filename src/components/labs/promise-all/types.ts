export interface PromiseAllInputs {
  statusesFail: boolean;
}

export interface RequestState {
  id: string;
  label: string;
  status: "pending" | "fulfilled" | "rejected";
}

export interface PromiseAllStepState {
  requests: RequestState[];
  allState: "pending" | "fulfilled" | "rejected";
  combined?: { name: string; active: boolean }[];
  errorMessage?: string;
}
