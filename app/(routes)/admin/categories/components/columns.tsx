"use client";

import { NameWithImageCell } from "@/components/table-custom-fuction/cell-products";
import { CreatedAtCell } from "@/components/table-custom-fuction/common-cell";
import { CreatedAtHeader } from "@/components/table-custom-fuction/common-header";
import { DataTableSearchableColumn, DataTableViewOptionsColumn } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type CategoryColumnType = {
  id: string;
  type: "categories";
  name: string;
  imageUrl: string;
  createdAt: Date;
};

export const CategoryColumn: ColumnDef<CategoryColumnType>[] = [
  {
    accessorKey: "name",
    header: "Nom",
    cell: NameWithImageCell,
  },

  {
    accessorKey: "createdAt",
    header: CreatedAtHeader,
    cell: CreatedAtCell,
  },
  {
    accessorKey: "actions",
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

export const searchableColumns: DataTableSearchableColumn<CategoryColumnType>[] =
  [
    {
      id: "name",
      title: "Nom",
    },
  ];

export const viewOptionsColumns: DataTableViewOptionsColumn<CategoryColumnType>[] =
  [
    {
      id: "name",
      title: "Nom",
    },
    {
      id: "createdAt",
      title: "Date de création",
    },
    {
      id: "actions" as keyof CategoryColumnType,
      title: "Actions",
    },
  ];
