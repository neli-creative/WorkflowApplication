// hooks/usePermissions.ts
import { useAuth } from "./useAuth";

import {
  ROLE_PERMISSIONS,
  ROLES,
} from "@/components/ProtectedRoute/roles.constants";

export function usePermissions() {
  const { user } = useAuth();

  const hasRole = (requiredRole: string | string[]): boolean => {
    if (!user) return false;

    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(user.role);
    }

    return user.role === requiredRole;
  };

  const hasPermission = (permission: "index"): boolean => {
    if (!user) return false;

    const userPermissions =
      ROLE_PERMISSIONS[user.role as keyof typeof ROLE_PERMISSIONS];

    return userPermissions?.includes(permission) || false;
  };

  const isAdmin = (): boolean => {
    return user?.role === ROLES.ADMIN;
  };

  const isUser = (): boolean => {
    return user?.role === ROLES.USER;
  };

  return {
    hasRole,
    hasPermission,
    isAdmin,
    isUser,
    userRole: user?.role,
  };
}
