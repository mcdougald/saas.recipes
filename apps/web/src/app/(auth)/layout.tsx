import { type Metadata } from "next";

import { AuthCtaBackground } from "./auth-cta-background";
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
    <div className="min-h-svh flex flex-col bg-background">
      <AuthLayoutHeader />
      <main className="flex flex-1">
        <div className="grid w-full flex-1 grid-cols-1 sm:grid-cols-2">
          <section className="relative order-2 min-w-0 overflow-hidden bg-white dark:bg-black sm:order-1">
            <AuthCtaBackground />
            <div className="mx-auto w-full max-w-2xl px-6 py-10 md:px-10 md:py-12 lg:px-14 lg:py-14">
              <AuthCtaContent />
            </div>
          </section>
          <section className="order-1 min-w-0 bg-black text-white dark:bg-white dark:text-black sm:order-2">
            <div className="mx-auto flex w-full max-w-2xl justify-center px-4 py-10 md:px-8 md:py-12 lg:px-10 lg:py-14">
              {children}
            </div>
          </section>
        </div>
      </main>
      <AuthLayoutFooter />
    </div>
  );
}
