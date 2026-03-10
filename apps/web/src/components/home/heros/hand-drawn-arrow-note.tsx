"use client";

import { Caveat } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import rough from "roughjs";

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["500", "700"],
});

/**
 * Draw a compact roughjs arrow into the provided SVG element.
 *
 * @param svg - Target SVG element used by roughjs.
 */
function drawArrow(svg: SVGSVGElement) {
  while (svg.firstChild) {
    svg.removeChild(svg.firstChild);
  }

  const sketch = rough.svg(svg);
  const strokeColor = "currentColor";

  const pathA = sketch.path("M86 16 C 72 21, 56 24, 38 23", {
    stroke: strokeColor,
    strokeWidth: 2,
    roughness: 1.8,
    bowing: 2.1,
    fill: "none",
  });

  const pathB = sketch.path("M88 19 C 74 24, 58 27, 40 26", {
    stroke: strokeColor,
    strokeWidth: 1.3,
    roughness: 2.1,
    bowing: 2.4,
    fill: "none",
  });

  const headA = sketch.path("M46 19 L36 23 L47 29", {
    stroke: strokeColor,
    strokeWidth: 1.8,
    roughness: 1.8,
    bowing: 1.8,
    fill: "none",
  });

  const headB = sketch.path("M44 18 L34 22 L45 30", {
    stroke: strokeColor,
    strokeWidth: 1.1,
    roughness: 2.2,
    bowing: 2.1,
    fill: "none",
  });

  svg.append(pathA, pathB, headA, headB);
}

/**
 * Draw a tighter, more curved desktop arrow that points back to the headline.
 *
 * @param svg - Target SVG element used by roughjs.
 */
function drawDesktopArrow(svg: SVGSVGElement) {
  while (svg.firstChild) {
    svg.removeChild(svg.firstChild);
  }

  const sketch = rough.svg(svg);
  const strokeColor = "currentColor";

  const pathA = sketch.path("M90 30 C 74 14, 52 9, 30 16", {
    stroke: strokeColor,
    strokeWidth: 2,
    roughness: 1.9,
    bowing: 2.9,
    fill: "none",
  });

  const pathB = sketch.path("M92 33 C 76 17, 54 12, 32 19", {
    stroke: strokeColor,
    strokeWidth: 1.3,
    roughness: 2.2,
    bowing: 3.2,
    fill: "none",
  });

  const headA = sketch.path("M38 10 L28 16 L40 20", {
    stroke: strokeColor,
    strokeWidth: 1.8,
    roughness: 1.8,
    bowing: 1.9,
    fill: "none",
  });

  const headB = sketch.path("M36 9 L26 15 L38 21", {
    stroke: strokeColor,
    strokeWidth: 1.1,
    roughness: 2.2,
    bowing: 2.1,
    fill: "none",
  });

  svg.append(pathA, pathB, headA, headB);
}

/**
 * Render a handwritten note and sketched arrow near the hero highlight.
 *
 * On small and medium screens, it renders above the highlighted word and points
 * down. On large screens, it renders below and points up.
 *
 * @returns Responsive hand-drawn annotation callout for the hero heading.
 */
export function HandDrawnArrowNote() {
  const mobileSvgRef = useRef<SVGSVGElement>(null);
  const desktopSvgRef = useRef<SVGSVGElement>(null);
  const mobileListRef = useRef<HTMLUListElement>(null);
  const desktopListRef = useRef<HTMLUListElement>(null);
  const [showMobileList, setShowMobileList] = useState(true);
  const [showDesktopList, setShowDesktopList] = useState(true);

  useEffect(() => {
    if (mobileSvgRef.current) {
      drawArrow(mobileSvgRef.current);
    }
    if (desktopSvgRef.current) {
      drawDesktopArrow(desktopSvgRef.current);
    }
  }, []);

  useEffect(() => {
    const isInViewport = (element: HTMLElement | null) => {
      if (!element) {
        return true;
      }

      const rect = element.getBoundingClientRect();
      return (
        rect.left >= 8 &&
        rect.right <= window.innerWidth - 8 &&
        rect.top >= 8 &&
        rect.bottom <= window.innerHeight - 8
      );
    };

    const checkVisibility = () => {
      setShowMobileList(isInViewport(mobileListRef.current));
      setShowDesktopList(isInViewport(desktopListRef.current));
    };

    checkVisibility();
    window.addEventListener("resize", checkVisibility);
    window.addEventListener("scroll", checkVisibility, { passive: true });

    return () => {
      window.removeEventListener("resize", checkVisibility);
      window.removeEventListener("scroll", checkVisibility);
    };
  }, []);

  return (
    <>
      <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-3 flex -translate-x-1/2 flex-col items-center gap-0.5 sm:mb-4 lg:hidden">
        {showMobileList ? (
          <ul
            ref={mobileListRef}
            className={`${caveat.className} max-w-44 text-left text-[16px] leading-[0.95] text-primary/85 sm:max-w-52 sm:text-[18px]`}
            aria-label="Proven examples list"
          >
            <li className="-rotate-1">- Proven patterns</li>
            <li className="rotate-1">- AI configs</li>
            <li className="-rotate-1">- Architecture decisions</li>
            <li className="rotate-1">- and more...</li>
          </ul>
        ) : null}
        <svg
          ref={mobileSvgRef}
          aria-hidden
          viewBox="0 0 96 44"
          className="h-7 w-12 -rotate-90 text-primary/60 sm:h-8 sm:w-14"
          fill="none"
        />
      </div>

      <div className="pointer-events-none absolute left-[58%] top-full z-10 mt-2 hidden flex-col items-start gap-0 lg:flex">
        <svg
          ref={desktopSvgRef}
          aria-hidden
          viewBox="0 0 96 44"
          className="ml-2 h-10 w-16 -rotate-12 text-primary/70"
          fill="black"
        />
        {showDesktopList ? (
          <ul
            ref={desktopListRef}
            className={`${caveat.className} max-w-56 text-left text-[22px] leading-[0.9] text-primary/85`}
            aria-label="Proven examples list"
          >
            <li className="-rotate-1">- Proven patterns</li>
            <li className="rotate-1">- AI configs</li>
            <li className="-rotate-1">- Architecture decisions</li>
            <li className="rotate-1">- and more...</li>
          </ul>
        ) : null}
      </div>
    </>
  );
}
