export interface ClassesInputs {
  name: string;
  showInheritance: boolean;
}

export interface ClassesStepState {
  instanceLabel?: string;
  className?: string;
  props: { key: string; value: string }[];
  result?: string;
}
