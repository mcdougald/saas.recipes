"use client";

import { useInView } from "motion/react";
import * as React from "react";
import { annotate } from "rough-notation";
import { type RoughAnnotation } from "rough-notation/lib/model";

import { cn } from "@/lib/utils";

const COLOR_MAP = {
  primary: "hsl(var(--primary))",
  secondary: "hsl(var(--secondary))",
  accent: "hsl(var(--accent))",
  destructive: "hsl(var(--destructive))",
} as const;

/**
 * List all rough-notation annotation actions supported by the highlighter.
 */
export type AnnotationAction =
  | "highlight"
  | "underline"
  | "box"
  | "circle"
  | "strike-through"
  | "crossed-off"
  | "bracket";

/**
 * List shorthand variants for common hero highlight styles.
 */
export type HighlightVariant = "underline" | "box" | "circle" | "marker";

/**
 * Define configuration for the `HighlightText` annotation wrapper.
 */
export interface HighlightTextProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color"> {
  children: React.ReactNode;
  variant?: HighlightVariant;
  action?: AnnotationAction;
  color?: keyof typeof COLOR_MAP | string;
  strokeWidth?: number;
  animationDuration?: number;
  animationDelay?: number;
  iterations?: number;
  padding?: number;
  multiline?: boolean;
  animate?: boolean;
  isView?: boolean;
}

/**
 * Render text with a rough-notation annotation that can animate on view.
 *
 * @param props - Annotation behavior, style, and text content.
 * @returns A span that renders rough-notation on top of its children.
 */
const HighlightText = React.forwardRef<HTMLSpanElement, HighlightTextProps>(
  (
    {
      children,
      className,
      variant = "underline",
      action,
      color = "primary",
      strokeWidth = 1.5,
      animationDuration = 600,
      animationDelay = 0,
      iterations = 2,
      padding = 2,
      multiline = true,
      animate = true,
      isView = false,
      ...props
    },
    forwardedRef,
  ) => {
    const elementRef = React.useRef<HTMLSpanElement>(null);
    const annotationRef = React.useRef<RoughAnnotation | null>(null);
    const isInView = useInView(elementRef, {
      once: true,
      margin: "-10%",
    });

    const shouldShow = !isView || isInView;

    React.useEffect(() => {
      const element = elementRef.current;
      if (!element || !shouldShow) {
        return;
      }

      const annotationType: AnnotationAction =
        action ?? (variant === "marker" ? "highlight" : variant);
      const annotationColor =
        color in COLOR_MAP ? COLOR_MAP[color as keyof typeof COLOR_MAP] : color;
      const duration = animate ? animationDuration : 0;
      const annotationIterations = animate ? iterations : 1;

      let delayTimeout: ReturnType<typeof setTimeout> | null = null;
      const showAnnotation = () => {
        const annotation = annotate(element, {
          type: annotationType,
          color: annotationColor,
          strokeWidth,
          animationDuration: duration,
          iterations: annotationIterations,
          padding,
          multiline,
        });

        annotationRef.current = annotation;
        annotation.show();
      };

      if (animationDelay > 0) {
        delayTimeout = setTimeout(showAnnotation, animationDelay);
      } else {
        showAnnotation();
      }

      const resizeObserver = new ResizeObserver(() => {
        if (!annotationRef.current) {
          return;
        }
        annotationRef.current.hide();
        annotationRef.current.show();
      });

      resizeObserver.observe(element);
      resizeObserver.observe(document.body);

      return () => {
        if (delayTimeout) {
          clearTimeout(delayTimeout);
        }
        if (annotationRef.current) {
          annotationRef.current.remove();
          annotationRef.current = null;
        }
        resizeObserver.disconnect();
      };
    }, [
      shouldShow,
      action,
      variant,
      color,
      strokeWidth,
      animationDuration,
      animationDelay,
      iterations,
      padding,
      multiline,
      animate,
    ]);

    return (
      <span
        ref={(node) => {
          elementRef.current = node;
          if (typeof forwardedRef === "function") {
            forwardedRef(node);
          } else if (forwardedRef) {
            forwardedRef.current = node;
          }
        }}
        className={cn("relative inline-block bg-transparent", className)}
        {...props}
      >
        {children}
      </span>
    );
  },
);

HighlightText.displayName = "HighlightText";

export { HighlightText };
