import { Menu, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { Button } from "@heroui/button";
import { Avatar } from "@heroui/avatar";

import { LogoutButton } from "../LogoutButton";
import { UserSection } from "../UserSection";

import { NAV_ITEMS } from "./sidebar.constants";

import { NavItem } from "@/components/NavItem";

// TODO: gérer l'accessibilité des users

export const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeItem, setActiveItem] = useState("/");

  const user = {
    firstName: "Jean",
    lastName: "Dupont",
    email: "jean.dupont@example.com",
    avatarUrl: "",
  };

  // TODO: logique de déconnexion
  const handleLogout = () => {
    console.log("Déconnexion");
  };

  const handleExpandToggle = (): void => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div
      className={`h-screen bg-gradient-to-b from-white via-gray-50/80 to-white border-r border-gray-200/60 transition-all duration-500 shadow-xl
        ${isExpanded ? "w-72" : "w-20"} flex flex-col relative backdrop-blur-sm`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-rose-50/20 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white/80 to-transparent pointer-events-none" />

      <div className="relative p-5 flex items-center justify-between">
        {isExpanded && (
          <div className="overflow-hidden">
            <span className="text-2xl font-bold bg-gradient-to-r from-slate-800 via-gray-700 to-slate-800 bg-clip-text text-transparent tracking-tight">
              OnePrompt
            </span>
          </div>
        )}

        <Button
          isIconOnly
          className="text-gray-400 hover:text-slate-700 hover:bg-gray-100/80 min-w-9 h-9 rounded-xl border border-transparent hover:border-gray-200/60 transition-all duration-300"
          size="sm"
          variant="ghost"
          onPress={handleExpandToggle}
        >
          {isExpanded ? <ChevronLeft size={16} /> : <Menu size={16} />}
        </Button>
      </div>

      <div className="flex-1 px-4 py-2 space-y-3 relative">
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.href}
            activeItem={activeItem}
            isExpanded={isExpanded}
            item={item}
            setActiveItem={setActiveItem}
          />
        ))}
      </div>

      <div className="relative border-t border-gray-200/40 bg-gradient-to-t from-gray-50/50 to-transparent">
        <div className="p-5">
          {isExpanded ? (
            <UserSection
              handleLogout={handleLogout}
              isExpanded={isExpanded}
              user={user}
            />
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="group relative">
                <Avatar
                  className="ring-2 ring-gray-200/60 cursor-pointer hover:ring-blue-200/80 transition-all duration-300 bg-gradient-to-br from-blue-100 to-rose-100 hover:scale-105"
                  name={user.firstName}
                  size="md"
                />
              </div>

              <LogoutButton handleLogout={handleLogout} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
