import { Button } from "@heroui/button";
import { LogOut } from "lucide-react";
import { FC, useState } from "react";

import { authService } from "@/services/authServices/authServices";

interface LogoutButtonProps {
  isExpanded?: boolean;
}

export const LogoutButton: FC<LogoutButtonProps> = ({ isExpanded }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      authService.logout();
    } catch (error) {
      authService.logout();
      throw new Error("Erreur lors de la déconnexion: " + error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Button
      className={`w-full ${isExpanded ? "justify-start" : "justify-center"} text-gray-500 hover:text-red-500 hover:bg-red-50/80 transition-all duration-300 rounded-xl border border-transparent hover:border-red-200/60`}
      disabled={isLoggingOut}
      isLoading={isLoggingOut}
      size="sm"
      startContent={<LogOut size={14} />}
      variant="ghost"
      onPress={handleLogout}
    >
      {isExpanded && (
        <span className="font-medium">
          {isLoggingOut ? "Déconnexion..." : "Déconnexion"}
        </span>
      )}
    </Button>
  );
};
