import { Button } from "@heroui/button";
import { LogOut } from "lucide-react";
import { FC } from "react";

interface LogoutButtonProps {
  handleLogout: () => void;
  isExpanded?: boolean;
}

export const LogoutButton: FC<LogoutButtonProps> = ({
  handleLogout,
  isExpanded,
}) => {
  return (
    <Button
      className={`w-full ${isExpanded ? "justify-start" : "justify-center"} text-gray-500 hover:text-red-500 hover:bg-red-50/80 transition-all duration-300 rounded-xl border border-transparent hover:border-red-200/60`}
      size="sm"
      startContent={<LogOut size={14} />}
      variant="ghost"
      onPress={handleLogout}
    >
      {isExpanded && <span className="font-medium">Déconnexion</span>}
    </Button>
  );
};
