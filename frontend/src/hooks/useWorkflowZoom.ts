import { useEffect, useState } from "react";
import * as d3 from "d3";

import { ZOOM_CONFIG } from "@/components/workflow/create/workflow.constants";
import { Transform } from "@/components/workflow/create/workflow.types";

export const useWorkflowZoom = (
  svgRef: React.RefObject<SVGSVGElement>,
  containerRef: React.RefObject<HTMLDivElement>,
  nodes: any[]
) => {
  const [transform, setTransform] = useState<Transform>({ x: 0, y: 0, k: 1 });
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || nodes.length === 0) return;

    const svg = d3.select(svgRef.current);

    // Configuration du zoom
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent(ZOOM_CONFIG.scaleExtent)
      .on("zoom", (event) => {
        const { transform } = event;

        setTransform(transform);

        // Mettre à jour la transformation des edges en temps réel
        svg.select(".edges").attr("transform", transform);
      });

    svg.call(zoom);

    // Initialisation différée pour éviter les problèmes de timing
    const initializeView = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;

      // Calculer les dimensions du contenu basées sur les positions des nœuds
      if (nodes.length > 0) {
        const xPositions = nodes.map((node) => node.x || 0);
        const yPositions = nodes.map((node) => node.y || 0);

        const minX = Math.min(...xPositions) - 140; // NODE_WIDTH/2
        const maxX = Math.max(...xPositions) + 140;
        const minY = Math.min(...yPositions) - 60; // NODE_HEIGHT/2
        const maxY = Math.max(...yPositions) + 60;

        const contentWidth = maxX - minX;
        const contentHeight = maxY - minY;

        const scale = Math.min(
          containerWidth / (contentWidth + ZOOM_CONFIG.padding),
          containerHeight / (contentHeight + ZOOM_CONFIG.padding),
          1
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

    // Utiliser un délai plus long pour s'assurer que tout est rendu
    const timer = setTimeout(initializeView, 150);

    return () => {
      clearTimeout(timer);
      svg.on(".zoom", null);
    };
  }, [svgRef, containerRef, nodes]);

  // Retourner également l'état d'initialisation
  return { ...transform, isInitialized };
};
