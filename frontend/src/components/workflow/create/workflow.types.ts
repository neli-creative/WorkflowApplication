export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type: "normal" | "condition";
}

export interface Transform {
  x: number;
  y: number;
  k: number;
}
