import { FC } from "react";

import { Node } from "./Node";
import { NodesProps } from "./node.type";

export const Nodes: FC<NodesProps> = ({
  transform,
  handleNodeClick,
  nodes,
}) => {
  return (
    <div
      className="absolute inset-0 w-full h-full"
      style={{
        zIndex: 2,
        transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.k})`,
        transformOrigin: "0 0",
      }}
    >
      {nodes.map((node) => (
        <Node key={node.id} node={node} onClick={handleNodeClick} />
      ))}
    </div>
  );
};
