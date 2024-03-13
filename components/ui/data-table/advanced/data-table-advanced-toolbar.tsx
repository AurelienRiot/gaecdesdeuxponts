"use client";

import * as React from "react";
import type {
  DataTableFilterableColumn,
  DataTableFilterOption,
  DataTableSearchableColumn,
  DataTableViewOptionsColumn,
} from "@/types";
import { CaretSortIcon, PlusIcon } from "@radix-ui/react-icons";
import type { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableAdvancedFilter } from "@/components/ui/data-table/advanced/data-table-advanced-filter";
import { DataTableViewOptions } from "@/components/ui/data-table/data-table-view-options";

import { DataTableAdvancedFilterItem } from "./data-table-advanced-filter-item";
import { DataTableMultiFilter } from "./data-table-multi-filter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../select";

interface DataTableAdvancedToolbarProps<TData> {
  table: Table<TData>;
  searchableColumns?: DataTableSearchableColumn<TData>[];
  filterableColumns?: DataTableFilterableColumn<TData>[];
  viewOptionsColumns?: DataTableViewOptionsColumn<TData>[];
}

export function DataTableAdvancedToolbar<TData>({
  table,
  filterableColumns = [],
  searchableColumns = [],
  viewOptionsColumns = [],
}: DataTableAdvancedToolbarProps<TData>) {
  const [selectedOptions, setSelectedOptions] = React.useState<
    DataTableFilterOption<TData>[]
  >([]);
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState(searchableColumns[0].id);

  React.useEffect(() => {
    if (selectedOptions.length > 0) {
      setOpen(true);
    }
  }, [selectedOptions]);

  const options: DataTableFilterOption<TData>[] = React.useMemo(() => {
    const searchableOptions = searchableColumns.map((column) => ({
      id: crypto.randomUUID(),
      label: String(column.id),
      value: column.id,
      items: [],
    }));
    const filterableOptions = filterableColumns.map((column) => ({
      id: crypto.randomUUID(),
      label: column.title,
      value: column.id,
      items: column.options,
    }));

    return [...searchableOptions, ...filterableOptions];
  }, [filterableColumns, searchableColumns]);

  return (
    <div className="w-full space-y-2.5 overflow-auto p-1">
      <div className="flex items-center justify-between space-x-2">
        <div className="flex flex-1 items-center space-x-2">
          {searchableColumns.length > 0 && (
            <>
              <Input
                placeholder={`Filter ${searchableColumns.find((column) => column.id === searchValue)?.title}...`}
                value={
                  (table
                    .getColumn(
                      String(
                        searchableColumns.find(
                          (column) => column.id === searchValue,
                        )?.id,
                      ),
                    )
                    ?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table
                    .getColumn(
                      String(
                        searchableColumns.find(
                          (column) => column.id === searchValue,
                        )?.id,
                      ),
                    )
                    ?.setFilterValue(event.target.value)
                }
                className="h-8 w-[150px] lg:w-[250px]"
              />
              {searchableColumns.length > 1 && (
                <div className="relative inline-flex sm:pl-2 ">
                  <Select
                    value={String(searchValue)}
                    onValueChange={(newValue) => {
                      table.getColumn(String(searchValue))?.setFilterValue("");
                      setSearchValue(newValue as keyof TData);
                    }}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Select a value" />
                    </SelectTrigger>
                    <SelectContent>
                      {searchableColumns.map((column) => (
                        <SelectItem
                          key={String(column.id)}
                          value={String(column.id)}
                        >
                          {column.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {selectedOptions.length > 0 ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpen((prev) => !prev)}
            >
              Filter
              <CaretSortIcon
                className="ml-2 size-4 opacity-50"
                aria-hidden="true"
              />
            </Button>
          ) : (
            <DataTableAdvancedFilter
              options={options.filter(
                (option) =>
                  !selectedOptions.some(
                    (selectedOption) => selectedOption.value === option.value,
                  ),
              )}
              selectedOptions={selectedOptions}
              setSelectedOptions={setSelectedOptions}
            />
          )}
          <DataTableViewOptions
            viewOptionsColumns={viewOptionsColumns}
            table={table}
          />
        </div>
      </div>
      {open ? (
        <div className="flex items-center space-x-2">
          {selectedOptions.some((option) => option.isMulti) ? (
            <DataTableMultiFilter
              table={table}
              allOptions={options}
              options={selectedOptions.filter((option) => option.isMulti)}
              setSelectedOptions={setSelectedOptions}
            />
          ) : null}
          {selectedOptions
            .filter((option) => !option.isMulti)
            .map((selectedOption) => (
              <DataTableAdvancedFilterItem
                key={String(selectedOption.value)}
                table={table}
                selectedOption={selectedOption}
                setSelectedOptions={setSelectedOptions}
              />
            ))}
          <DataTableAdvancedFilter
            options={options}
            selectedOptions={selectedOptions}
            setSelectedOptions={setSelectedOptions}
          >
            <Button
              variant="outline"
              size="sm"
              role="combobox"
              className="rounded-full"
            >
              <PlusIcon className="mr-2 size-4 opacity-50" aria-hidden="true" />
              Add filter
            </Button>
          </DataTableAdvancedFilter>
        </div>
      ) : null}
    </div>
  );
}
