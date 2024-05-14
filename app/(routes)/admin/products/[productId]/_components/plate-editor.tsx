"use client";

import { cn } from "@udecode/cn";
import { Plate, TElement } from "@udecode/plate-common";
import { useRef } from "react";

import { CursorOverlay } from "@/components/plate-ui/cursor-overlay";
import { Editor } from "@/components/plate-ui/editor";
import { FixedToolbar } from "@/components/plate-ui/fixed-toolbar";
import { FixedToolbarButtons } from "@/components/plate-ui/fixed-toolbar-buttons";
import { FloatingToolbar } from "@/components/plate-ui/floating-toolbar";
import { FloatingToolbarButtons } from "@/components/plate-ui/floating-toolbar-buttons";
import { MentionCombobox } from "@/components/plate-ui/mention-combobox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MENTIONABLES } from "@/lib/plate/mentionables";
import { plugins } from "@/lib/plate/plate-plugins";
import { useFormContext } from "react-hook-form";
import { ProductFormValues } from "./product-form";

type PlateEditorProps = {
  loading: boolean;
  initialValue: TElement[];
};

export function PlateEditor({ loading, initialValue }: PlateEditorProps) {
  const containerRef = useRef(null);
  const form = useFormContext<ProductFormValues>();

  return (
    <FormField
      control={form.control}
      name="productSpecs"
      render={({ field }) => (
        <FormItem>
          <>
            <FormLabel>Spécification du produit</FormLabel>

            <div className="flex">
              <FormControl className="min-h-[20rem] lg:w-1/2">
                <Plate
                  plugins={plugins}
                  initialValue={initialValue}
                  onChange={(value) => {
                    field.onChange(JSON.stringify(value));
                  }}
                >
                  <div
                    ref={containerRef}
                    className={cn(
                      // Block selection
                      "rounded-md border border-input [&_.slate-start-area-left]:!w-[64px] [&_.slate-start-area-right]:!w-[64px] [&_.slate-start-area-top]:!h-4",
                    )}
                  >
                    <FixedToolbar>
                      <FixedToolbarButtons />
                    </FixedToolbar>
                    <Editor
                      disabled={loading}
                      className="rounded-t-none  bg-clip-content  shadow-inner "
                      autoFocus
                      focusRing={false}
                      variant="ghost"
                      size="md"
                    />
                    <FloatingToolbar>
                      <FloatingToolbarButtons />
                    </FloatingToolbar>
                    <MentionCombobox items={MENTIONABLES} />

                    <CursorOverlay containerRef={containerRef} />
                  </div>
                </Plate>
              </FormControl>
            </div>

            <FormMessage />
          </>
        </FormItem>
      )}
    />
  );
}
