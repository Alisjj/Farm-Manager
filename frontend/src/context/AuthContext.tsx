import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import AuthService, { type User } from "../services/authService";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    // Check if user is already logged in
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Check if there's a stored token and user
      const storedUser = AuthService.getStoredUser();
      const storedToken = AuthService.getStoredToken();

      if (storedToken && storedUser) {
        // Try to verify the token with the server
        const currentUser = await AuthService.getCurrentUser();
        setUser(currentUser);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      // Clear invalid token/user data
      AuthService.logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    const loginResponse = await AuthService.login({ username, password });
    setUser(loginResponse.user);
  };

  const logout = async () => {
    await AuthService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { type User };
