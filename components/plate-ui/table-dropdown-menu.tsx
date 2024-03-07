import React from "react";
import { DropdownMenuProps } from "@radix-ui/react-dropdown-menu";
import {
  focusEditor,
  someNode,
  useEditorRef,
  useEditorSelector,
} from "@udecode/plate-common";
import {
  deleteColumn,
  deleteRow,
  deleteTable,
  ELEMENT_TABLE,
  insertTable,
  insertTableColumn,
  insertTableRow,
} from "@udecode/plate-table";

import { Icons, iconVariants } from "@/components/icons";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  useOpenState,
} from "./dropdown-menu";
import { ToolbarButton } from "./toolbar";
import GridCells from "@/app/(routes)/admin/products/[productId]/components/grid-cells";

export function TableDropdownMenu(props: DropdownMenuProps) {
  const tableSelected = useEditorSelector(
    (editor) => someNode(editor, { match: { type: ELEMENT_TABLE } }),
    []
  );

  const editor = useEditorRef();
  const openState = useOpenState();

  return (
    <DropdownMenu modal={false} {...openState} {...props}>
      <DropdownMenuTrigger asChild>
        <ToolbarButton pressed={openState.open} tooltip="Tableau" isDropdown>
          <Icons.table />
        </ToolbarButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="center"
        className="flex w-[180px] min-w-0 flex-col gap-0.5"
      >
        <DropdownMenuItem className="min-w-[180px] flex flex-col h-full ">
          <div className="flex">
            <Icons.add className={iconVariants({ variant: "menuItem" })} />
            Inserér un tableau
          </div>
          <GridCells
            handleCellClick={(rowIndex: number, colIndex: number) => {
              insertTable(editor, {
                rowCount: rowIndex,
                colCount: colIndex,
              });
              focusEditor(editor);
            }}
          />
        </DropdownMenuItem>
        {/* <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Icons.table className={iconVariants({ variant: "menuItem" })} />
            <span>Tableau</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent sideOffset={-180} alignOffset={30}>
            <DropdownMenuItem
              className="min-w-[180px] flex flex-col h-full"
              onSelect={async () => {
                insertTable(editor);
                focusEditor(editor);
              }}
            >
              <div className="flex">
                <Icons.add className={iconVariants({ variant: "menuItem" })} />
                Inserér un tableau
              </div>
              <GridCells
                handleCellClick={(rowIndex: number, colIndex: number) => {
                  insertTable(editor, {
                    rowCount: rowIndex,
                    colCount: colIndex,
                  });
                }}
              />
            </DropdownMenuItem>
            <DropdownMenuItem
              className="min-w-[180px]"
              disabled={!tableSelected}
              onSelect={async () => {
                deleteTable(editor);
                focusEditor(editor);
              }}
            >
              <Icons.trash className={iconVariants({ variant: "menuItem" })} />
              Supprimer le tableau
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger disabled={!tableSelected}>
            <Icons.column className={iconVariants({ variant: "menuItem" })} />
            <span>Colonne</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem
              className="min-w-[180px]"
              disabled={!tableSelected}
              onSelect={async () => {
                insertTableColumn(editor);
                focusEditor(editor);
              }}
            >
              <Icons.add className={iconVariants({ variant: "menuItem" })} />
              Inserer une colonne
            </DropdownMenuItem>
            <DropdownMenuItem
              className="min-w-[180px]"
              disabled={!tableSelected}
              onSelect={async () => {
                deleteColumn(editor);
                focusEditor(editor);
              }}
            >
              <Icons.minus className={iconVariants({ variant: "menuItem" })} />
              Supprimer la colonne
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger disabled={!tableSelected}>
            <Icons.row className={iconVariants({ variant: "menuItem" })} />
            <span>Rangés </span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem
              className="min-w-[180px]"
              disabled={!tableSelected}
              onSelect={async () => {
                insertTableRow(editor);
                focusEditor(editor);
              }}
            >
              <Icons.add className={iconVariants({ variant: "menuItem" })} />
              Insérer une rangée
            </DropdownMenuItem>
            <DropdownMenuItem
              className="min-w-[180px]"
              disabled={!tableSelected}
              onSelect={async () => {
                deleteRow(editor);
                focusEditor(editor);
              }}
            >
              <Icons.minus className={iconVariants({ variant: "menuItem" })} />
              Supprimer la rangée
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
