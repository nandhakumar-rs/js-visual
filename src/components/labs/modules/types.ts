export type ExportStyle = "named" | "default";

export interface ModulesInputs {
  exportStyle: ExportStyle;
}

export interface ModulesStepState {
  mathDefined: boolean;
  imported: boolean;
  result?: number;
}
