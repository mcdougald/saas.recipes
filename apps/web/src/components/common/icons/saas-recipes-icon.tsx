import { type SVGProps } from "react";

const OPAQUE_FOREGROUND = "var(--foreground)";
const OPAQUE_BACKGROUND = "var(--background)";

/**
 * Resolve a color string into an opaque SVG color.
 *
 * @param color Raw color string from props or inherited attributes.
 * @param fallback Opaque fallback color used when the input is transparent-like.
 * @returns A color string guaranteed to avoid alpha channels where possible.
 */
function resolveOpaqueColor(
  color: string | undefined,
  fallback: string,
): string {
  if (!color) return fallback;

  const normalized = color.trim();
  const lower = normalized.toLowerCase();

  if (lower === "none" || lower === "transparent") return fallback;

  // Convert #RGBA and #RRGGBBAA to opaque hex by stripping alpha.
  if (/^#[0-9a-f]{4}$/i.test(normalized)) {
    const [r, g, b] = normalized.slice(1, 4).split("");
    return `#${r}${r}${g}${g}${b}${b}`;
  }

  if (/^#[0-9a-f]{8}$/i.test(normalized)) return normalized.slice(0, 7);

  // Convert rgba()/rgb(... / alpha) to rgb(...).
  const rgbModern = normalized.match(/^rgba?\(\s*([^)]*?)\s*\/\s*[^)]+\)$/i);
  if (rgbModern) return `rgb(${rgbModern[1].trim()})`;

  const rgbaLegacy = normalized.match(
    /^rgba\(\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*[^)]+\)$/i,
  );
  if (rgbaLegacy)
    return `rgb(${rgbaLegacy[1]}, ${rgbaLegacy[2]}, ${rgbaLegacy[3]})`;

  // Convert hsla()/hsl(... / alpha) to hsl(...).
  const hslModern = normalized.match(/^hsla?\(\s*([^)]*?)\s*\/\s*[^)]+\)$/i);
  if (hslModern) return `hsl(${hslModern[1].trim()})`;

  const hslaLegacy = normalized.match(
    /^hsla\(\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*[^)]+\)$/i,
  );
  if (hslaLegacy)
    return `hsl(${hslaLegacy[1]}, ${hslaLegacy[2]}, ${hslaLegacy[3]})`;

  return normalized;
}

/**
 * Configure visual overrides for the Saas Recipes icon.
 */
export type SaasRecipesIconProps = Omit<SVGProps<SVGSVGElement>, "color"> & {
  /**
   * Set the main stroke color used by the primary outer shapes.
   */
  primaryStroke?: string;
  /**
   * Set the stroke color used by detail lines.
   */
  detailStroke?: string;
  /**
   * Set the stroke color used by the vertical hat detail lines.
   * Falls back to `detailStroke` and then other stroke props when omitted.
   */
  hatLineStroke?: string;
  /**
   * Set the fill color used by the vertical hat detail lines.
   */
  hatLineFill?: string;
  /**
   * Set the stroke color used by the cloud path.
   * Falls back to `primaryStroke` when not provided.
   */
  cloudStroke?: string;
  /**
   * Set the fill color for the main container shape.
   */
  primaryFill?: string;
  /**
   * Set the fill color for the cloud shape.
   */
  cloudFill?: string;
  /**
   * Provide an accessible title for the icon.
   */
  title?: string;
};

/**
 * Render the Saas Recipes brand icon from the source SVG.
 *
 * @param props Configure size, className, and stroke/fill overrides.
 * @returns A customizable SVG icon component.
 */
export function SaasRecipesIcon({
  primaryStroke,
  detailStroke,
  hatLineStroke,
  hatLineFill,
  cloudStroke,
  primaryFill,
  cloudFill,
  title,
  stroke,
  fill = "none",
  width = 21,
  height = 21,
  ...props
}: SaasRecipesIconProps) {
  const sharedStrokeInput =
    primaryStroke ?? detailStroke ?? cloudStroke ?? stroke;
  const resolvedSharedStroke = resolveOpaqueColor(
    sharedStrokeInput,
    OPAQUE_FOREGROUND,
  );
  const resolvedHatLineStroke = resolveOpaqueColor(
    hatLineStroke ?? detailStroke ?? sharedStrokeInput,
    OPAQUE_FOREGROUND,
  );
  const resolvedPrimaryFill =
    primaryFill === undefined
      ? "none"
      : resolveOpaqueColor(primaryFill, OPAQUE_BACKGROUND);
  const resolvedCloudFill =
    cloudFill === undefined
      ? "none"
      : resolveOpaqueColor(cloudFill, OPAQUE_BACKGROUND);
  const resolvedHatLineFill =
    hatLineFill === undefined
      ? "none"
      : resolveOpaqueColor(hatLineFill, OPAQUE_BACKGROUND);

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 21 21"
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <path
        className="computer-base-path"
        d="M18.5524 18.6864C18.629 18.8556 18.6614 19.0408 18.6465 19.2252C18.6316 19.4097 18.5699 19.5876 18.4671 19.7428C18.3643 19.898 18.2235 20.0256 18.0577 20.1139C17.8918 20.2022 17.706 20.2486 17.5173 20.2487H2.78353C2.5947 20.2487 2.40886 20.2025 2.24289 20.1142C2.07692 20.0259 1.93608 19.8983 1.83316 19.7431C1.73024 19.5879 1.66851 19.41 1.65358 19.2254C1.63864 19.0409 1.67097 18.8556 1.74764 18.6864L3.35022 15.2487H16.9506L18.5524 18.6864Z"
        stroke={resolvedSharedStroke}
        fill={resolvedPrimaryFill}
        fillOpacity={1}
        strokeOpacity={1}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        className="trackpad-path"
        d="M8 18.3H12"
        stroke={resolvedSharedStroke}
        strokeOpacity={1}
        strokeWidth="0.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        className="hat-line line-1"
        d="M9 11.39V12.99"
        stroke={resolvedHatLineStroke}
        fill={resolvedHatLineFill}
        strokeOpacity={1}
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        className="hat-line line-2"
        d="M11 10V13"
        stroke={resolvedHatLineStroke}
        fill={resolvedHatLineFill}
        strokeOpacity={1}
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        className="hat-line line-3"
        d="M13 8V13"
        stroke={resolvedHatLineStroke}
        fill={resolvedHatLineFill}
        strokeOpacity={1}
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        className="chef-hat-path"
        d="M2.96191 14.5195C2.96936 14.5203 2.97764 14.5232 2.98633 14.5244C2.94265 14.5198 2.91077 14.5167 2.90234 14.5166C2.9155 14.5169 2.93951 14.5172 2.96191 14.5195ZM3.57715 11.6406L3.16602 11.4326C2.23519 10.9611 1.51479 10.2161 1.11133 9.3291C0.708489 8.44345 0.641122 7.46035 0.916992 6.53711C1.19326 5.61294 1.80132 4.79157 2.65527 4.21484C3.51046 3.63734 4.55736 3.34172 5.62402 3.38574L6.10547 3.40625L6.32324 2.97656C6.6561 2.32057 7.18705 1.75749 7.86035 1.36035C8.53392 0.963151 9.31948 0.75 10.125 0.75C10.9305 0.75 11.7161 0.963151 12.3896 1.36035C13.0629 1.75749 13.5939 2.32057 13.9268 2.97656L14.1445 3.40625L14.626 3.38574C15.693 3.34171 16.7399 3.63659 17.5947 4.21387C18.4488 4.79069 19.0568 5.61275 19.333 6.53711C19.6088 7.46023 19.5414 8.44259 19.1387 9.32812C18.7352 10.2151 18.0148 10.9601 17.084 11.4316L16.6729 11.6406V14.5498C16.5611 14.7597 16.4996 14.887 16.4619 14.9746C16.3753 15.0565 16.1917 15.1448 15.877 15.1973C15.5712 15.2482 15.2543 15.25 15 15.25H3.7168C3.7092 15.2142 3.70056 15.1782 3.69043 15.1436C3.67323 15.0847 3.63991 14.9913 3.57715 14.8926V11.6406Z"
        stroke={resolvedSharedStroke}
        fill={resolvedCloudFill}
        fillOpacity={1}
        strokeOpacity={1}
        strokeWidth="1.5"
      />
    </svg>
  );
}
