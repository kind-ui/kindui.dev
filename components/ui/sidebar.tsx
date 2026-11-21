"use client";

import { sidebarPrimitive } from "@kind-ui/agent-ui/core";
import { createParts, renderElement } from "@ui-sdk/react/primitive";
import type { ComponentProps, ReactNode } from "react";
import { KindDrawer, KindDrawerBackdrop, KindDrawerContent } from "./internal/drawer.js";
import { KindResizable, KindResizableHandle, KindResizablePanel } from "./internal/resizable.js";

const parts = createParts(sidebarPrimitive, {
  root: "div",
  title: "aside",
  handle: "div",
  inset: "div",
  trigger: "button",
});

export type SidebarProps = Omit<ComponentProps<typeof parts.Root>, "children"> & { children?: ReactNode };
export type SidebarPanelProps = ComponentProps<typeof parts.Title>;
export type SidebarHandleProps = Omit<ComponentProps<typeof parts.Handle>, "children" | "className"> & {
  /** Classes for the separator itself, UI SDK's Resizable handle. */
  className?: string;
};
export type SidebarInsetProps = ComponentProps<typeof parts.Inset>;
export type SidebarTriggerProps = ComponentProps<typeof parts.Trigger>;

/**
 * A panel beside the page that a person resizes and collapses, and that turns into a modal drawer on a narrow
 * screen. Write `SidebarPanel`, `SidebarHandle` and `SidebarInset` inside it in reading order, and a
 * `SidebarTrigger` anywhere inside. The Resizable stays mounted on a narrow screen, so the page in the inset never
 * mounts again; only the panel's content moves into the drawer.
 */
export function Sidebar({ children, ...props }: SidebarProps) {
  return (
    <parts.Root {...props}>
      {({ resizable }) => <KindResizable {...resizable}>{children}</KindResizable>}
    </parts.Root>
  );
}

/** The panel, an `aside` named by the sidebar's `label`: a Resizable panel beside the page, else a drawer. */
export function SidebarPanel({ render, ...props }: SidebarPanelProps) {
  return (
    <parts.Title
      {...props}
      render={(panel, state) => {
        const element = renderElement("aside", panel, render, state);
        return (
          <KindResizablePanel {...state.resizablePanel}>
            {state.overlay ? (
              <KindDrawer {...state.drawer}>
                <KindDrawerBackdrop data-agent-hidden="" />
                <KindDrawerContent {...state.drawerContent}>{element}</KindDrawerContent>
              </KindDrawer>
            ) : (
              element
            )}
          </KindResizablePanel>
        );
      }}
    />
  );
}

/** The resize handle between the panel and the inset, named "Resize <label>". Absent while the panel is a drawer. */
export function SidebarHandle({ className, ...props }: SidebarHandleProps) {
  return (
    <parts.Handle {...props}>
      {(state) => (
        <KindResizableHandle aria-label={state["aria-label"]} className={className} data-agent-hidden="" />
      )}
    </parts.Handle>
  );
}

/** The page beside the panel. */
export function SidebarInset({ render, ...props }: SidebarInsetProps) {
  return (
    <parts.Inset
      {...props}
      render={(inset, state) => {
        const element = renderElement("div", inset, render, state);
        return <KindResizablePanel {...state.resizablePanel}>{element}</KindResizablePanel>;
      }}
    />
  );
}

/** Opens and closes the panel, named "Show <label>" or "Hide <label>". Without children it shows the panel icon. */
export function SidebarTrigger(props: SidebarTriggerProps) {
  return <parts.Trigger {...props} />;
}
