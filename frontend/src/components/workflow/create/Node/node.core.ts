import { NodeColor } from "./node.type";

export function getNodeColors(type: string): NodeColor {
  switch (type) {
    case "start":
      return {
        bg: "from-green-100 to-emerald-200",
        border: "border-green-300/60",
      };
    case "condition":
      return {
        bg: "from-cyan-100 to-blue-200",
        border: "border-cyan-300/60",
      };
    case "action":
      return {
        bg: "from-blue-100 to-indigo-200",
        border: "border-blue-300/60",
      };
    case "end":
      return {
        bg: "from-purple-100 to-violet-200",
        border: "border-purple-300/60",
      };
    default:
      return {
        bg: "from-stone-100 to-neutral-100",
        border: "border-stone-200/60",
      };
  }
}
