import { Button } from "@heroui/button";
import { Upload, Plus } from "lucide-react";
import { FC, useState, useRef, ReactNode } from "react";

import { CustomAlert } from "./CustomAlert";

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
}

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
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!validateFileType(file)) {
      console.error("Type de fichier non valide");

      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = parseFile(content);

        onImport(data);
        setIsModalOpen(false);
      } catch (error) {
        console.error("Erreur lors du parsing du fichier:", error);
      }
    };
    reader.readAsText(file);

    event.target.value = "";
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="absolute top-4 right-4 z-50">
        <Button
          className="bg-gradient-to-r from-slate-900 via-gray-800 to-slate-900 text-white shadow-2xl border-slate-700/50"
          startContent={buttonIcon}
          variant="shadow"
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

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="light" onPress={handleCancel}>
              Annuler
            </Button>
            <Button
              className="bg-gradient-to-r from-slate-900 via-gray-800 to-slate-900 text-white shadow-2xl border-slate-700/50"
              startContent={importButtonIcon}
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
