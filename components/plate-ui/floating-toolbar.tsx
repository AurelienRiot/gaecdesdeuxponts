"use client";

import React from "react";
import { cn, withRef } from "@udecode/cn";
import {
  PortalBody,
  useComposedRef,
  useEditorReadOnly,
  useEventEditorSelectors,
  usePlateSelectors,
} from "@udecode/plate-common";
import {
  flip,
type  FloatingToolbarState,
  offset,
  useFloatingToolbar,
  useFloatingToolbarState,
} from "@udecode/plate-floating";

import { Toolbar } from "./toolbar";

export const FloatingToolbar = withRef<
  typeof Toolbar,
  {
    state?: FloatingToolbarState;
  }
>(({ state, children, ...props }, componentRef) => {
  const editorId = usePlateSelectors().id();
  const focusedEditorId = useEventEditorSelectors.focus();
  const floatingToolbarState = useFloatingToolbarState({
    editorId,
    focusedEditorId,
    ...state,
    floatingOptions: {
      placement: "bottom",
      middleware: [
        offset(12),
        flip({
          padding: 12,
          fallbackPlacements: [
            "bottom-start",
            "bottom-end",
            "top-start",
            "top-end",
          ],
        }),
      ],
      ...state?.floatingOptions,
    },
  });

  const {
    ref: floatingRef,
    props: rootProps,
    hidden,
  } = useFloatingToolbar(floatingToolbarState);

  const ref = useComposedRef<HTMLDivElement>(componentRef, floatingRef);
  const readOnly = useEditorReadOnly();

  if (hidden || readOnly) return null;

  return (
    <PortalBody>
      <Toolbar
        ref={ref}
        className={cn(
          "absolute z-50 whitespace-nowrap border bg-popover px-1 opacity-100 shadow-md print:hidden",
        )}
        {...rootProps}
        {...props}
      >
        {children}
      </Toolbar>
    </PortalBody>
  );
});
