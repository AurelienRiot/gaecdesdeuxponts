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
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../command";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

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
    // <DropdownMenu>
    //   <DropdownMenuTrigger asChild>
    //     <Button
    //       aria-label="Toggle columns"
    //       variant="outline"
    //       size="sm"
    //       className="ml-auto hidden h-8 lg:flex"
    //     >
    //       <MixerHorizontalIcon className="mr-2 size-4" />
    //       Vue
    //     </Button>
    //   </DropdownMenuTrigger>
    //   <DropdownMenuContent align="end" className="w-[150px]">
    //     <DropdownMenuLabel>Colonnes visibles</DropdownMenuLabel>
    //     <DropdownMenuSeparator />
    //     {viewOptionsColumns.map((column) => {
    //       return (
    //         <DropdownMenuCheckboxItem
    //           key={String(column.id)}
    //           className="capitalize"
    //           checked={table
    //             .getAllColumns()
    //             .find((col) => col.id === column.id)
    //             ?.getIsVisible()}
    //           onCheckedChange={(value) =>
    //             table
    //               .getAllColumns()
    //               .find((col) => col.id === column.id)
    //               ?.toggleVisibility(!!value)
    //           }
    //         >
    //           {column.title}
    //         </DropdownMenuCheckboxItem>
    //       );
    //     })}
    //   </DropdownMenuContent>
    // </DropdownMenu>
    <Popover>
      <PopoverTrigger asChild>
        <Button
          aria-label="Toggle columns"
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
        >
          <MixerHorizontalIcon className="mr-2 size-4" />
          Vue
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandList>
            <CommandEmpty>Aucun résultat</CommandEmpty>
            <CommandGroup>
              {viewOptionsColumns.map((column) => {
                const isSelected = table
                  .getAllColumns()
                  .find((col) => col.id === column.id)
                  ?.getIsVisible();
                return (
                  <CommandItem
                    key={String(column.id)}
                    className="capitalize"
                    onSelect={() =>
                      table
                        .getAllColumns()
                        .find((col) => col.id === column.id)
                        ?.toggleVisibility(!isSelected)
                    }
                  >
                    <div
                      className={cn(
                        "mr-2 flex size-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible",
                      )}
                    >
                      <CheckIcon className={cn("size-4")} aria-hidden="true" />
                    </div>

                    <span>{column.title}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
