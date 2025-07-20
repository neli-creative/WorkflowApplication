import { NodeType } from "@/components/workflow/Node/node.type";
import { WorkflowEdge } from "@/components/workflow/create/workflow.types";

export const transformWorkflowData = (
  workflowData: NodeType[]
): { nodes: NodeType[]; edges: WorkflowEdge[] } => {
  const nodes: NodeType[] = [];
  const edges: WorkflowEdge[] = [];

  workflowData.forEach((node) => {
    // Déterminer le type de nœud
    let nodeType: NodeType["type"] = "action";

    if (node.id === "start" || node.condition) {
      nodeType = node.condition ? "condition" : "start";
    } else if (!node.next && !node.condition) {
      nodeType = "end";
    }

    nodes.push({
      id: node.id,
      type: nodeType,
      prompt: node.prompt,
      condition: node.condition ? node.condition : undefined,
    });

    // Créer les edges
    if (node.condition) {
      Object.entries(node.condition).forEach(([condition, targetId]) => {
        edges.push({
          id: `${node.id}-${condition}-${targetId}`,
          source: node.id,
          target: targetId,
          label: condition,
          type: "condition",
        });
      });
    } else if (node.next) {
      edges.push({
        id: `${node.id}-${node.next}`,
        source: node.id,
        target: node.next,
        type: "normal",
      });
    }
  });

  return { nodes, edges };
};
