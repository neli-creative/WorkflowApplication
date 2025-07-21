import { useState, useEffect, useRef } from "react";

import { transformWorkflowData } from "../utils/dataTransformer";
import { calculateLayout } from "../utils/layoutCalculator";

import { WorkflowEdge } from "@/components/workflow/create/workflow.types";
import { NodeType } from "@/components/workflow/create/Node/node.type";

interface UseWorkflowDataProps {
  workflowData?: any;
  shouldRefresh?: boolean;
  loadingDelay?: number;
  initializationDelay?: number;
}

interface UseWorkflowDataHookReturn {
  nodes: NodeType[];
  edges: WorkflowEdge[];
  isLoading: boolean;
  isInitialized: boolean;
  isTransitioning: boolean;
  processWorkflowData: (data: any) => void;
}

/**
 * Custom hook for processing and managing workflow data visualization with smooth transitions.
 *
 * This hook provides functionality to:
 * - Transform raw workflow data into nodes and edges for visualization
 * - Calculate layout positioning for workflow elements
 * - Track loading, initialization, and transition states
 * - Handle data validation and error scenarios
 * - Provide smooth transitions between states
 * - Refresh workflow data when needed
 *
 * @param {Object} params - Configuration object
 * @param {any} params.workflowData - Raw workflow data to be processed
 * @param {boolean} params.shouldRefresh - Flag to trigger data refresh
 * @param {number} params.loadingDelay - Delay before processing data (default: 300ms)
 * @param {number} params.initializationDelay - Delay before marking as initialized (default: 400ms)
 *
 * @returns {UseWorkflowDataHookReturn} An object containing:
 *   - nodes: Array of transformed and positioned workflow nodes
 *   - edges: Array of workflow edges connecting nodes
 *   - isLoading: Boolean indicating if data processing is in progress
 *   - isInitialized: Boolean indicating if visualization is ready to render
 *   - isTransitioning: Boolean indicating if smooth transition is in progress
 *   - processWorkflowData: Function to manually process workflow data
 */
export const useWorkflowData = ({
  workflowData = null,
  shouldRefresh = false,
  loadingDelay = 300,
  initializationDelay = 400,
}: UseWorkflowDataProps = {}): UseWorkflowDataHookReturn => {
  const [nodes, setNodes] = useState<NodeType[]>([]);
  const [edges, setEdges] = useState<WorkflowEdge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Refs to manage cleanup of timeouts
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Processes raw workflow data into visualization-ready nodes and edges.
   *
   * @param {any} data - Raw workflow data containing nodes array
   * @throws {Error} When workflow data is invalid or missing required structure
   */
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
      throw new Error(
        "Erreur lors du traitement des données du workflow: " + error,
      );
    }
  };

  // Main effect for processing workflow data with smooth loading
  useEffect(() => {
    const processData = async () => {
      setIsTransitioning(true);
      setIsInitialized(false);
      setIsLoading(true);

      if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);

      loadingTimeoutRef.current = setTimeout(() => {
        try {
          if (workflowData) {
            processWorkflowData(workflowData);
          } else {
            setNodes([]);
            setEdges([]);
          }
        } catch {
          setNodes([]);
          setEdges([]);
          throw new Error("Erreur lors du traitement des données du workflow");
        } finally {
          setIsLoading(false);
        }
      }, loadingDelay);
    };

    processData();

    return () => {
      if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
    };
  }, [workflowData, shouldRefresh, loadingDelay]);

  // Enhanced initialization effect with smooth transitions
  useEffect(() => {
    if (!isLoading) {
      if (initTimeoutRef.current) clearTimeout(initTimeoutRef.current);
      if (transitionTimeoutRef.current)
        clearTimeout(transitionTimeoutRef.current);

      const hasValidData = nodes.length > 0 && edges.length > 0;

      if (hasValidData) {
        initTimeoutRef.current = setTimeout(() => {
          setIsInitialized(true);

          transitionTimeoutRef.current = setTimeout(() => {
            setIsTransitioning(false);
          }, 200);
        }, initializationDelay);
      } else {
        setIsInitialized(true);
        setIsTransitioning(false);
      }
    }

    return () => {
      if (initTimeoutRef.current) clearTimeout(initTimeoutRef.current);
      if (transitionTimeoutRef.current)
        clearTimeout(transitionTimeoutRef.current);
    };
  }, [isLoading, nodes.length, edges.length, initializationDelay]);

  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
      if (initTimeoutRef.current) clearTimeout(initTimeoutRef.current);
      if (transitionTimeoutRef.current)
        clearTimeout(transitionTimeoutRef.current);
    };
  }, []);

  return {
    nodes,
    edges,
    isLoading,
    isInitialized,
    isTransitioning,
    processWorkflowData,
  };
};
