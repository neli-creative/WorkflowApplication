import { FC } from "react";
import { User } from "@heroui/user";

import { LogoutButton } from "./LogoutButton";

interface UserSectionProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  handleLogout: () => void;
  isExpanded: boolean;
}

export const UserSection: FC<UserSectionProps> = ({
  user,
  handleLogout,
  isExpanded,
}) => {
  return (
    <div className="space-y-4">
      <User
        avatarProps={{
          name: user.firstName,
          size: "md",
          className:
            "ring-2 ring-gray-200/60 bg-gradient-to-br from-blue-100 to-rose-100",
        }}
        className="justify-start"
        classNames={{
          name: "text-sm font-semibold text-slate-800",
          description: "text-xs text-gray-500",
        }}
        description={user.email}
        name={`${user.firstName} ${user.lastName}`}
      />

      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

      <LogoutButton handleLogout={handleLogout} isExpanded={isExpanded} />
    </div>
  );
};
