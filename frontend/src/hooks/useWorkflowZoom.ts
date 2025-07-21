import { useEffect, useState } from "react";
import * as d3 from "d3";

import { ZOOM_CONFIG } from "@/components/workflow/create/workflow.constants";
import { Transform } from "@/components/workflow/create/workflow.types";
import { NodeType } from "@/components/workflow/create/Node/node.type";

interface UseWorkflowZoomReturn {
  x: number;
  y: number;
  k: number;
  isInitialized: boolean;
}

/**
 * Custom hook for managing zoom and pan functionality on workflow visualizations.
 *
 * This hook provides functionality to:
 * - Initialize D3 zoom behavior on SVG elements
 * - Calculate optimal initial zoom level and positioning
 * - Center workflow content automatically within the container
 * - Track zoom transform state (position and scale)
 * - Handle responsive layout adjustments
 * - Manage zoom constraints and boundaries
 *
 * The hook automatically calculates the best initial view to fit all nodes
 * within the container while maintaining readability and proper spacing.
 *
 * @param {React.RefObject<SVGSVGElement>} svgRef - Reference to the SVG element for zoom behavior
 * @param {React.RefObject<HTMLDivElement>} containerRef - Reference to the container for dimension calculations
 * @param {NodeType[]} nodes - Array of workflow nodes to calculate optimal positioning
 *
 * @returns {Object} An object containing:
 *   - x: Horizontal translation value
 *   - y: Vertical translation value
 *   - k: Scale/zoom level
 *   - isInitialized: Boolean indicating if zoom view has been properly initialized
 */
export const useWorkflowZoom = (
  svgRef: React.RefObject<SVGSVGElement>,
  containerRef: React.RefObject<HTMLDivElement>,
  nodes: NodeType[],
): UseWorkflowZoomReturn => {
  const [transform, setTransform] = useState<Transform>({ x: 0, y: 0, k: 1 });
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || nodes.length === 0) return;

    const svg = d3.select(svgRef.current);

    /**
     * Configure D3 zoom behavior with scale constraints and event handling.
     * Updates transform state and applies transformations to edge elements.
     */
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent(ZOOM_CONFIG.scaleExtent)
      .on("zoom", (event) => {
        const { transform } = event;

        setTransform(transform);

        svg.select(".edges").attr("transform", transform);
      });

    svg.call(zoom);

    /**
     * Calculates and applies the optimal initial view for the workflow.
     *
     * This function:
     * - Determines the bounding box of all workflow nodes
     * - Calculates the best scale to fit content within container
     * - Centers the content horizontally and vertically
     * - Applies padding for visual breathing room
     * - Sets the initial transform with smooth transition
     */
    const initializeView = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;

      if (nodes.length > 0) {
        const xPositions = nodes.map((node) => node.x || 0);
        const yPositions = nodes.map((node) => node.y || 0);

        const minX = Math.min(...xPositions) - 140;
        const maxX = Math.max(...xPositions) + 140;
        const minY = Math.min(...yPositions) - 60;
        const maxY = Math.max(...yPositions) + 60;

        const contentWidth = maxX - minX;
        const contentHeight = maxY - minY;

        const scale = Math.min(
          containerWidth / (contentWidth + ZOOM_CONFIG.padding),
          containerHeight / (contentHeight + ZOOM_CONFIG.padding),
          1,
        );

        const centerX = containerWidth / 2 - (minX + contentWidth / 2) * scale;
        const centerY =
          containerHeight / 2 - (minY + contentHeight / 2) * scale;

        const initialTransform = d3.zoomIdentity
          .translate(centerX, centerY)
          .scale(scale);

        svg.call(zoom.transform, initialTransform);
        setTransform(initialTransform);
        setIsInitialized(true);
      }
    };

    const timer = setTimeout(initializeView, 150);

    return () => {
      clearTimeout(timer);
      svg.on(".zoom", null);
    };
  }, [svgRef, containerRef, nodes]);

  return { ...transform, isInitialized };
};
