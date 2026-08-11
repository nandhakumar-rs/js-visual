export type LookupProperty = "name" | "greet" | "toString" | "madeUp";

export interface PrototypesInputs {
  property: LookupProperty;
}

export interface PrototypeLevel {
  id: string;
  label: string;
  ownProps: string[];
}

export const CHAIN: PrototypeLevel[] = [
  { id: "maya", label: "maya", ownProps: ["name"] },
  { id: "employee-proto", label: "Employee.prototype", ownProps: ["greet"] },
  { id: "object-proto", label: "Object.prototype", ownProps: ["toString", "hasOwnProperty"] },
];

export interface PrototypesStepState {
  checkedLevelIds: string[];
  foundAtLevelId?: string;
  reachedNull: boolean;
}
