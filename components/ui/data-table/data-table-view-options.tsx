"use client";

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import { type Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { DataTableViewOptionsColumn } from "@/types";

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
  viewOptionsColumns: DataTableViewOptionsColumn<TData>[];
}

export function DataTableViewOptions<TData>({
  table,
  viewOptionsColumns,
}: DataTableViewOptionsProps<TData>) {
  if (viewOptionsColumns.length === 0) return null;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="Toggle columns"
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
        >
          <MixerHorizontalIcon className="mr-2 size-4" />
          Vue
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Colonnes visibles</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {viewOptionsColumns.map((column) => {
          return (
            <DropdownMenuCheckboxItem
              key={String(column.id)}
              className="capitalize"
              checked={table
                .getAllColumns()
                .find((col) => col.id === column.id)
                ?.getIsVisible()}
              onCheckedChange={(value) =>
                table
                  .getAllColumns()
                  .find((col) => col.id === column.id)
                  ?.toggleVisibility(!!value)
              }
            >
              {column.title}
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
