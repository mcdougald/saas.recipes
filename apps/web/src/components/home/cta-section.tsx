"use client";  
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CtaSection() {
  const smokePlumes = ["left", "center", "right"] as const;
  const smokeLayers = [1, 2, 3, 4, 5, 6] as const;

  return (
    <section
      id="cta"
      className="relative border-t py-20 md:py-28"
      aria-labelledby="cta-heading"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_55%_at_50%_100%,var(--primary)/12%,transparent_70%)]" />
      <div className="container px-4 mx-auto">
        <div className="relative mx-auto max-w-4xl overflow-visible rounded-3xl border border-border/50 bg-linear-to-b from-background/95 via-background to-muted/15 px-6 py-9 text-center shadow-[0_0_0_1px_hsl(var(--foreground)/0.03),0_22px_58px_hsl(var(--foreground)/0.08)] sm:px-10 md:py-12">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-foreground/15 to-transparent" />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-6 top-0 z-0 flex -translate-y-1/4 items-start justify-between sm:inset-x-12"
          >
            {smokePlumes.map((plume) => (
              <div
                key={plume}
                className={`smoke-scene smoke-scene-${plume}`}
              >
                {smokeLayers.map((layer) => (
                  <span key={layer} className={`smoke smoke-${layer}`} />
                ))}
              </div>
            ))}
          </div>

          <div className="relative z-10">
          <h2
            id="cta-heading"
            className="mb-6 mt-6 text-4xl font-bold tracking-tight sm:text-4xl md:text-6xl"
          >
            Ready to cook?
          </h2>
          <p className="mx-auto mb-8 mt-4 max-w-2xl text-lg text-muted-foreground">
            Explore real codebases, copy battle-tested architecture decisions,
            and skip weeks of trial and error. Open the app and get cooking.
          </p>

          {/* <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
            {trustSignals.map((signal) => (
              <span
                key={signal}
                className="rounded-full border bg-muted px-3 py-1 text-xs font-medium text-foreground/85"
              >
                {signal}
              </span>
            ))}
          </div> */}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              asChild
              size="lg"
              className="group w-full px-8 text-base shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 sm:w-auto"
            >
              <Link href="/dashboard">
                Open Recipes
                <span
                  className="ml-2 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden
                >
                  →
                </span>
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full border-border/70 bg-background/70 text-base backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5 active:translate-y-0 sm:w-auto"
            >
              <Link href="/pricing">
                See Pricing
              </Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Start free today.
          </p>
          </div>
        </div>
      </div>
      <style jsx>{`
        .smoke-scene {
          position: relative;
          width: 7.25rem;
          height: 7.5rem;
          --scene-x: 0rem;
          --scene-delay: 0s;
          --rise: 5.8rem;
        }

        .smoke-scene-left {
          --scene-x: -0.45rem;
          --scene-delay: 0.6s;
          --rise: 5.4rem;
        }

        .smoke-scene-center {
          --scene-x: 0rem;
          --scene-delay: 0s;
          --rise: 6.2rem;
        }

        .smoke-scene-right {
          --scene-x: 0.45rem;
          --scene-delay: 1.1s;
          --rise: 5.6rem;
        }

        .smoke {
          position: absolute;
          top: 1rem;
          left: 50%;
          border-radius: 9999px;
          background: radial-gradient(
            circle at 40% 35%,
            rgba(45, 45, 45, 0.62) 0%,
            rgba(25, 25, 25, 0.24) 62%,
            rgba(0, 0, 0, 0) 100%
          );
          filter: blur(1.1px);
          opacity: 0;
          animation-name: smokeRise;
          animation-timing-function: ease-out;
          animation-iteration-count: infinite;
          animation-delay: calc(var(--delay) + var(--scene-delay));
        }

        .smoke-1 {
          width: 1rem;
          height: 1rem;
          animation-duration: 2.8s;
          --delay: 0s;
          --x: -1.3rem;
          --drift: -1.2rem;
        }

        .smoke-2 {
          width: 1.2rem;
          height: 1.2rem;
          animation-duration: 3.4s;
          --delay: 0.55s;
          --x: -0.35rem;
          --drift: 0.7rem;
        }

        .smoke-3 {
          width: 1.1rem;
          height: 1.1rem;
          animation-duration: 3.1s;
          --delay: 1s;
          --x: 0.75rem;
          --drift: 1.1rem;
        }

        .smoke-4 {
          width: 1.35rem;
          height: 1.35rem;
          animation-duration: 3.8s;
          --delay: 1.45s;
          --x: -0.95rem;
          --drift: -0.55rem;
        }

        .smoke-5 {
          width: 0.95rem;
          height: 0.95rem;
          animation-duration: 2.9s;
          --delay: 1.9s;
          --x: 1.15rem;
          --drift: 0.55rem;
        }

        .smoke-6 {
          width: 1.45rem;
          height: 1.45rem;
          animation-duration: 4s;
          --delay: 2.2s;
          --x: 0.2rem;
          --drift: -0.85rem;
        }

        @keyframes smokeRise {
          0% {
            opacity: 0;
            transform: translateX(calc(var(--x) + var(--scene-x))) translateY(0)
              scale(0.55);
          }
          15% {
            opacity: 0.45;
          }
          70% {
            opacity: 0.18;
          }
          100% {
            opacity: 0;
            transform: translateX(
                calc(var(--x) + var(--drift) + var(--scene-x))
              )
              translateY(calc(var(--rise) * -1)) scale(1.6);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .smoke {
            animation: none !important;
          }

          .smoke {
            opacity: 0.3;
            transform: translateX(calc(var(--x) + var(--scene-x)))
              translateY(-2.4rem) scale(1.1);
          }
        }
      `}</style>
    </section>
  );
}
