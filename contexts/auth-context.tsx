"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

export interface AuthContextType {
  isAuthenticated: boolean;
  user: { id: string; username: string } | null;
  login: (token: string) => void;
  logout: () => void;
  getAccessToken: () => Promise<string | null>;
}

// Create the AuthContext with default values
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ id: string; username: string } | null>(
    null
  );
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const login = (token: string) => {
    setAccessToken(token);
    const decodedToken = jwtDecode(token) as { id: string; username: string };
    setUser(decodedToken);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setAccessToken(null);
      setUser(null);
      setIsAuthenticated(false);
      router.push("/auth/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const refreshAccessToken = async (): Promise<string | null> => {
    try {
      const response = await fetch("/api/auth/refresh", { method: "POST" });
      if (response.ok) {
        const { accessToken } = await response.json();
        setAccessToken(accessToken);
        return accessToken;
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
    }
    return null;
  };

  const getAccessToken = async (): Promise<string | null> => {
    if (!accessToken) {
      return null;
    }

    try {
      const decodedToken = jwtDecode(accessToken) as { exp: number };
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        // Token has expired, try to refresh
        return await refreshAccessToken();
      }

      return accessToken;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getAccessToken();
      if (token) {
        try {
          const response = await fetch("/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
            setIsAuthenticated(true);
          } else {
            logout();
          }
        } catch (error) {
          console.error("Error checking authentication:", error);
          logout();
        }
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, getAccessToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};
