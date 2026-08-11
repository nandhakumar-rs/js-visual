export interface MappingUser {
  id: string;
  name: string;
  age: number;
}

export type MappedProperty = "name" | "age";

export interface MappingInputs {
  users: MappingUser[];
  property: MappedProperty;
}

export interface MappingStepState {
  processedIds: string[];
  activeId?: string;
  result: (string | number)[];
}
