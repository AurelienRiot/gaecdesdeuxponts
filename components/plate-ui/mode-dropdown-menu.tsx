import React from "react";
import type { DropdownMenuProps } from "@radix-ui/react-dropdown-menu";
import { focusEditor, useEditorReadOnly, useEditorRef, usePlateStore } from "@udecode/plate-common";

import { Icons } from "@/components/icons";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  useOpenState,
} from "./dropdown-menu";
import { ToolbarButton } from "./toolbar";

export function ModeDropdownMenu(props: DropdownMenuProps) {
  const editor = useEditorRef();
  const setReadOnly = usePlateStore().set.readOnly();
  const readOnly = useEditorReadOnly();
  const openState = useOpenState();

  const item = {
    editing: (
      <>
        <Icons.editing className="mr-2 size-5" />
        <span className="hidden lg:inline">Édition</span>
      </>
    ),
    viewing: (
      <>
        <Icons.viewing className="mr-2 size-5" />
        <span className="hidden lg:inline">Affichage</span>
      </>
    ),
  };

  let value: "editing" | "viewing" = "editing";
  if (readOnly) value = "viewing";
  return (
    <DropdownMenu modal={false} {...openState} {...props}>
      <DropdownMenuTrigger asChild>
        <ToolbarButton
          pressed={openState.open}
          tooltip="Mode d'édition"
          isDropdown
          className="min-w-[auto] lg:min-w-[130px]"
        >
          {item[value]}
        </ToolbarButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="min-w-[180px]">
        <DropdownMenuRadioGroup
          className="flex flex-col gap-0.5"
          value={value}
          onValueChange={(newValue) => {
            if (newValue !== "viewing") {
              setReadOnly(false);
            }

            if (newValue === "viewing") {
              setReadOnly(true);
              return;
            }

            if (newValue === "editing") {
              focusEditor(editor);
              return;
            }
          }}
        >
          <DropdownMenuRadioItem value="editing">{item.editing}</DropdownMenuRadioItem>

          <DropdownMenuRadioItem value="viewing">{item.viewing}</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
