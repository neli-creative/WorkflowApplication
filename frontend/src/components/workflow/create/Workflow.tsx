import { useRef, useState, useEffect } from "react";
import { Plus } from "lucide-react";

import { Nodes } from "./Node/Nodes";
import { NodeType } from "./Node/node.type";
import { EdgeRenderer } from "./EdgeRenderer";
import { NodeDetail } from "./Node/NodeDetail";
import { ADVICES } from "./workflow.constants";
import { WorkflowImportModalContent } from "./ImportModalContent";
import {
  buttonText,
  EmptyState,
  LoadingState,
  modalTitle,
  parseWorkflowFile,
  validateWorkflowFile,
} from "./workflow.core";

import { Advices } from "@/components/Advice";
import { CustomModal } from "@/ui/CustomModal";
import { Arrows } from "@/components/workflow/create/Arrows";
import { useWorkflowData } from "@/hooks/useWorkflowData";
import { useWorkflowZoom } from "@/hooks/useWorkflowZoom";
import { AlertState, CustomAlert } from "@/ui/CustomAlert";
import { ImportButton } from "@/components/workflow/create/ImportJsonButton/ImportJsonButton";
import { useCreateWorkflow } from "@/hooks/useCreateWorkflow";
import { useGetWorkflow } from "@/hooks/useGetWorkflow";

export const Workflow: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [selectedNode, setSelectedNode] = useState<NodeType | null>(null);
  const [alert, setAlert] = useState<AlertState | null>(null);
  const [currentWorkflowData, setCurrentWorkflowData] = useState<any>(null);

  const {
    workflow: existingWorkflow,
    loading: loadingExistingWorkflow,
    refetch: refetchWorkflow,
    error: workflowError,
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

  useEffect(() => {
    if (existingWorkflow) {
      setCurrentWorkflowData(existingWorkflow);
    }
  }, [existingWorkflow]);

  const handleNodeClick = (node: NodeType) => setSelectedNode(node);

  const showAlert = (color: "success" | "danger", title: string) => {
    setAlert({ alert: { color, title } });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleImportWorkflow = async (jsonData: any) => {
    try {
      await createWorkflow(jsonData);
      setCurrentWorkflowData(jsonData);
      await refetchWorkflow();

      showAlert("success", "Workflow créé avec succès sur le serveur");
    } catch {
      const errorTitle = createTimedOut
        ? "La requête a expiré. Veuillez réessayer."
        : createError ||
          workflowError ||
          "Une erreur s'est produite lors de l'importation du workflow";

      showAlert("danger", errorTitle);
    }
  };

  const hasWorkflowData = !!currentWorkflowData;

  if (loadingExistingWorkflow || creatingWorkflow || isLoading) {
    return <LoadingState />;
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-screen bg-gray-50 relative overflow-hidden cursor-pointer"
    >
      <ImportButton
        acceptedFileTypes=".json"
        buttonIcon={<Plus size={18} />}
        buttonText={buttonText(creatingWorkflow, hasWorkflowData)}
        importButtonText={creatingWorkflow ? "Création..." : "Importer"}
        isLoading={creatingWorkflow}
        modalContent={<WorkflowImportModalContent />}
        modalTitle={modalTitle(hasWorkflowData)}
        parseFile={parseWorkflowFile}
        validateFileType={validateWorkflowFile}
        onImport={handleImportWorkflow}
      />

      <Arrows svgRef={svgRef} />

      {!hasWorkflowData ? (
        <EmptyState />
      ) : (
        isInitialized && (
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
        )
      )}

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

      {alert && <CustomAlert alert={alert.alert} />}
    </div>
  );
};
