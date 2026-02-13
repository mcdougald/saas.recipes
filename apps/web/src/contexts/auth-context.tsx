"use client";

import { authClient } from "@/lib/auth-client";
import { User } from "@/lib/types";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signInSocial: (
    provider: "google" | "github",
    callbackUrl?: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: session } = await authClient.getSession();

        if (session?.user) {
          const sessionUser = session.user as typeof session.user & {
            subscriptionTier?: string | null;
          };

          setUser({
            id: sessionUser.id,
            name: sessionUser.name,
            email: sessionUser.email,
            avatar: sessionUser.image || "",
            role: "user",
            subscriptionTier: sessionUser.subscriptionTier ?? null,
          });
        }
      } catch (error) {
        console.error("Failed to get session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const { data, error } = await authClient.signIn.email({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message || "Failed to sign in");
    }

    if (data?.user) {
      const loginUser = data.user as typeof data.user & {
        subscriptionTier?: string | null;
      };

      setUser({
        id: loginUser.id,
        name: loginUser.name,
        email: loginUser.email,
        avatar: loginUser.image || "",
        role: "user",
        subscriptionTier: loginUser.subscriptionTier ?? null,
      });
    }
  };

  const signInSocial = async (
    provider: "google" | "github",
    callbackUrl?: string,
  ) => {
    const redirectUrl = callbackUrl || "/dashboard";
    const urlWithParam = redirectUrl.includes("?")
      ? `${redirectUrl}&auth=success`
      : `${redirectUrl}?auth=success`;

    await authClient.signIn.social({
      provider,
      callbackURL: urlWithParam,
    });
  };

  const logout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            setUser(null);
          },
        },
      });
    } catch (error) {
      console.error("Logout failed:", error);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signInSocial,
        logout,
      }}
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
