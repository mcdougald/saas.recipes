"use client";

import * as React from "react";

const SIDEBAR_PREFERENCES_KEY = "sidebar_preferences_v1";
const DEFAULT_SIDEBAR_WIDTH = 256;
const MIN_SIDEBAR_WIDTH = 224;
const MAX_SIDEBAR_WIDTH = 420;

export interface SidebarConfig {
  variant: "sidebar" | "floating" | "inset";
  collapsible: "offcanvas" | "icon" | "none";
  side: "left" | "right";
}

export interface SidebarData {
  width: number;
  minWidth: number;
  maxWidth: number;
  isResizing: boolean;
}

export interface SidebarContextValue {
  config: SidebarConfig;
  data: SidebarData;
  updateConfig: (config: Partial<SidebarConfig>) => void;
  setWidth: (width: number) => void;
  resetSidebarData: () => void;
  startResizing: (event: React.PointerEvent<HTMLElement>) => void;
}

export const SidebarContext = React.createContext<SidebarContextValue | null>(
  null,
);

export function SidebarConfigProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [config, setConfig] = React.useState<SidebarConfig>({
    variant: "inset",
    collapsible: "icon",
    side: "left",
  });
  const [width, setWidthState] = React.useState(DEFAULT_SIDEBAR_WIDTH);
  const [isResizing, setIsResizing] = React.useState(false);

  const clampWidth = React.useCallback((nextWidth: number) => {
    return Math.min(MAX_SIDEBAR_WIDTH, Math.max(MIN_SIDEBAR_WIDTH, nextWidth));
  }, []);

  const updateConfig = React.useCallback(
    (newConfig: Partial<SidebarConfig>) => {
      setConfig((prev) => ({ ...prev, ...newConfig }));
    },
    [],
  );

  const setWidth = React.useCallback(
    (nextWidth: number) => {
      setWidthState(clampWidth(nextWidth));
    },
    [clampWidth],
  );

  const resetSidebarData = React.useCallback(() => {
    setConfig({
      variant: "inset",
      collapsible: "offcanvas",
      side: "left",
    });
    setWidthState(DEFAULT_SIDEBAR_WIDTH);
  }, []);

  React.useEffect(() => {
    const rawPreferences = window.localStorage.getItem(SIDEBAR_PREFERENCES_KEY);
    if (!rawPreferences) {
      return;
    }

    try {
      const parsedPreferences = JSON.parse(rawPreferences) as Partial<{
        config: Partial<SidebarConfig>;
        width: number;
      }>;

      if (parsedPreferences.config) {
        setConfig((prev) => ({ ...prev, ...parsedPreferences.config }));
      }

      if (typeof parsedPreferences.width === "number") {
        setWidthState(clampWidth(parsedPreferences.width));
      }
    } catch {
      window.localStorage.removeItem(SIDEBAR_PREFERENCES_KEY);
    }
  }, [clampWidth]);

  React.useEffect(() => {
    window.localStorage.setItem(
      SIDEBAR_PREFERENCES_KEY,
      JSON.stringify({
        config,
        width,
      }),
    );
  }, [config, width]);

  const startResizing = React.useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (event.button !== 0) {
        return;
      }

      event.preventDefault();
      const nextHandle = event.currentTarget;
      nextHandle.setPointerCapture(event.pointerId);
      setIsResizing(true);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";

      const onPointerMove = (pointerEvent: PointerEvent) => {
        const nextWidth =
          config.side === "left"
            ? pointerEvent.clientX
            : window.innerWidth - pointerEvent.clientX;

        setWidthState(clampWidth(nextWidth));
      };

      const stopResizing = () => {
        setIsResizing(false);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", stopResizing);
        window.removeEventListener("pointercancel", stopResizing);
      };

      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", stopResizing, { once: true });
      window.addEventListener("pointercancel", stopResizing, { once: true });
    },
    [clampWidth, config.side],
  );

  const data = React.useMemo<SidebarData>(
    () => ({
      width,
      minWidth: MIN_SIDEBAR_WIDTH,
      maxWidth: MAX_SIDEBAR_WIDTH,
      isResizing,
    }),
    [width, isResizing],
  );

  const contextValue = React.useMemo<SidebarContextValue>(
    () => ({
      config,
      data,
      updateConfig,
      setWidth,
      resetSidebarData,
      startResizing,
    }),
    [config, data, updateConfig, setWidth, resetSidebarData, startResizing],
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebarConfig() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error(
      "useSidebarConfig must be used within a SidebarConfigProvider",
    );
  }
  return context;
}
