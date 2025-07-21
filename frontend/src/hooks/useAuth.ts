import { useState, useEffect } from "react";

import { authService } from "@/services/authServices/authServices";
import { User } from "@/types/user.type";

interface AuthHookReturn {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<User>;
  logout: () => void;
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>;
}
/**
 * Custom hook for authentication management.
 *
 * Provides functionality to:
 * - Check if a user is authenticated
 * - Get the current user's data
 * - Log in and out
 * - Make authenticated API requests
 *
 * This hook handles authentication state persistence across page reloads
 * by checking stored tokens on initial load.
 *
 * @returns {Object} An object containing:
 *   - isAuthenticated: Boolean indicating if the user is logged in
 *   - user: Current user data or null if not authenticated
 *   - isLoading: Boolean indicating if authentication check is in progress
 *   - login: Function to authenticate a user
 *   - logout: Function to log out the current user
 *   - fetchWithAuth: Function to make authenticated API requests
 */

export function useAuth(): AuthHookReturn {
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
      } catch {
        setIsAuthenticated(false);
        setUser(null);
        throw new Error(
          "Erreur lors de la vérification de l'authentification: ",
        );
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  /**
   * Authenticates a user with provided credentials
   *
   * @param {Object} credentials - User login credentials
   * @param {string} credentials.email - User's email address
   * @param {string} credentials.password - User's password
   * @returns {Promise<Object>} Authentication response data
   * @throws {Error} If authentication fails
   */

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
    } catch {
      setIsAuthenticated(false);
      setUser(null);
      throw new Error("Erreur lors de la connexion ");
    }
  };

  /**
   * Logs out the current user by clearing authentication state
   * and removing stored tokens
   */
  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  /**
   * Makes an authenticated API request
   *
   * @param {string} url - The URL to fetch
   * @param {RequestInit} options - Fetch options
   * @returns {Promise<Response>} Fetch response
   */
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
