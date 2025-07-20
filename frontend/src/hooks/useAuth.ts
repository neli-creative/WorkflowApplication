import { useState, useEffect } from "react";

import { authService } from "@/services/authServices/authServices";
import { User } from "@/types/user.type";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const authenticated = authService.isAuthenticated();

        setIsAuthenticated(authenticated);

        if (authenticated) {
          const userData = authService.getUserData();

          setUser(userData);
        }
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
        throw new Error(
          "Erreur lors de la vérification de l'authentification: " + error
        );
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = await authService.login(credentials);

      setIsAuthenticated(true);
      setUser({
        userId: response.userId,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        role: response.role as "admin" | "user",
      });

      return response;
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      throw new Error(
        "Erreur lors de la connexion: " +
          (error instanceof Error ? error.message : "Erreur inconnue")
      );
    }
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  const fetchWithAuth = async (url: string, options?: RequestInit) => {
    return authService.fetchWithAuth(url, options);
  };

  return {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout,
    fetchWithAuth,
  };
}
