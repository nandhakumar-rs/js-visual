export type SearchOutcome = "some" | "find" | "findIndex" | "forOf";

export interface UserExistenceUser {
  name: string;
}

export interface UserExistenceInputs {
  users: UserExistenceUser[];
  searchName: string;
  outcome: SearchOutcome;
}

export interface UserExistenceStepState {
  checkedIndices: number[];
  matchedIndex: number;
  stopped: boolean;
}
