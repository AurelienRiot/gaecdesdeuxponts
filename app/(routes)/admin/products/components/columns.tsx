"use client";

import {
  FeaturedCell,
  LinkProductsCell,
  ProCell,
} from "@/components/table-custom-fuction/cell-products";
import {
  ArchivedCell,
  CreatedAtCell,
  NameWithImageCell,
} from "@/components/table-custom-fuction/common-cell";
import { CreatedAtHeader } from "@/components/table-custom-fuction/common-header";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import {
  DataTableFilterableColumn,
  DataTableSearchableColumn,
  DataTableViewOptionsColumn,
} from "@/types";
import { FilterFn } from "@/components/table-custom-fuction/common-filter";

export type ProductColumn = {
  id: string;
  name: string;
  imageUrl: string;
  price: string;
  category: string;
  linkProducts: {
    id: string;
    name: string;
  }[];
  isFeatured: boolean;
  isArchived: boolean;
  isPro: boolean;
  type: "products";
  createdAt: Date;
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Nom",
    cell: NameWithImageCell,
  },
  {
    accessorKey: "isArchived",
    header: "Archivé",
    cell: ArchivedCell,
    filterFn: FilterFn,
  },
  {
    accessorKey: "isFeatured",
    header: "Mise en avant",
    cell: FeaturedCell,
    filterFn: FilterFn,
  },
  {
    accessorKey: "isPro",
    header: "Professionnel",
    cell: ProCell,
    filterFn: FilterFn,
  },
  {
    accessorKey: "price",
    header: "Prix",
  },
  {
    accessorKey: "category",
    header: "Categorie",
  },
  {
    accessorKey: "linkProducts",
    header: "Produits liées",
    cell: LinkProductsCell,
  },
  {
    accessorKey: "createdAt",
    header: CreatedAtHeader,
    cell: CreatedAtCell,
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

export const filterableColumns: DataTableFilterableColumn<ProductColumn>[] = [
  {
    id: "isArchived",
    title: "Archivé",
    options: [
      { label: "Archivé", value: "true" },
      { label: "Non archivé", value: "false" },
    ],
  },
  {
    id: "isFeatured",
    title: "Mise en avant",
    options: [
      { label: "Mise en avant", value: "true" },
      { label: "Non mise en avant", value: "false" },
    ],
  },
  {
    id: "isPro",
    title: "Professionnel",
    options: [
      { label: "Professionnel", value: "true" },
      { label: "Particulier", value: "false" },
    ],
  },
];

export const searchableColumns: DataTableSearchableColumn<ProductColumn>[] = [
  {
    id: "name",
    title: "Nom",
  },
  {
    id: "price",
    title: "Prix",
  },
  {
    id: "category",
    title: "Categorie",
  },
];

export const viewOptionsColumns: DataTableViewOptionsColumn<ProductColumn>[] = [
  {
    id: "name",
    title: "Produits",
  },

  {
    id: "isArchived",
    title: "Archivé",
  },

  {
    id: "isFeatured",
    title: "Mise en avant",
  },
  {
    id: "isPro",
    title: "Professionnel",
  },
  {
    id: "price",
    title: "Prix",
  },
  {
    id: "category",
    title: "Categorie",
  },

  {
    id: "linkProducts",
    title: "Produits liées",
  },
  {
    id: "createdAt",
    title: "Date de création",
  },
  {
    id: "actions" as keyof ProductColumn,
    title: "Actions",
  },
];
