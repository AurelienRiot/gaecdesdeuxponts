"use client";

import {
  FeaturedCell,
  LinkProductsCell,
  NameWithImageCell,
} from "@/components/table-custom-fuction/cell-products";
import {
  ArchivedCell,
  CreatedAtCell,
} from "@/components/table-custom-fuction/common-cell";
import { CreatedAtHeader } from "@/components/table-custom-fuction/common-header";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

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
  },
  {
    accessorKey: "isFeatured",
    header: "Mise en avant",
    cell: FeaturedCell,
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
