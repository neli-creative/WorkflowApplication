import { FC } from "react";
import { User as UIUser } from "@heroui/user";
import { CircleUserRound } from "lucide-react";
import { Skeleton } from "@heroui/skeleton";

import { LogoutButton } from "./LogoutButton";

import { User } from "@/types/user.type";

interface UserSectionProps {
  isExpanded: boolean;
  user: User | null;
}

export const UserSection: FC<UserSectionProps> = ({ isExpanded, user }) => {
  if (!user) {
    return (
      <div className="space-y-4">
        <div className="max-w-[300px] w-full flex items-center gap-3">
          <div>
            <Skeleton className="flex rounded-full w-12 h-12" />
          </div>
          <div className="w-full flex flex-col gap-2">
            <Skeleton className="h-3 w-3/5 rounded-lg" />
            <Skeleton className="h-3 w-4/5 rounded-lg" />
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        <LogoutButton isExpanded={isExpanded} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <UIUser
        avatarProps={{
          icon: <CircleUserRound />,
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

      <LogoutButton isExpanded={isExpanded} />
    </div>
  );
};
