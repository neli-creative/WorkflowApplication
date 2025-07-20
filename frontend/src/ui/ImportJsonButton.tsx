import { Button } from "@heroui/button";
import { Upload, Plus } from "lucide-react";
import { FC, useState, useRef, ReactNode } from "react";

import { CustomModal } from "@/ui/CustomModal";

interface ImportButtonProps {
  onImport: (data: any) => void;
  buttonText: string;
  modalTitle: string;
  modalContent: ReactNode;
  acceptedFileTypes?: string;
  validateFileType?: (file: File) => boolean;
  parseFile?: (content: string) => any;
  buttonIcon?: ReactNode;
  importButtonText?: string;
  importButtonIcon?: ReactNode;
  isLoading?: boolean; // Nouveau prop pour gérer l'état de chargement
}

// TODO:

export const ImportButton: FC<ImportButtonProps> = ({
  onImport,
  buttonText,
  modalTitle,
  modalContent,
  acceptedFileTypes = ".json",
  validateFileType = (file) => file.type === "application/json",
  parseFile = (content) => JSON.parse(content),
  buttonIcon = <Plus size={18} />,
  importButtonText = "Importer",
  importButtonIcon = <Upload size={16} />,
  isLoading = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setFileError(null);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setFileError(null);

    if (!validateFileType(file)) {
      setFileError("Type de fichier non valide");
      return;
    }

    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const data = parseFile(content);

        await onImport(data);
        setIsModalOpen(false);
      } catch (error: any) {
        console.error("Erreur lors de l'importation:", error);
        setFileError(
          error.message || "Erreur lors de l'importation du fichier"
        );
      }
    };

    reader.onerror = () => {
      setFileError("Erreur lors de la lecture du fichier");
    };

    reader.readAsText(file);
    event.target.value = "";
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setFileError(null);
  };

  return (
    <>
      <div className="absolute top-4 right-4 z-50">
        <Button
          className="bg-gradient-to-r from-slate-900 via-gray-800 to-slate-900 text-white shadow-2xl border-slate-700/50"
          startContent={buttonIcon}
          variant="shadow"
          isLoading={isLoading}
          isDisabled={isLoading}
          onPress={handleOpenModal}
        >
          {buttonText}
        </Button>
      </div>

      <CustomModal
        isOpen={isModalOpen}
        title={modalTitle}
        onClose={handleCancel}
      >
        <div className="space-y-4 pb-2">
          {modalContent}

          {fileError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 text-sm">{fileError}</p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="light"
              onPress={handleCancel}
              isDisabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              className="bg-gradient-to-r from-slate-900 via-gray-800 to-slate-900 text-white shadow-2xl border-slate-700/50"
              startContent={importButtonIcon}
              isLoading={isLoading}
              isDisabled={isLoading}
              onPress={handleImportClick}
            >
              {importButtonText}
            </Button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          accept={acceptedFileTypes}
          className="hidden"
          type="file"
          onChange={handleFileChange}
        />
      </CustomModal>
    </>
  );
};
