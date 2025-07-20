import { FileText } from "lucide-react";

import {
  WORKFLOW_IMPORT_EXAMPLE,
  WORKFLOW_IMPORT_HELP_TEXT,
} from "./workflow.constants";

export const WorkflowImportModalContent = () => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <FileText className="text-gray-600" size={16} />
        <h3 className="font-medium text-gray-800">
          {WORKFLOW_IMPORT_HELP_TEXT.title}
        </h3>
      </div>
      <p className="text-sm text-gray-600 mb-3">
        {WORKFLOW_IMPORT_HELP_TEXT.description}
      </p>
      <div className="bg-white p-3 rounded border text-xs font-mono text-gray-700 max-h-48 overflow-y-auto">
        <div className="text-gray-500 mb-2">
          <p>{WORKFLOW_IMPORT_HELP_TEXT.exampleLabel}</p>
        </div>
        {WORKFLOW_IMPORT_EXAMPLE.split("\n").map((line, index) => (
          <pre key={index} className="whitespace-pre-wrap">
            {line}
          </pre>
        ))}
      </div>
      <div className="mt-2 text-xs text-gray-500">
        {WORKFLOW_IMPORT_HELP_TEXT.properties}
      </div>
    </div>
  );
};
