import { useState } from "react";

import {
  runWorkflow,
  RunWorkflowDto,
  RunWorkflowResponse,
} from "@/services/workflowService";

interface UseWorkflowReturn {
  runWorkflowMutation: (input: string) => Promise<void>;
  isLoading: boolean;
  result: string | null;
  error: string | null;
  clearResult: () => void;
}

/**
 * Custom hook for executing workflows with user input.
 *
 * This hook provides functionality to:
 * - Execute workflow with user-provided input
 * - Track loading state during workflow execution
 * - Store and manage workflow results
 * - Handle and display error messages
 * - Clear results and errors when needed
 *
 * The hook validates input before execution and provides comprehensive
 * state management for the workflow execution process.
 *
 * @returns {UseWorkflowReturn} An object containing:
 *   - runWorkflowMutation: Function to execute workflow with input
 *   - isLoading: Boolean indicating if workflow is currently running
 *   - result: The workflow execution result or null if not available
 *   - error: Error message or null if no error occurred
 *   - clearResult: Function to clear the current result
 *   - clearError: Function to clear the current error
 */
export const useRunWorkflow = (): UseWorkflowReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runWorkflowMutation = async (input: string): Promise<void> => {
    if (!input.trim()) {
      setError("L'input ne peut pas être vide");

      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const runData: RunWorkflowDto = { input: input.trim() };
      const response: RunWorkflowResponse = await runWorkflow(runData);

      setResult(response.result);
    } catch {
      setError("Une erreur est survenue lors de l'exécution du workflow");
    } finally {
      setIsLoading(false);
    }
  };

  const clearResult = () => {
    setResult(null);
  };

  return {
    runWorkflowMutation,
    isLoading,
    result,
    error,
    clearResult,
  };
};
