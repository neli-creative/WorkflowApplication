import { NodeType } from "@/components/workflow/create/Node/node.type";
import {
  LEVEL_SPACING,
  NODE_HEIGHT,
  NODE_SPACING,
  NODE_WIDTH,
} from "@/components/workflow/create/workflow.constants";
import { WorkflowEdge } from "@/components/workflow/create/workflow.types";

export const calculateLayout = (
  nodes: NodeType[],
  edges: WorkflowEdge[],
): NodeType[] => {
  const nodeMap = new Map<string, NodeType>();
  const incomingEdges = new Map<string, WorkflowEdge[]>();
  const outgoingEdges = new Map<string, WorkflowEdge[]>();

  nodes.forEach((node) => {
    nodeMap.set(node.id, node);
    incomingEdges.set(node.id, []);
    outgoingEdges.set(node.id, []);
  });

  edges.forEach((edge) => {
    incomingEdges.get(edge.target)?.push(edge);
    outgoingEdges.get(edge.source)?.push(edge);
  });

  const rootNodes = nodes.filter(
    (node) => incomingEdges.get(node.id)?.length === 0,
  );

  const levels = new Map<string, number>();
  const visited = new Set<string>();

  const calculateLevel = (nodeId: string, level = 0): number => {
    if (visited.has(nodeId)) return levels.get(nodeId) || 0;

    visited.add(nodeId);
    levels.set(nodeId, level);

    outgoingEdges.get(nodeId)?.forEach((edge) => {
      const childLevel = calculateLevel(edge.target, level + 1);

      if (childLevel <= level) {
        levels.set(edge.target, level + 1);
      }
    });

    return level;
  };

  rootNodes.forEach((node) => calculateLevel(node.id));

  const levelGroups = new Map<number, NodeType[]>();

  nodes.forEach((node) => {
    const level = levels.get(node.id) || 0;

    if (!levelGroups.has(level)) {
      levelGroups.set(level, []);
    }
    levelGroups.get(level)?.push(node);
  });

  const positionedNodes: NodeType[] = [];

  levelGroups.forEach((levelNodes, level) => {
    const startY = level * (NODE_HEIGHT + LEVEL_SPACING);
    const totalWidth =
      levelNodes.length * (NODE_WIDTH + NODE_SPACING) - NODE_SPACING;
    const startX = -totalWidth / 2;

    levelNodes.forEach((node, index) => {
      positionedNodes.push({
        ...node,
        x: startX + index * (NODE_WIDTH + NODE_SPACING),
        y: startY,
      });
    });
  });

  return positionedNodes;
};
