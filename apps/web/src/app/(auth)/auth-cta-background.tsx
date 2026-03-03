"use client";

import { FloatingPaths } from "@/components/common/floating-paths";

/** Render decorative background paths behind auth CTA content. */
export function AuthCtaBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-55" aria-hidden>
      <div className="mask-[radial-gradient(circle_at_center,black_45%,transparent_85%)] absolute inset-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>
    </div>
  );
}
