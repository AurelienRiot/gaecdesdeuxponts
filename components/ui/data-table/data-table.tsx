"use client";

import { ColumnDef, flexRender } from "@tanstack/react-table";

import { DataTableAdvancedToolbar } from "@/components/ui/data-table/advanced/data-table-advanced-toolbar";
import { DataTableFloatingBar } from "@/components/ui/data-table/data-table-floating-bar";
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination";
import { DataTableToolbar } from "@/components/ui/data-table/data-table-toolbar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDataTable } from "@/hooks/use-data-table";
import {
  DataTableFilterableColumn,
  DataTableSearchableColumn,
  DataTableViewOptionsColumn,
} from "@/types";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  floatingBarContent?: React.ReactNode | null;
  advancedFilter?: boolean;
  searchableColumns?: DataTableSearchableColumn<TData>[];
  filterableColumns?: DataTableFilterableColumn<TData>[];
  viewOptionsColumns?: DataTableViewOptionsColumn<TData>[];
  newRowLink?: string;
  deleteRowsAction?: React.MouseEventHandler<HTMLButtonElement>;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  floatingBarContent,
  advancedFilter,
  searchableColumns,
  filterableColumns,
  viewOptionsColumns,
  newRowLink,
  deleteRowsAction,
}: DataTableProps<TData, TValue>) {
  const { table } = useDataTable({
    data,
    columns,
  });
  return (
    <div className="w-full space-y-2.5 overflow-auto">
      {advancedFilter ? (
        <DataTableAdvancedToolbar
          table={table}
          filterableColumns={filterableColumns}
          searchableColumns={searchableColumns}
          viewOptionsColumns={viewOptionsColumns}
        />
      ) : (
        <DataTableToolbar
          table={table}
          filterableColumns={filterableColumns}
          searchableColumns={searchableColumns}
          viewOptionsColumns={viewOptionsColumns}
          newRowLink={newRowLink}
          deleteRowsAction={deleteRowsAction}
        />
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Aucun resultat
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="space-y-2.5">
        <DataTablePagination
          selectedRows={!!floatingBarContent}
          table={table}
        />
        {floatingBarContent ? (
          <DataTableFloatingBar table={table}>
            {floatingBarContent}
          </DataTableFloatingBar>
        ) : null}
      </div>
    </div>
  );
}
