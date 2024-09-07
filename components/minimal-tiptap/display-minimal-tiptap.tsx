import * as React from "react";
import "./styles/index.css";

import { cn } from "@/lib/utils";
import type { Content } from "@tiptap/react";
import { EditorContent } from "@tiptap/react";
import { useMinimalTiptapEditor, type UseMinimalTiptapEditorProps } from "./hooks/use-minimal-tiptap";

export interface DisplayMinimalTiptapProps extends Omit<UseMinimalTiptapEditorProps, "onUpdate"> {
  value?: Content;
  className?: string;
  editorContentClassName?: string;
}

export const DisplayMinimalTiptapEditor = React.forwardRef<HTMLDivElement, DisplayMinimalTiptapProps>(
  ({ value, className, editorContentClassName, ...props }, ref) => {
    const editor = useMinimalTiptapEditor({
      value,
      ...props,
    });

    if (!editor) {
      return null;
    }

    return (
      <div ref={ref} className={cn("relative ", className)}>
        <EditorContent
          ref={ref}
          readOnly
          editor={editor}
          className={cn("minimal-tiptap-editor", editorContentClassName)}
        />
      </div>
    );
  },
);

DisplayMinimalTiptapEditor.displayName = "DisplayMinimalTiptapEditor";

export default DisplayMinimalTiptapEditor;
