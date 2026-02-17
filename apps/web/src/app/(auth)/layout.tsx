import type { Metadata } from "next";
import { AuthCtaContent } from "./auth-cta-content";
import { AuthLayoutFooter } from "./auth-layout-footer";
import { AuthLayoutHeader } from "./auth-layout-header";

export const metadata: Metadata = {
  title: { template: "%s | SaaS Recipes", default: "Auth | SaaS Recipes" },
  description: "Sign in, sign up, or reset your password.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-svh flex flex-col bg-linear-to-b from-background via-background to-muted/30">
      <AuthLayoutHeader />
      <main className="flex flex-1 flex-col items-center p-4 pt-6 md:p-6 md:pt-8 lg:p-8 lg:pt-10">
        <div className="grid w-full max-w-5xl flex-1 grid-cols-1 items-start gap-8 overflow-x-auto pt-0 sm:overflow-visible sm:grid-cols-[minmax(340px,1fr)_minmax(320px,400px)] lg:gap-12 lg:pt-4">
          <div className="order-2 min-w-0 sm:order-1">
            <AuthCtaContent />
          </div>
          <div className="order-1 flex w-full justify-center sm:order-2 sm:min-w-0 sm:justify-end">
            {children}
          </div>
        </div>
      </main>
      <AuthLayoutFooter />
    </div>
  );
}
