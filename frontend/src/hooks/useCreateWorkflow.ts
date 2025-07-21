import { useState } from "react";

import { createWorkflow, CreateWorkflowDto } from "@/services/workflowService";

interface UseCreateWorkflowReturn {
  createWorkflow: (workflowData: CreateWorkflowDto) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: boolean;
  timedOut: boolean;
}

/**
 * Custom hook for creating workflows.
 *
 * Provides functionality to:
 * - Create new workflow with error handling
 * - Track loading state during creation process
 * - Handle timeout errors
 * - Manage success and error states
 *
 * @returns {Object} An object containing:
 *   - createWorkflow: Function to create a new workflow
 *   - loading: Boolean indicating if creation is in progress
 *   - error: Error message or null if no error
 *   - success: Boolean indicating if creation was successful
 *   - timedOut: Boolean indicating if request timed out
 */
export const useCreateWorkflow = (): UseCreateWorkflowReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  const handleCreateWorkflow = async (workflowData: CreateWorkflowDto) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setTimedOut(false);

    try {
      await createWorkflow(workflowData);
      setSuccess(true);
    } catch (error: any) {
      if (error.message === "Request timed out") {
        setTimedOut(true);
        setError("La requête a expiré.");
      } else {
        setError("Erreur lors de la création du workflow");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    createWorkflow: handleCreateWorkflow,
    loading,
    error,
    success,
    timedOut,
  };
};
