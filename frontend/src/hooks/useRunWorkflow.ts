import {
  runWorkflow,
  RunWorkflowDto,
  RunWorkflowResponse,
} from "@/services/workflowService";
import { useState } from "react";

interface UseWorkflowReturn {
  runWorkflowMutation: (input: string) => Promise<void>;
  isLoading: boolean;
  result: string | null;
  error: string | null;
  clearResult: () => void;
  clearError: () => void;
}

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
    } catch (err: any) {
      setError(
        err.message || "Une erreur est survenue lors de l'exécution du workflow"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const clearResult = () => {
    setResult(null);
  };

  const clearError = () => {
    setError(null);
  };

  return {
    runWorkflowMutation,
    isLoading,
    result,
    error,
    clearResult,
    clearError,
  };
};
