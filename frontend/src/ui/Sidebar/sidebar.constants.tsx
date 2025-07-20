import { LayoutDashboard, PlayCircle } from "lucide-react";

export const NAV_ITEMS = [
  {
    label: "Exécuter le workflow",
    href: "/",
    icon: <PlayCircle size={18} />,
  },
  {
    label: "Créer un workflow",
    href: "/workflow",
    icon: <LayoutDashboard size={18} />,
  },
];
