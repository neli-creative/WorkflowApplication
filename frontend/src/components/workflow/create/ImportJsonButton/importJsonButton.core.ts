const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target?.result as string;

      if (content) {
        resolve(content);
      } else {
        reject(new Error("Contenu du fichier vide"));
      }
    };

    reader.onerror = () =>
      reject(new Error("Erreur lors de la lecture du fichier"));
    reader.readAsText(file);
  });
};

interface ProcessFileOptions {
  validateFileType: (file: File) => boolean;
  parseFile: (content: string) => any;
  onImport: (data: any) => void;
  setFileError: (error: string | null) => void;
  setIsModalOpen: (isOpen: boolean) => void;
}

export function processFileImport(
  event: React.ChangeEvent<HTMLInputElement>,
  options: ProcessFileOptions,
) {
  const {
    validateFileType,
    parseFile,
    onImport,
    setFileError,
    setIsModalOpen,
  } = options;

  return async () => {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) return;

    setFileError(null);

    try {
      if (!validateFileType(file)) {
        throw new Error(
          "Type de fichier non valide. Veuillez sélectionner un fichier JSON valide.",
        );
      }

      const maxSize = 10 * 1024 * 1024;

      if (file.size > maxSize) {
        throw new Error(
          "Le fichier est trop volumineux. Taille maximale autorisée : 10MB.",
        );
      }

      const content = await readFileAsText(file);
      const data = parseFile(content);

      await onImport(data);
      setIsModalOpen(false);
    } catch (error) {
      let errorMessage = "Une erreur inattendue s'est produite";

      if (error instanceof Error) {
        if (error.message.includes("JSON") || error.message.includes("parse")) {
          errorMessage =
            "Format JSON invalide. Veuillez vérifier la structure du fichier.";
        } else if (
          error.message.includes("lecture") ||
          error.message.includes("vide")
        ) {
          errorMessage = "Impossible de lire le fichier. Veuillez réessayer.";
        } else if (
          error.message.includes("Type") ||
          error.message.includes("volumineux")
        ) {
          errorMessage = error.message;
        } else {
          errorMessage = `Erreur lors de l'importation : ${error.message}`;
        }
      }

      setFileError(errorMessage);
    }
  };
}
