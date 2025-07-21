import { authService } from "./authServices/authServices";

import { NodeType } from "@/components/workflow/create/Node/node.type";

export interface CreateWorkflowDto {
  nodes: NodeType[];
}
export interface RunWorkflowDto {
  input: string;
}
export interface RunWorkflowResponse {
  result: string;
}

export interface GetWorkflowResponse {
  _id: string;
  nodes: NodeType[];
  createdAt: string;
  updatedAt: string;
}

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Creates a new workflow on the server.
 *
 * This function sends workflow data to the backend for storage and processing.
 * It includes timeout handling to prevent hanging requests.
 *
 * @param {CreateWorkflowDto} workflowData - The workflow data to create
 * @param {NodeType[]} workflowData.nodes - Array of workflow nodes
 *
 * @returns {Promise<void>} Resolves when workflow is successfully created
 *
 * @throws {Error} "Request timed out" - When request exceeds 7 seconds
 * @throws {Error} "HTTP error! status: {status}" - When server returns error status
 * @throws {Error} Network or authentication errors from fetchWithAuth
 *
 */
export const createWorkflow = async (
  workflowData: CreateWorkflowDto,
): Promise<void> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 7000);

  try {
    const res = await authService.fetchWithAuth(`${API_URL}/workflow/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(workflowData),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      await res.json().catch(() => ({}));
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return;
  } catch (error: any) {
    if (error.name === "AbortError") {
      throw new Error("Request timed out");
    }
    throw error;
  }
};

/**
 * Retrieves the current user's workflow from the server.
 *
 * This function fetches the workflow data associated with the authenticated user.
 * It handles the case where no workflow exists by returning null instead of throwing an error.
 *
 * @returns {Promise<GetWorkflowResponse | null>} The workflow data or null if no workflow exists
 *
 * @throws {Error} "Request timed out" - When request exceeds 7 seconds
 * @throws {Error} "HTTP error! status: {status}" - When server returns unexpected error
 * @throws {Error} Network or authentication errors from fetchWithAuth
 *
 */
export const getWorkflow = async (): Promise<GetWorkflowResponse | null> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 7000);

  try {
    const res = await authService.fetchWithAuth(`${API_URL}/workflow`, {
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
      return null;
    }

    if (!res.ok) {
      await res.json().catch(() => ({}));

      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return await res.json();
  } catch (error: any) {
    if (error.name === "AbortError") {
      throw new Error("Request timed out");
    }
    throw error;
  }
};

/**
 * Executes a workflow with the provided user input.
 *
 * This function sends user input to the server to be processed through the workflow.
 * It has an extended timeout (30 seconds) to accommodate potentially long-running
 * workflow operations involving AI processing.
 *
 * @param {RunWorkflowDto} runData - The data needed to run the workflow
 * @param {string} runData.input - User input to be processed by the workflow
 *
 * @returns {Promise<RunWorkflowResponse>} The processed result from the workflow
 * @returns {string} result - The processed output from the workflow
 *
 * @throws {Error} "Request timed out" - When request exceeds 30 seconds
 * @throws {Error} Server error messages - When workflow execution fails
 * @throws {Error} Network or authentication errors from fetchWithAuth
 *
 */
export const runWorkflow = async (
  runData: RunWorkflowDto,
): Promise<RunWorkflowResponse> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const res = await authService.fetchWithAuth(`${API_URL}/workflow/run`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(runData),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      await res.json().catch(() => ({}));

      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return await res.json();
  } catch (error: any) {
    if (error.name === "AbortError") {
      throw new Error("Request timed out");
    }
    throw error;
  }
};
