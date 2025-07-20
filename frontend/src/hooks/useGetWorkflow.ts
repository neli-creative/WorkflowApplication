import { useState, useEffect } from "react";

import { getWorkflow, GetWorkflowResponse } from "@/services/workflowService";

export const useGetWorkflow = () => {
  const [workflow, setWorkflow] = useState<GetWorkflowResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkflow = async () => {
    setLoading(true);
    setError(null);

    try {
      const workflowData = await getWorkflow();

      setWorkflow(workflowData);
    } catch (err: any) {
      setError(err.message || "Erreur lors de la récupération du workflow");
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
