import { ReactNode } from "react";
import { Spinner } from "@heroui/spinner";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@heroui/button";
import { ShieldX, ArrowLeft } from "lucide-react";

import { useAuth } from "../../hooks/useAuth";

import { PROTECTED_ROUTE_TEXTS } from "./roles.constants";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string | string[];
  fallback?: ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requiredRole,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const navigate = useNavigate();

  const hasRequiredRole = (
    userRole: string,
    required: string | string[]
  ): boolean => {
    if (!required) return true;

    if (Array.isArray(required)) {
      return required.includes(userRole);
    }

    return userRole === required;
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-10">
        <div className="text-center">
          <Spinner color="default" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate replace to={redirectTo} />;
  }

  if (requiredRole && user && !hasRequiredRole(user.role, requiredRole)) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-10">
        <div className="w-full max-w-2xl">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldX className="w-8 h-8 text-red-500" />
            </div>

            <h1 className="text-gray-900 text-3xl font-semibold mb-4">
              {PROTECTED_ROUTE_TEXTS.title}
            </h1>

            <p className="text-gray-600 text-lg mb-20">
              {PROTECTED_ROUTE_TEXTS.description}
            </p>

            <Button
              className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center gap-2 mx-auto"
              onPress={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4" />
              {PROTECTED_ROUTE_TEXTS.backButton}
            </Button>

            <p className="text-gray-400 text-sm mt-6">
              {PROTECTED_ROUTE_TEXTS.contactAdmin}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
