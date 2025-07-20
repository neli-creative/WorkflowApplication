import { LayoutDashboard, PlayCircle } from "lucide-react";

import { ROLES } from "../ProtectedRoute/roles.constants";

export const NAV_ITEMS = [
  {
    label: "Exécuter le workflow",
    href: "/",
    icon: <PlayCircle size={18} />,
    role: [ROLES.ADMIN, ROLES.USER],
  },
  {
    label: "Créer un workflow",
    href: "/workflow",
    icon: <LayoutDashboard size={18} />,
    role: [ROLES.ADMIN],
  },
];
