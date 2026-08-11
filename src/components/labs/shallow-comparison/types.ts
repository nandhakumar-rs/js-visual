export interface ShallowComparisonInputs {
  nameA: string;
  nameB: string;
  cityA: string;
  cityB: string;
  shareAddressRef: boolean;
}

export interface ShallowComparisonStepState {
  checkedKeys: ("name" | "address")[];
  nameMatch?: boolean;
  addressMatch?: boolean;
  result?: boolean;
}
