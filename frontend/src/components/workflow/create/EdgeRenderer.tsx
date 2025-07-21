import { useEffect } from "react";
import * as d3 from "d3";

import { NodeType } from "./Node/node.type";
import { WorkflowEdge } from "./workflow.types";
import { ARROW_CONFIG, EDGE_COLORS, NODE_HEIGHT } from "./workflow.constants";

interface EdgeRendererProps {
  svgRef: React.RefObject<SVGSVGElement>;
  nodes: NodeType[];
  edges: WorkflowEdge[];
  transform: { x: number; y: number; k: number };
}

export const EdgeRenderer: React.FC<EdgeRendererProps> = ({
  svgRef,
  nodes,
  edges,
  transform,
}) => {
  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    const renderEdges = () => {
      const svg = d3.select(svgRef.current);

      svg.select(".edges").remove();
      svg.select("defs").remove();

      const edgeGroup = svg
        .append("g")
        .attr("class", "edges")
        .attr(
          "transform",
          `translate(${transform.x}, ${transform.y}) scale(${transform.k})`,
        );

      const defs = svg.append("defs");

      defs
        .append("marker")
        .attr("id", ARROW_CONFIG.id)
        .attr("markerWidth", ARROW_CONFIG.markerWidth)
        .attr("markerHeight", ARROW_CONFIG.markerHeight)
        .attr("refX", ARROW_CONFIG.refX)
        .attr("refY", ARROW_CONFIG.refY)
        .attr("orient", "auto")
        .append("polygon")
        .attr("points", ARROW_CONFIG.points)
        .attr("fill", ARROW_CONFIG.fill);

      edges.forEach((edge) => {
        const sourceNode = nodes.find((n) => n.id === edge.source);
        const targetNode = nodes.find((n) => n.id === edge.target);

        if (
          sourceNode &&
          targetNode &&
          sourceNode.x !== undefined &&
          sourceNode.y !== undefined &&
          targetNode.x !== undefined &&
          targetNode.y !== undefined
        ) {
          const color =
            edge.type === "condition"
              ? EDGE_COLORS.condition
              : EDGE_COLORS.normal;

          const path = d3.path();
          const sourceX = sourceNode.x;
          const sourceY = sourceNode.y + NODE_HEIGHT / 2;
          const targetX = targetNode.x;
          const targetY = targetNode.y - NODE_HEIGHT / 2;

          const midY = (sourceY + targetY) / 2;

          path.moveTo(sourceX, sourceY);
          path.bezierCurveTo(sourceX, midY, targetX, midY, targetX, targetY);

          edgeGroup
            .append("path")
            .attr("d", path.toString())
            .attr("stroke", color)
            .attr("stroke-width", 2)
            .attr("fill", "none")
            .attr("marker-end", `url(#${ARROW_CONFIG.id})`);

          if (edge.label) {
            edgeGroup
              .append("rect")
              .attr("x", (sourceX + targetX) / 2 - edge.label.length * 3)
              .attr("y", midY - 18)
              .attr("width", edge.label.length * 10 + 10)
              .attr("height", 16)
              .attr("ry", 8)
              .attr("fill", "#fbf9fa");

            edgeGroup
              .append("text")
              .attr("x", (sourceX + targetX) / 2)
              .attr("y", midY)
              .attr("text-anchor", "middle")
              .attr("dy", "-5")
              .attr("font-size", "12px")
              .attr("font-weight", "600")
              .attr("fill", color)
              .text(edge.label);
          }
        }
      });
    };

    const timeoutId = setTimeout(() => {
      requestAnimationFrame(renderEdges);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [svgRef, nodes, edges, transform]);

  return null;
};
