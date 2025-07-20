import { FC } from "react";

import { QUICK_PROMPTS } from "./RunForm/runForm.constants";

import { CustomCard } from "@/ui/CustomCard";

interface RunPromptsProps {
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}

export const RunPrompts: FC<RunPromptsProps> = ({ setQuery }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {QUICK_PROMPTS.map((prompt, index) => (
        <CustomCard
          key={index}
          content={prompt}
          index={index}
          setQuery={setQuery}
        />
      ))}
    </div>
  );
};
