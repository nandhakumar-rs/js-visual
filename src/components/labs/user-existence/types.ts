export type SearchMethod = "for" | "some" | "find" | "findIndex";

export interface UserExistenceInputs {
  users: string[];
  searchName: string;
  method: SearchMethod;
}

export interface UserExistenceStepState {
  visitedIndex: number;
  matchedIndex: number;
  returnValue?: string;
}
