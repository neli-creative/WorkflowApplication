import { FC } from "react";

interface RunTitleProps {
  firstName?: string;
}
export const RunTitle: FC<RunTitleProps> = ({ firstName }) => {
  return (
    <div className="text-center mb-12">
      <h1 className="text-gray-600 text-2xl mb-2">
        Bienvenue {firstName || ""} 👋
      </h1>
      <h2 className="text-gray-900 text-5xl font-semibold mb-4">
        Améliorez vos emails en un clic
      </h2>
      <p className="text-gray-500 text-md">
        Décrivez ce que vous voulez dire, dans n&apos;importe quelle langue et
        <br />
        obtenez une version professionnelle en anglais.
      </p>
    </div>
  );
};
