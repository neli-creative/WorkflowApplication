import { FC } from "react";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";

interface NavItemProps {
  item: NavItem;
  activeItem: string;
  setActiveItem: (href: string) => void;
  isExpanded: boolean;
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

export const NavItem: FC<NavItemProps> = ({
  item,
  activeItem,
  setActiveItem,
  isExpanded,
}) => {
  const isActive = activeItem === item.href;

  return (
    <div className="group relative">
      <Button
        as={Link}
        className={`w-full transition-all duration-300 group relative overflow-hidden border
            ${
              isActive
                ? "bg-gradient-to-r from-slate-900 via-gray-800 to-slate-900 text-white shadow-2xl border-slate-700/50"
                : "bg-transparent hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/80 text-gray-600 hover:text-slate-800 border-transparent hover:border-gray-200/60"
            }
            ${!isExpanded ? "justify-center min-w-12 px-0" : "justify-start px-4"}
          `}
        href={item.href}
        size="lg"
        startContent={
          <div
            className={`transition-all duration-300 z-10 ${!isActive ? "group-hover:scale-110" : ""}`}
          >
            {item.icon}
          </div>
        }
        onPress={() => setActiveItem(item.href)}
      >
        <div
          className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full 
            ${!isActive ? "group-hover:translate-x-full transition-transform duration-1000" : ""}`}
        />

        {isExpanded && (
          <span className="font-medium text-sm transition-all duration-300 z-10">
            {item.label}
          </span>
        )}
      </Button>
    </div>
  );
};
