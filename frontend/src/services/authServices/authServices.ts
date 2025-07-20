import {
  AuthResponse,
  LoginCredentials,
  RefreshResponse,
  SignupCredentials,
} from "./authServices.types";

const apiUrl = import.meta.env.VITE_API_URL;
console.log("API URL:", apiUrl);

class AuthService {
  private readonly baseURL = apiUrl;

  private setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
  }

  private getAccessToken(): string | null {
    return localStorage.getItem("access_token");
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem("refresh_token");
  }

  private clearTokens(): void {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_data");
  }

  private getDefaultHeaders(): HeadersInit {
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  }

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
        const errorData = await response.json().catch(() => ({
          message: `Erreur HTTP: ${response.status}`,
        }));

        throw new Error(errorData.message || "Erreur lors de l'inscription");
      }

      return;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error(
          "Erreur de connexion au serveur. Vérifiez que le serveur est démarré et accessible."
        );
      }

      throw error;
    }
  }

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
        const errorData = await response.json().catch(() => ({
          message: `Erreur HTTP: ${response.status}`,
        }));

        throw new Error(errorData.message || "Erreur de connexion");
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
        })
      );

      return data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error(
          "Erreur de connexion au serveur. Vérifiez que le serveur est démarré et accessible."
        );
      }

      throw error;
    }
  }

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

  async fetchWithAuth(
    url: string,
    options: RequestInit = {}
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
          accessToken = this.getAccessToken();

          return fetch(url, {
            ...requestOptions,
            headers: {
              ...requestOptions.headers,
              Authorization: `Bearer ${accessToken}`,
            },
          });
        } catch (refreshError) {
          this.logout();
          window.location.href = "/login";
          throw new Error("Session expirée" + refreshError);
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

  isAuthenticated(): boolean {
    return !!this.getAccessToken() && !!this.getRefreshToken();
  }

  getUserData(): any {
    const userData = localStorage.getItem("user_data");

    return userData ? JSON.parse(userData) : null;
  }

  logout(): void {
    this.clearTokens();
    window.location.href = "/login";
  }

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
