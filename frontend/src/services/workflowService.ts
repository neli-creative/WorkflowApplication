import { NodeType } from "@/components/workflow/create/Node/node.type";
import { authService } from "./authServices/authServices";

//TODO:
export interface CreateWorkflowDto {
  nodes: NodeType[];
}

export interface RunWorkflowDto {
  input: string;
}

export interface RunWorkflowResponse {
  result: string;
}

const apiUrl = import.meta.env.VITE_API_URL;

export const createWorkflow = async (
  workflowData: CreateWorkflowDto
): Promise<void> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 7000); // 7s

  try {
    // ✅ Utilisation du service d'auth pour gérer automatiquement le refresh
    const res = await authService.fetchWithAuth(`${apiUrl}/workflow/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(workflowData),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
    }

    return;
  } catch (error: any) {
    if (error.name === "AbortError") {
      throw new Error("Request timed out");
    }
    throw error;
  }
};

export interface GetWorkflowResponse {
  _id: string;
  nodes: NodeType[];
  createdAt: string;
  updatedAt: string;
}

export const getWorkflow = async (): Promise<GetWorkflowResponse | null> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 7000); // 7s

  try {
    // ✅ Utilisation du service d'auth
    const res = await authService.fetchWithAuth(`${apiUrl}/workflow`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (
      res.status === 404 ||
      (res.status === 400 && res.statusText.includes("No workflow found"))
    ) {
      // Aucun workflow trouvé, on retourne null
      return null;
    }

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
    }

    return await res.json();
  } catch (error: any) {
    if (error.name === "AbortError") {
      throw new Error("Request timed out");
    }
    throw error;
  }
};

export const runWorkflow = async (
  runData: RunWorkflowDto
): Promise<RunWorkflowResponse> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000); // 30s pour l'exécution du workflow

  try {
    // ✅ Utilisation du service d'auth
    const res = await authService.fetchWithAuth(`${apiUrl}/workflow/run`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(runData),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
    }

    return await res.json();
  } catch (error: any) {
    if (error.name === "AbortError") {
      throw new Error("Request timed out");
    }
    throw error;
  }
};
