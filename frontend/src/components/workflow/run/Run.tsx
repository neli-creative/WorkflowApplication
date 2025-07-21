import { useState } from "react";

import { RunTitle } from "./RunTitle";
import { RunForm } from "./RunForm/RunForm";
import { RunResult } from "./RunResult";
import { RunPrompts } from "./RunPrompts";

import { useRunWorkflow } from "@/hooks/useRunWorkflow";
import { CustomAlert } from "@/ui/CustomAlert";

export default function Run() {
  const { runWorkflowMutation, isLoading, result, error, clearResult } =
    useRunWorkflow();

  const [query, setQuery] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    await runWorkflowMutation(query);
  };

  const handleClearResult = () => {
    clearResult();
    setQuery("");
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col overflow-y-auto p-6 md:p-10 justify-around">
      <div className="w-full max-w-4xl mx-auto flex flex-col  md:gap-20 mb-10 ">
        {!result ? (
          <RunTitle />
        ) : (
          <RunResult result={result} onClear={handleClearResult} />
        )}

        <div>
          <RunPrompts setQuery={setQuery} />

          <RunForm
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            query={query}
            setQuery={setQuery}
          />
        </div>
      </div>
      {error && <CustomAlert alert={{ color: "danger", title: error }} />}
    </div>
  );
}
