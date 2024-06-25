import React from "react";
import type * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { PopoverAnchor } from "@radix-ui/react-popover";
import { cn, withRef } from "@udecode/cn";
import {
  focusEditor,
  isSelectionExpanded,
  PlateElement,
  useEditorRef,
  useEditorSelector,
  useElement,
  useRemoveNodeButton,
  withHOC,
} from "@udecode/plate-common";
import {
  deleteColumn,
  deleteRow,
  insertTableColumn,
  insertTableRow,
  mergeTableCells,
  TableProvider,
  type TTableElement,
  unmergeTableCells,
  useTableBordersDropdownMenuContentState,
  useTableElement,
  useTableElementState,
  useTableMergeState,
} from "@udecode/plate-table";
import { useReadOnly, useSelected } from "slate-react";

import { Icons, iconVariants } from "@/components/icons";

import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Popover, PopoverContent, popoverVariants } from "./popover";
import { Separator } from "./separator";

export const TableBordersDropdownMenuContent = withRef<
  typeof DropdownMenuPrimitive.Content
>((props, ref) => {
  const {
    getOnSelectTableBorder,
    hasOuterBorders,
    hasBottomBorder,
    hasLeftBorder,
    hasNoBorders,
    hasRightBorder,
    hasTopBorder,
  } = useTableBordersDropdownMenuContentState();

  return (
    <DropdownMenuContent
      ref={ref}
      className={cn("min-w-[220px]")}
      side="right"
      align="start"
      sideOffset={5}
      {...props}
    >
      <DropdownMenuCheckboxItem
        checked={hasBottomBorder}
        onCheckedChange={getOnSelectTableBorder("bottom")}
      >
        <Icons.borderBottom className={iconVariants({ size: "sm" })} />
        <div>Bordure inférieure</div>
      </DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem
        checked={hasTopBorder}
        onCheckedChange={getOnSelectTableBorder("top")}
      >
        <Icons.borderTop className={iconVariants({ size: "sm" })} />
        <div>Bordure superieure</div>
      </DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem
        checked={hasLeftBorder}
        onCheckedChange={getOnSelectTableBorder("left")}
      >
        <Icons.borderLeft className={iconVariants({ size: "sm" })} />
        <div>Bordure gauche</div>
      </DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem
        checked={hasRightBorder}
        onCheckedChange={getOnSelectTableBorder("right")}
      >
        <Icons.borderRight className={iconVariants({ size: "sm" })} />
        <div>Bordure droite</div>
      </DropdownMenuCheckboxItem>

      <Separator />

      <DropdownMenuCheckboxItem
        checked={hasNoBorders}
        onCheckedChange={getOnSelectTableBorder("none")}
      >
        <Icons.borderNone className={iconVariants({ size: "sm" })} />
        <div>Aucune bordure</div>
      </DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem
        checked={hasOuterBorders}
        onCheckedChange={getOnSelectTableBorder("outer")}
      >
        <Icons.borderAll className={iconVariants({ size: "sm" })} />
        <div>Bordure externe</div>
      </DropdownMenuCheckboxItem>
    </DropdownMenuContent>
  );
});

export const TableFloatingToolbar = withRef<typeof PopoverContent>(
  ({ children, ...props }, ref) => {
    const element = useElement<TTableElement>();
    const { props: buttonProps } = useRemoveNodeButton({ element });

    const selectionCollapsed = useEditorSelector(
      (editor) => !isSelectionExpanded(editor),
      []
    );

    const readOnly = useReadOnly();
    const selected = useSelected();
    const editor = useEditorRef();

    const collapsed = !readOnly && selected && selectionCollapsed;
    const open = !readOnly && selected;

    const { canMerge, canUnmerge } = useTableMergeState();

    const mergeContent = canMerge && (
      <Button
        contentEditable={false}
        variant="ghost"
        isMenu
        onClick={() => mergeTableCells(editor)}
      >
        <Icons.combine className="mr-2 size-4" />
        Merge
      </Button>
    );

    const unmergeButton = canUnmerge && (
      <Button
        contentEditable={false}
        variant="ghost"
        isMenu
        onClick={() => unmergeTableCells(editor)}
      >
        <Icons.ungroup className="mr-2 size-4" />
        Unmerge
      </Button>
    );

    const bordersContent = collapsed && (
      <>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" isMenu>
              <Icons.borderAll className="mr-2 size-4" />
              Bordures
              <Icons.chevronRight className="ml-auto size-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuPortal>
            <TableBordersDropdownMenuContent />
          </DropdownMenuPortal>
        </DropdownMenu>

        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" isMenu>
              <Icons.column className={iconVariants({ variant: "menuItem" })} />
              <span>Colonne</span>
              <Icons.chevronRight className="ml-auto size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuContent
              className="min-w-[220px]"
              side="right"
              align="start"
              sideOffset={5}
            >
              <DropdownMenuItem
                className="min-w-[180px]"
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
                onSelect={async () => {
                  deleteColumn(editor);
                  focusEditor(editor);
                }}
              >
                <Icons.minus
                  className={iconVariants({ variant: "menuItem" })}
                />
                Supprimer la colonne
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenu>

        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" isMenu>
              <Icons.row className={iconVariants({ variant: "menuItem" })} />
              <span>Rangés </span>
              <Icons.chevronRight className="ml-auto size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuContent
              className="min-w-[220px]"
              side="right"
              align="start"
              sideOffset={5}
            >
              <DropdownMenuItem
                className="min-w-[180px]"
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
                onSelect={async () => {
                  deleteRow(editor);
                  focusEditor(editor);
                }}
              >
                <Icons.minus
                  className={iconVariants({ variant: "menuItem" })}
                />
                Supprimer la rangée
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenu>

        <Button contentEditable={false} variant="ghost" isMenu {...buttonProps}>
          <Icons.delete className="mr-2 size-4" />
          Supprimé
        </Button>
      </>
    );

    return (
      <Popover open={open} modal={false}>
        <PopoverAnchor asChild>{children}</PopoverAnchor>
        {(canMerge || canUnmerge || collapsed) && (
          <PopoverContent
            ref={ref}
            className={cn(
              popoverVariants(),
              "flex w-[220px] flex-col gap-1 p-1"
            )}
            onOpenAutoFocus={(e) => e.preventDefault()}
            {...props}
          >
            {unmergeButton}
            {mergeContent}
            {bordersContent}
          </PopoverContent>
        )}
      </Popover>
    );
  }
);

export const TableElement = withHOC(
  TableProvider,
  withRef<typeof PlateElement>(({ className, children, ...props }, ref) => {
    const { colSizes, isSelectingCell, minColumnWidth, marginLeft } =
      useTableElementState();
    const { props: tableProps, colGroupProps } = useTableElement();

    return (
      <TableFloatingToolbar>
        <div style={{ paddingLeft: marginLeft }}>
          <PlateElement
            ref={ref}
            asChild
            className={cn(
              "my-4 ml-px mr-0 table h-px w-full max-w-[800px] table-fixed   border-collapse ",
              isSelectingCell && "[&_*::selection]:bg-none",
              className
            )}
            {...tableProps}
            {...props}
          >
            <table>
              <colgroup {...colGroupProps}>
                {colSizes.map((width, index) => (
                  <col
                    key={index}
                    style={{
                      minWidth: minColumnWidth,
                      width: width || undefined,
                    }}
                  />
                ))}
              </colgroup>

              <tbody className="w-full">{children}</tbody>
            </table>
          </PlateElement>
        </div>
      </TableFloatingToolbar>
    );
  })
);
