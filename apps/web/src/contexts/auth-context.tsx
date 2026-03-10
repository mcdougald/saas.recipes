"use client";

import posthog from "posthog-js";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { hasAdminAccess } from "@/lib/auth-access";
import { authClient } from "@/lib/auth-client";
import { type User } from "@/lib/types";

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

type SessionUserWithMetadata = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  subscriptionTier?: string | null;
  admin?: boolean | string | number;
  isAdmin?: boolean | string | number;
  role?: string | null;
  roles?: string[] | null;
};

/**
 * Map Better Auth session users into the app-level auth context user.
 *
 * @param sessionUser - Session user payload from Better Auth client APIs.
 * @returns Normalized user object consumed by UI and navigation.
 */
function mapSessionUserToAuthUser(sessionUser: SessionUserWithMetadata): User {
  const isAdminUser = hasAdminAccess(sessionUser);
  const role =
    typeof sessionUser.role === "string" && sessionUser.role.trim().length > 0
      ? sessionUser.role
      : isAdminUser
        ? "admin"
        : "user";

  return {
    id: sessionUser.id,
    name: sessionUser.name,
    email: sessionUser.email,
    avatar: sessionUser.image || "",
    role,
    admin: isAdminUser,
    subscriptionTier: sessionUser.subscriptionTier ?? null,
  };
}

/**
 * Provide client-side auth state and auth actions to React children.
 *
 * @param props - Provider props including children.
 * @returns Auth context provider wrapping children.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: session } = await authClient.getSession();

        if (session?.user) {
          const sessionUser = session.user as SessionUserWithMetadata;

          setUser(mapSessionUserToAuthUser(sessionUser));

          // Identify user in PostHog on session restore
          posthog.identify(sessionUser.id, {
            email: sessionUser.email,
            name: sessionUser.name,
            subscriptionTier: sessionUser.subscriptionTier ?? "free",
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

    if (!data?.user) {
      throw new Error("Sign in failed: missing user payload in auth response.");
    }

    const loginUser = data.user as SessionUserWithMetadata;

    setUser(mapSessionUserToAuthUser(loginUser));

    // Identify user in PostHog on login
    posthog.identify(loginUser.id, {
      email: loginUser.email,
      name: loginUser.name,
      subscriptionTier: loginUser.subscriptionTier ?? "free",
    });

    // Capture login event
    posthog.capture("user_signed_in", {
      method: "email",
      email: loginUser.email,
    });
  };

  const signInSocial = async (
    provider: "google" | "github",
    callbackUrl?: string,
  ) => {
    const redirectUrl = callbackUrl || "/dashboard";
    const urlWithParam = redirectUrl.includes("?")
      ? `${redirectUrl}&auth=success`
      : `${redirectUrl}?auth=success`;

    try {
      await authClient.signIn.social({
        provider,
        callbackURL: urlWithParam,
      });
    } catch (error) {
      console.error("Social sign-in failed:", error);
      throw new Error("Failed to start social sign-in.");
    }
  };

  const logout = async () => {
    try {
      // Capture logout event before resetting PostHog
      posthog.capture("user_logged_out");
      posthog.reset();

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

/**
 * Access the current auth context.
 *
 * @returns Auth context value with user and auth actions.
 * @throws Error when used outside `AuthProvider`.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
