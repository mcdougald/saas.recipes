"use client";

import * as React from "react";
import { GripVerticalIcon } from "lucide-react";
import * as ResizablePrimitive from "react-resizable-panels";

import { cn } from "@/lib/utils";

type ResizablePanelGroupProps = Omit<
  React.ComponentProps<typeof ResizablePrimitive.Group>,
  "orientation" | "onLayoutChange"
> & {
  direction?: React.ComponentProps<typeof ResizablePrimitive.Group>["orientation"];
  onLayout?: (sizes: number[]) => void;
};

function ResizablePanelGroup({
  direction,
  onLayout,
  className,
  ...props
}: ResizablePanelGroupProps) {
  return (
    <ResizablePrimitive.Group
      data-slot="resizable-panel-group"
      className={cn(
        "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
        className,
      )}
      orientation={direction}
      onLayoutChange={(layout) => {
        onLayout?.(Object.values(layout));
      }}
      {...props}
    />
  );
}

function ResizablePanel({
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.Panel>) {
  return <ResizablePrimitive.Panel data-slot="resizable-panel" {...props} />;
}

type ResizableHandleProps = React.ComponentProps<
  typeof ResizablePrimitive.Separator
> & {
  withHandle?: boolean;
};

function ResizableHandle({
  withHandle,
  className,
  ...props
}: ResizableHandleProps) {
  return (
    <ResizablePrimitive.Separator
      data-slot="resizable-handle"
      className={cn(
        "bg-border focus-visible:ring-ring relative flex w-px items-center justify-center after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-hidden aria-[aria-orientation=horizontal]:h-px aria-[aria-orientation=horizontal]:w-full aria-[aria-orientation=horizontal]:after:inset-x-0 aria-[aria-orientation=horizontal]:after:inset-y-auto aria-[aria-orientation=horizontal]:after:top-1/2 aria-[aria-orientation=horizontal]:after:h-1 aria-[aria-orientation=horizontal]:after:w-full aria-[aria-orientation=horizontal]:after:translate-x-0 aria-[aria-orientation=horizontal]:after:-translate-y-1/2 [&[aria-orientation=horizontal]>div]:rotate-90",
        className,
      )}
      {...props}
    >
      {withHandle && (
        <div className="bg-border z-10 flex h-4 w-3 items-center justify-center rounded-xs border">
          <GripVerticalIcon className="size-2.5" />
        </div>
      )}
    </ResizablePrimitive.Separator>
  );
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
