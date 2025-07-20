import { useState, useEffect } from "react";

import { transformWorkflowData } from "../utils/dataTransformer";
import { calculateLayout } from "../utils/layoutCalculator";
import data from "../../data.json";

import { WorkflowEdge } from "@/components/workflow/create/workflow.types";
import { NodeType } from "@/components/workflow/create/Node/node.type";

export const useWorkflowData = () => {
  const [nodes, setNodes] = useState<NodeType[]>([]);
  const [edges, setEdges] = useState<WorkflowEdge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const { nodes: transformedNodes, edges: transformedEdges } =
        transformWorkflowData(data.nodes);
      const layoutedNodes = calculateLayout(transformedNodes, transformedEdges);

      setNodes(layoutedNodes);
      setEdges(transformedEdges);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading && nodes.length > 0 && edges.length > 0) {
      const timer = setTimeout(() => {
        setIsInitialized(true);
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [isLoading, nodes.length, edges.length]);

  return {
    nodes,
    edges,
    isLoading,
    isInitialized,
  };
};
