import {
  AuthResponse,
  LoginCredentials,
  RefreshResponse,
  SignupCredentials,
} from "./authServices.types";

const apiUrl = import.meta.env.VITE_API_URL;

/**
 * Authentication service for managing user authentication and API requests.
 *
 * This service handles:
 * - User registration and login
 * - Token management (access and refresh tokens)
 * - Authenticated API requests with automatic token refresh
 * - Session management and logout
 * - Connection testing
 *
 * All tokens are stored in localStorage and automatically managed for the user.
 */
class AuthService {
  private readonly baseURL = apiUrl;

  /**
   * Stores authentication tokens in localStorage.
   *
   * @param {string} accessToken - The access token for API authentication
   * @param {string} refreshToken - The refresh token for token renewal
   */
  private setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
  }

  /**
   * Retrieves the stored access token from localStorage.
   *
   * @returns {string | null} The access token or null if not found
   */
  private getAccessToken(): string | null {
    return localStorage.getItem("access_token");
  }

  /**
   * Retrieves the stored refresh token from localStorage.
   *
   * @returns {string | null} The refresh token or null if not found
   */
  private getRefreshToken(): string | null {
    return localStorage.getItem("refresh_token");
  }

  /**
   * Clears all authentication data from localStorage.
   * Removes access token, refresh token, and user data.
   */
  private clearTokens(): void {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_data");
  }

  /**
   * Gets default HTTP headers for API requests.
   *
   * @returns {HeadersInit} Object containing default headers
   */
  private getDefaultHeaders(): HeadersInit {
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  }

  /**
   * Registers a new user account.
   *
   * @param {SignupCredentials} credentials - User registration data
   * @param {string} credentials.email - User's email address
   * @param {string} credentials.password - User's password
   * @param {string} credentials.firstName - User's first name
   * @param {string} credentials.lastName - User's last name
   *
   * @returns {Promise<void>} Resolves when registration is successful
   *
   * @throws {Error} "Erreur lors de l'inscription" - When registration fails
   * @throws {Error} "Erreur de connexion au serveur..." - When server is unreachable
   */
  async signup(credentials: SignupCredentials): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/auth/signup`, {
        method: "POST",
        headers: this.getDefaultHeaders(),
        body: JSON.stringify(credentials),
        mode: "cors",
        credentials: "include",
      });

      if (!response.ok) {
        await response.json().catch(() => ({
          message: `Erreur HTTP: ${response.status}`,
        }));

        throw new Error("Erreur lors de l'inscription");
      }

      return;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error(
          "Erreur de connexion au serveur. Vérifiez que le serveur est démarré et accessible.",
        );
      }

      throw error;
    }
  }

  /**
   * Authenticates a user with email and password.
   *
   * On successful login:
   * - Stores access and refresh tokens
   * - Saves user data to localStorage
   * - Returns authentication response
   *
   * @param {LoginCredentials} credentials - User login data
   * @param {string} credentials.email - User's email address
   * @param {string} credentials.password - User's password
   *
   * @returns {Promise<AuthResponse>} Authentication response with user data and tokens
   *
   * @throws {Error} "Erreur de connexion" - When login fails
   * @throws {Error} "Erreur de connexion au serveur..." - When server is unreachable
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: "POST",
        headers: this.getDefaultHeaders(),
        body: JSON.stringify(credentials),
        mode: "cors",
        credentials: "include",
      });

      if (!response.ok) {
        await response.json().catch(() => ({
          message: `Erreur HTTP: ${response.status}`,
        }));

        throw new Error("Erreur de connexion");
      }

      const data: AuthResponse = await response.json();

      this.setTokens(data.access_token, data.refreshToken);
      localStorage.setItem(
        "user_data",
        JSON.stringify({
          userId: data.userId,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.role,
        }),
      );

      return data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error(
          "Erreur de connexion au serveur. Vérifiez que le serveur est démarré et accessible.",
        );
      }

      throw error;
    }
  }

  /**
   * Refreshes expired access tokens using the refresh token.
   *
   * This method is automatically called when an API request returns 401.
   * If refresh fails, the user is logged out automatically.
   *
   * @returns {Promise<RefreshResponse>} New tokens from the server
   *
   * @throws {Error} "Aucun refresh token disponible" - When no refresh token exists
   * @throws {Error} "Session expirée" - When refresh token is invalid/expired
   */
  async refreshTokens(): Promise<RefreshResponse> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      throw new Error("Aucun refresh token disponible");
    }

    try {
      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: "POST",
        headers: this.getDefaultHeaders(),
        body: JSON.stringify({ token: refreshToken }),
        mode: "cors",
        credentials: "include",
      });

      if (!response.ok) {
        this.logout();
        throw new Error("Session expirée");
      }

      const data: RefreshResponse = await response.json();

      this.setTokens(data.access_token, data.refreshToken);

      return data;
    } catch (error) {
      this.logout();
      throw error;
    }
  }

  /**
   * Makes authenticated HTTP requests with automatic token management.
   *
   * Features:
   * - Automatically adds Authorization header with access token
   * - Handles 401 responses by refreshing tokens and retrying
   * - Logs out user if token refresh fails
   *
   * @param {string} url - The URL to fetch
   * @param {RequestInit} options - Fetch options (method, headers, body, etc.)
   *
   * @returns {Promise<Response>} The fetch response
   *
   * @throws {Error} "Utilisateur non authentifié" - When no access token exists
   * @throws {Error} "Session expirée" - When token refresh fails
   * @throws {Error} "Erreur de connexion au serveur" - When network request fails
   */
  async fetchWithAuth(
    url: string,
    options: RequestInit = {},
  ): Promise<Response> {
    let accessToken = this.getAccessToken();

    if (!accessToken) {
      throw new Error("Utilisateur non authentifié");
    }

    const requestOptions: RequestInit = {
      ...options,
      mode: "cors",
      credentials: "include",
      headers: {
        ...this.getDefaultHeaders(),
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    };

    try {
      const response = await fetch(url, requestOptions);

      if (response.status === 401) {
        try {
          await this.refreshTokens();
          const newAccessToken = this.getAccessToken();

          if (!newAccessToken) {
            throw new Error("Impossible de récupérer le nouveau token");
          }

          return fetch(url, {
            ...requestOptions,
            headers: {
              ...requestOptions.headers,
              Authorization: `Bearer ${newAccessToken}`,
            },
          });
        } catch {
          this.logout();
          window.location.href = "/login";
          throw new Error("Session expirée");
        }
      }

      return response;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Erreur de connexion au serveur");
      }
      throw error;
    }
  }

  /**
   * Checks if the user is currently authenticated.
   *
   * Verifies the presence of both access and refresh tokens in localStorage.
   * Note: This only checks token existence, not validity.
   *
   * @returns {boolean} True if both tokens exist, false otherwise
   */
  isAuthenticated(): boolean {
    return !!this.getAccessToken() && !!this.getRefreshToken();
  }

  /**
   * Retrieves the current user's data from localStorage.
   *
   * @returns {any | null} User data object or null if not found
   * @returns {string} userId - User's unique identifier
   * @returns {string} email - User's email address
   * @returns {string} firstName - User's first name
   * @returns {string} lastName - User's last name
   * @returns {string} role - User's role (admin, user, etc.)
   */
  getUserData(): any {
    const userData = localStorage.getItem("user_data");

    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Logs out the current user.
   *
   * This method:
   * - Clears all authentication tokens and user data
   * - Redirects the user to the login page
   */
  logout(): void {
    this.clearTokens();
    window.location.href = "/login";
  }

  /**
   * Tests the connection to the backend server.
   *
   * Makes a request to the health endpoint to verify server availability.
   * Useful for troubleshooting connection issues.
   *
   * @returns {Promise<boolean>} True if server is reachable and healthy, false otherwise
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/health`, {
        method: "GET",
        mode: "cors",
        credentials: "include",
      });

      return response.ok;
    } catch {
      return false;
    }
  }
}

export const authService = new AuthService();
