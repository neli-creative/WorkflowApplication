import { useState } from "react";

import { RunTitle } from "./RunTitle";
import { RunPrompts } from "./RunPromps";
import { RunForm } from "./RunForm/RunForm";

// TODO: first name

export default function Run() {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Query submitted:", query);
    // Ici vous pouvez ajouter votre logique de traitement
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-end p-10">
      <div className="w-full max-w-4xl flex flex-col gap-60">
        <RunTitle firstName={"firstName"} />

        <div>
          <RunPrompts setQuery={setQuery} />

          <RunForm
            handleSubmit={handleSubmit}
            query={query}
            setQuery={setQuery}
          />
        </div>
      </div>
    </div>
  );
}
