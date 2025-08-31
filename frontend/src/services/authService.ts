import { apiClient, type ApiResponse } from "./api";

export interface User {
  id: string;
  username: string;
  role: "owner" | "staff";
  email?: string;
  createdAt?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterData {
  username: string;
  password: string;
  email?: string;
  role: "owner" | "staff";
}

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      "/auth/login",
      credentials
    );

    if (response.success && response.data) {
      // Store token in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      return response.data;
    }

    throw new Error(response.message || "Login failed");
  }

  static async register(userData: RegisterData): Promise<User> {
    const response = await apiClient.post<ApiResponse<User>>(
      "/auth/register",
      userData
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || "Registration failed");
  }

  static async logout(): Promise<void> {
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }

  static async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>("/auth/me");

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || "Failed to get current user");
  }

  static async refreshToken(): Promise<string> {
    const response = await apiClient.post<ApiResponse<{ token: string }>>(
      "/auth/refresh"
    );

    if (response.success && response.data) {
      localStorage.setItem("token", response.data.token);
      return response.data.token;
    }

    throw new Error(response.message || "Token refresh failed");
  }

  static getStoredUser(): User | null {
    try {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }

  static getStoredToken(): string | null {
    return localStorage.getItem("token");
  }

  static isAuthenticated(): boolean {
    return !!this.getStoredToken();
  }
}

export default AuthService;
