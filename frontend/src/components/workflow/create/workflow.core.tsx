import { Spinner } from "@heroui/spinner";
import { Plus } from "lucide-react";

export const LoadingState = () => (
  <div className="w-full h-screen bg-gray-50 flex items-center justify-center">
    <Spinner color="default" />
  </div>
);

export const EmptyState = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="text-center text-gray-500">
      <Plus className="mx-auto mb-4 opacity-50" size={48} />
      <p className="text-lg font-medium">Aucun workflow créé</p>
      <p className="text-sm">Importez un fichier JSON pour commencer</p>
    </div>
  </div>
);

export const buttonText = (
  creatingWorkflow: boolean,
  hasWorkflowData: boolean,
) => {
  return creatingWorkflow
    ? "Création..."
    : hasWorkflowData
      ? "Remplacer le workflow"
      : "Créer un nouveau workflow";
};

export const modalTitle = (hasWorkflowData: boolean) => {
  return hasWorkflowData
    ? "Remplacer le workflow existant"
    : "Créer un nouveau workflow";
};

export function parseWorkflowFile(content: string): JSON {
  const data = JSON.parse(content);

  if (!data.nodes || !Array.isArray(data.nodes)) {
    throw new Error("Le fichier doit contenir un tableau 'nodes'");
  }
  data.nodes.forEach((node: any, index: number) => {
    if (!node.id || !node.prompt) {
      throw new Error(`Le nœud ${index + 1} doit avoir un 'id' et un 'prompt'`);
    }
  });
  const hasStartNode = data.nodes.some((node: any) => node.id === "start");

  if (!hasStartNode) {
    throw new Error("Le workflow doit contenir un nœud avec l'id 'start'");
  }

  return data;
}

export function validateWorkflowFile(file: File): boolean {
  return file.type === "application/json";
}
