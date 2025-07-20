import { useState } from "react";

import { createWorkflow, CreateWorkflowDto } from "@/services/workflowService";

export const useCreateWorkflow = () => {
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
    } catch (err: any) {
      if (err.message === "Request timed out") {
        setTimedOut(true);
        setError("La requête a expiré.");
      } else {
        setError(err.message || "Erreur lors de la création du workflow");
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
