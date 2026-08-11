export type DelegationMode = "individual" | "delegation";

export interface EventDelegationInputs {
  mode: DelegationMode;
  itemCount: number;
}

export interface EventDelegationStepState {
  clickedLabel?: string;
  path: string[];
  activeIndex: number;
}
