export interface DeepComparisonInputs {
  nameA: string;
  nameB: string;
  cityA: string;
  cityB: string;
}

export interface CheckedNode {
  path: string;
  match: boolean;
}

export interface DeepComparisonStepState {
  checked: CheckedNode[];
  activePath?: string;
  comparisons: number;
  result?: boolean;
}
