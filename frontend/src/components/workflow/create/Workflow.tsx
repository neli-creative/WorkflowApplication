import { useRef, useState } from "react";
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

interface WorkflowProps {}

export const Workflow: React.FC<WorkflowProps> = ({}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<NodeType | null>(null);
  const [alert, setAlert] = useState<{
    color: "success" | "danger";
    title: string;
  } | null>(null);

  const { nodes, edges, isLoading, isInitialized } = useWorkflowData();
  const transform = useWorkflowZoom(svgRef, containerRef, nodes);

  const handleNodeClick = (node: NodeType) => {
    setSelectedNode(node);
  };

  const handleImportWorkflow = (jsonData: any) => {
    try {
      console.log("Données de workflow importées:", jsonData);

      // TODO: updateWorkflowData(jsonData);

      setAlert({
        color: "success",
        title: "Document importé avec succès",
      });
    } catch (error) {
      setAlert({
        color: "danger",
        title: "Une erreur s'est produite lors de l'importation du document",
      });
    }

    setTimeout(() => setAlert(null), 5000);
  };

  // Validation spécifique pour les fichiers de workflow
  const validateWorkflowFile = (file: File): boolean => {
    return file.type === "application/json";
  };

  // Parsing spécifique pour les workflows avec validation
  const parseWorkflowFile = (content: string): any => {
    const data = JSON.parse(content);

    // Validation basique de la structure du workflow
    if (!data.nodes || !Array.isArray(data.nodes)) {
      throw new Error("Le fichier doit contenir un tableau 'nodes'");
    }

    // Validation des nœuds
    data.nodes.forEach((node: any, index: number) => {
      if (!node.id || !node.prompt) {
        throw new Error(
          `Le nœud ${index + 1} doit avoir un 'id' et un 'prompt'`
        );
      }
    });

    return data;
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen bg-gray-50 flex items-center justify-center">
        <Spinner variant="default" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-screen bg-gray-50 relative overflow-hidden"
    >
      <ImportButton
        acceptedFileTypes=".json"
        buttonIcon={<Plus size={18} />}
        buttonText="Créer un nouveau workflow"
        importButtonText="Importer"
        modalContent={<WorkflowImportModalContent />}
        modalTitle="Créer un nouveau workflow"
        parseFile={parseWorkflowFile}
        validateFileType={validateWorkflowFile}
        onImport={handleImportWorkflow}
      />

      <Arrows svgRef={svgRef} />

      {isInitialized && (
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

      {alert && <CustomAlert alert={alert} />}
    </div>
  );
};
