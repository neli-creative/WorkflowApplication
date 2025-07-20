import { useRef, useState, useEffect } from "react";
import { Spinner } from "@heroui/spinner";
import { Plus } from "lucide-react";

import { Nodes } from "./Node/Nodes";
import { NodeType } from "./Node/node.type";
import { EdgeRenderer } from "./EdgeRenderer";
import { NodeDetail } from "./Node/NodeDetail";
import { ADVICES } from "./workflow.constants";
import { WorkflowImportModalContent } from "./ImportModalContent";

import { Advices } from "@/components/Advice";
import { CustomModal } from "@/ui/CustomModal";
import { Arrows } from "@/components/workflow/create/Arrows";
import { useWorkflowData } from "@/hooks/useWorkflowData";
import { useWorkflowZoom } from "@/hooks/useWorkflowZoom";
import { CustomAlert } from "@/ui/CustomAlert";
import { ImportButton } from "@/ui/ImportJsonButton";
import { useCreateWorkflow } from "@/hooks/useCreateWorkflow";
import { useGetWorkflow } from "@/hooks/useGetWorkflow";

//TODO:
// Types locaux
interface AlertState {
  color: "success" | "danger";
  title: string;
}

export const Workflow: React.FC = () => {
  // Refs
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // States
  const [selectedNode, setSelectedNode] = useState<NodeType | null>(null);
  const [alert, setAlert] = useState<AlertState | null>(null);
  const [currentWorkflowData, setCurrentWorkflowData] = useState<any>(null);

  // Hooks
  const {
    workflow: existingWorkflow,
    loading: loadingExistingWorkflow,
    refetch: refetchWorkflow,
  } = useGetWorkflow();
  const {
    createWorkflow,
    loading: creatingWorkflow,
    error: createError,
    timedOut: createTimedOut,
  } = useCreateWorkflow();
  const { nodes, edges, isLoading, isInitialized } = useWorkflowData({
    workflowData: currentWorkflowData,
  });
  const transform = useWorkflowZoom(svgRef, containerRef, nodes);

  // Effects
  useEffect(() => {
    if (existingWorkflow) {
      setCurrentWorkflowData(existingWorkflow);
    }
  }, [existingWorkflow]);

  // Handlers
  const handleNodeClick = (node: NodeType) => setSelectedNode(node);

  const showAlert = (color: AlertState["color"], title: string) => {
    setAlert({ color, title });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleImportWorkflow = async (jsonData: any) => {
    try {
      await createWorkflow(jsonData);
      setCurrentWorkflowData(jsonData);
      await refetchWorkflow();

      showAlert("success", "Workflow créé avec succès sur le serveur");
    } catch (error) {
      const errorTitle = createTimedOut
        ? "La requête a expiré. Veuillez réessayer."
        : createError
          ? `Erreur serveur: ${createError}`
          : "Une erreur s'est produite lors de l'importation du document";

      showAlert("danger", errorTitle);
    }
  };

  // Validation des fichiers
  const validateWorkflowFile = (file: File): boolean => {
    return file.type === "application/json";
  };

  const parseWorkflowFile = (content: string): any => {
    const data = JSON.parse(content);

    // Validations
    if (!data.nodes || !Array.isArray(data.nodes)) {
      throw new Error("Le fichier doit contenir un tableau 'nodes'");
    }

    data.nodes.forEach((node: any, index: number) => {
      if (!node.id || !node.prompt) {
        throw new Error(
          `Le nœud ${index + 1} doit avoir un 'id' et un 'prompt'`
        );
      }
    });

    const hasStartNode = data.nodes.some((node: any) => node.id === "start");
    if (!hasStartNode) {
      throw new Error("Le workflow doit contenir un nœud avec l'id 'start'");
    }

    return data;
  };

  // Composants conditionnels
  const LoadingSpinner = () => (
    <div className="w-full h-screen bg-gray-50 flex items-center justify-center">
      <Spinner color="default" />
    </div>
  );

  const EmptyState = () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center text-gray-500">
        <Plus className="mx-auto mb-4 opacity-50" size={48} />
        <p className="text-lg font-medium">Aucun workflow créé</p>
        <p className="text-sm">Importez un fichier JSON pour commencer</p>
      </div>
    </div>
  );

  const WorkflowContent = () => (
    <>
      <EdgeRenderer
        edges={edges}
        nodes={nodes}
        svgRef={svgRef}
        transform={transform}
      />
      <Nodes
        handleNodeClick={handleNodeClick}
        nodes={nodes}
        transform={transform}
      />
    </>
  );

  // Calculs dérivés
  const isLoadingTest =
    loadingExistingWorkflow || creatingWorkflow || isLoading;
  const hasWorkflowData = !!currentWorkflowData;
  const buttonText = creatingWorkflow
    ? "Création..."
    : hasWorkflowData
      ? "Remplacer le workflow"
      : "Créer un nouveau workflow";
  const modalTitle = hasWorkflowData
    ? "Remplacer le workflow existant"
    : "Créer un nouveau workflow";

  // Render
  if (isLoadingTest) {
    return <LoadingSpinner />;
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-screen bg-gray-50 relative overflow-hidden"
    >
      <ImportButton
        acceptedFileTypes=".json"
        buttonIcon={<Plus size={18} />}
        buttonText={buttonText}
        importButtonText={creatingWorkflow ? "Création..." : "Importer"}
        isLoading={creatingWorkflow}
        modalContent={<WorkflowImportModalContent />}
        modalTitle={modalTitle}
        parseFile={parseWorkflowFile}
        validateFileType={validateWorkflowFile}
        onImport={handleImportWorkflow}
      />

      <Arrows svgRef={svgRef} />

      {!hasWorkflowData ? <EmptyState /> : isInitialized && <WorkflowContent />}

      {selectedNode && (
        <CustomModal
          isOpen={!!selectedNode}
          title={selectedNode.id}
          onClose={() => setSelectedNode(null)}
        >
          <NodeDetail selectedNode={selectedNode} />
        </CustomModal>
      )}

      <Advices advices={ADVICES} />

      {alert && <CustomAlert alert={alert} />}
    </div>
  );
};
