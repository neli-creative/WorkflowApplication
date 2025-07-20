export type NodeType = {
  id: string;
  type?: string;
  prompt: string;
  condition?: { [key: string]: string };
  next?: string;
  x?: number;
  y?: number;
};

export interface NodeColor {
  bg: string;
  border: string;
}

export interface NodesProps {
  transform: { x: number; y: number; k: number };
  handleNodeClick: (node: NodeType) => void;
  nodes: NodeType[];
}
