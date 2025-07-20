import { FC, KeyboardEvent } from "react";

import { NODE_HEIGHT, NODE_WIDTH } from "../workflow.constants";

import { NodeType } from "./node.type";
import { getNodeColors } from "./node.core";

interface NodeProps {
  node: NodeType;
  onClick?: (node: NodeProps["node"]) => void;
}

export const Node: FC<NodeProps> = ({ node, onClick }) => {
  const colors = getNodeColors(node.type || "default");

  const handleClick = () => {
    if (onClick) {
      onClick(node);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      aria-label={`Nœud ${node.type} : ${node.id}. ${node.prompt}`}
      className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 
        bg-gradient-to-br ${colors.bg} text-black rounded-lg shadow-lg p-4 
        border-2 ${colors.border} hover:shadow-xl transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
      role="button"
      style={{
        left: node.x,
        top: node.y,
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
      }}
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-semibold truncate">{node.id}</div>
        <div className="text-xs px-2 py-1 bg-white/20 rounded-full">
          {node.type}
        </div>
      </div>
      <div className="text-sm leading-relaxed overflow-hidden">
        {node.prompt.length >= 63
          ? `${node.prompt.substring(0, 63)}...`
          : node.prompt}
      </div>
    </div>
  );
};
