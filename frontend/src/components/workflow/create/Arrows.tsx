import { FC } from "react";

interface ArrowsProps {
  svgRef: React.RefObject<SVGSVGElement>;
}

export const Arrows: FC<ArrowsProps> = ({ svgRef }) => {
  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 1 }}
    />
  );
};
