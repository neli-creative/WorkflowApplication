import { FC } from "react";

import { NodeType } from "./node.type";

interface NodeDetailProps {
  selectedNode: NodeType;
}

export const NodeDetail: FC<NodeDetailProps> = ({ selectedNode }) => {
  return (
    <div className="pb-4">
      <div className="text-sm text-gray-600 mb-2">
        <p>Type: {selectedNode.type}</p>
      </div>
      <div className="text-sm">
        <strong>Prompt:</strong>
        <p className="mt-1 text-gray-700">{selectedNode.prompt}</p>
      </div>

      {selectedNode.condition && (
        <div className="mt-2 text-sm">
          <strong>Conditions:</strong>
          <div className="mt-1 flex flex-wrap gap-1">
            {Object.entries(selectedNode.condition).map(([key, value]) => (
              <span
                key={key}
                className="px-2 py-1 bg-cyan-100 text-cyan-800 rounded-full text-xs"
              >
                {key} → {value}
              </span>
            ))}
          </div>
        </div>
      )}

      {selectedNode.next && (
        <div className="mt-2 text-sm">
          <strong>Next:</strong>
          <span className="ml-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
            {selectedNode.next}
          </span>
        </div>
      )}
    </div>
  );
};
