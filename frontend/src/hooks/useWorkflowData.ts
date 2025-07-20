import { useState, useEffect } from "react";
import { transformWorkflowData } from "../utils/dataTransformer";
import { calculateLayout } from "../utils/layoutCalculator";
import { WorkflowEdge } from "@/components/workflow/create/workflow.types";
import { NodeType } from "@/components/workflow/create/Node/node.type";

interface UseWorkflowDataProps {
  workflowData?: any;
  shouldRefresh?: boolean;
}

export const useWorkflowData = ({
  workflowData = null,
  shouldRefresh = false,
}: UseWorkflowDataProps = {}) => {
  const [nodes, setNodes] = useState<NodeType[]>([]);
  const [edges, setEdges] = useState<WorkflowEdge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const processWorkflowData = (data: any) => {
    if (!data?.nodes || !Array.isArray(data.nodes)) {
      throw new Error("Données de workflow invalides");
    }

    try {
      const { nodes: transformedNodes, edges: transformedEdges } =
        transformWorkflowData(data.nodes);
      const layoutedNodes = calculateLayout(transformedNodes, transformedEdges);

      setNodes(layoutedNodes);
      setEdges(transformedEdges);
    } catch (error) {
      console.error("Erreur lors du traitement des données:", error);
      throw error;
    }
  };

  // const resetWorkflowData = () => {
  //   setNodes([]);
  //   setEdges([]);
  //   setIsLoading(true);
  //   setIsInitialized(false);
  // };

  // Traitement des données
  useEffect(() => {
    setIsLoading(true);

    if (workflowData) {
      processWorkflowData(workflowData);
    } else {
      setNodes([]);
      setEdges([]);
    }

    setIsLoading(false);
  }, [workflowData, shouldRefresh]);

  // Gestion de l'initialisation
  useEffect(() => {
    if (!isLoading) {
      const hasValidData = nodes.length > 0 && edges.length > 0;

      if (hasValidData) {
        const timer = setTimeout(() => setIsInitialized(true), 200);

        return () => clearTimeout(timer);
      } else {
        setIsInitialized(true);
      }
    }
  }, [isLoading, nodes.length, edges.length]);

  return {
    nodes,
    edges,
    isLoading,
    isInitialized,
    processWorkflowData,
    // resetWorkflowData,
  };
};
