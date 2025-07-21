import { useState, useEffect } from "react";

import { getWorkflow, GetWorkflowResponse } from "@/services/workflowService";

interface UseGetWorkflowReturn {
  workflow: GetWorkflowResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}
/**
 * Custom hook for fetching and managing workflow data.
 *
 * Provides functionality to:
 * - Fetch workflow data from the server on component mount
 * - Track loading state during fetch operations
 * - Handle and store error messages
 * - Refetch workflow data when needed
 *
 * The hook automatically fetches workflow data on mount and provides
 * a refetch function for manual data refresh.
 *
 * @returns {Object} An object containing:
 *   - workflow: The fetched workflow data or null if not available
 *   - loading: Boolean indicating if fetch operation is in progress
 *   - error: Error message or null if no error occurred
 *   - refetch: Function to manually refetch the workflow data
 */
export const useGetWorkflow = (): UseGetWorkflowReturn => {
  const [workflow, setWorkflow] = useState<GetWorkflowResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkflow = async () => {
    setLoading(true);
    setError(null);

    try {
      const workflowData = await getWorkflow();

      setWorkflow(workflowData);
    } catch {
      setError("Erreur lors de la récupération du workflow");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkflow();
  }, []);

  return {
    workflow,
    loading,
    error,
    refetch: fetchWorkflow,
  };
};
