"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { LOGIN } from "@/constants/routes";

export interface AuthContextType {
  isAuthenticated: boolean;
  user: { id: string; username: string } | null;
  isLoading: boolean; // Add this
  login: (accessToken: string) => void;
  logout: () => void;
  getAccessToken: () => Promise<string | null>;
  refreshAccessToken: () => Promise<string | null>;
  isInitialized: boolean; // Add this
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
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const login = (accessToken: string) => {
    setAccessToken(accessToken);
    const decodedToken = jwtDecode<JwtPayload>(accessToken);
    setUser({ id: decodedToken.id, username: decodedToken.username });
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setAccessToken(null);
      setUser(null);
      setIsAuthenticated(false);
      router.push(LOGIN);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const refreshAccessToken = async (): Promise<string | null> => {
    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        const { accessToken } = await response.json();
        setAccessToken(accessToken);
        return accessToken;
      } else if (response.status === 401 || response.status === 403) {
        return null;
      } else {
        throw new Error("Token refresh failed.");
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      return null;
    }
  };

  const getAccessToken = async (): Promise<string | null> => {
    try {
      if (!accessToken) {
        return await refreshAccessToken(); // Try to refresh if no token exists
      }

      const decodedToken = jwtDecode(accessToken) as { exp: number };
      const currentTime = Date.now() / 1000;

      // If token is expired or about to expire in the next minute, refresh it
      if (decodedToken.exp - currentTime < 60) {
        return await refreshAccessToken();
      }

      return accessToken;
    } catch (error) {
      console.error("Error decoding token:", error);
      return await refreshAccessToken(); // Try to refresh on decode error
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
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
            setUser(null);
            setIsAuthenticated(false);
            router.push(LOGIN);
          }
        } catch (error) {
          console.error("Error checking authentication:", error);
          setUser(null);
          setIsAuthenticated(false);
          router.push(LOGIN);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setIsLoading(false);
      setIsInitialized(true);
    };

    checkAuth();
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        isLoading,
        isInitialized,
        login,
        logout,
        getAccessToken,
        refreshAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

interface JwtPayload {
  id: string;
  username: string;
  exp: number;
}
