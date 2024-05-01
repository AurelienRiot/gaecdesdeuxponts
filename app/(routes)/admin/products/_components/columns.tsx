"use client";

import {
  CheckboxCell,
  DateCell,
  NameWithImageCell,
} from "@/components/table-custom-fuction/common-cell";
import { FilterOneInclude } from "@/components/table-custom-fuction/common-filter";
import { CreatedAtHeader } from "@/components/table-custom-fuction/common-header";
import {
  DataTableFilterableColumn,
  DataTableSearchableColumn,
  DataTableViewOptionsColumn,
} from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { changeArchived, changeFeatured, changePro } from "./server-action";

export type ProductColumn = {
  id: string;
  name: string;
  imageUrl: string;
  price: string;
  category: string;
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
    cell: ({ row }) => (
      <CheckboxCell
        isCheckbox={row.original.isArchived}
        onChange={(e: boolean | "indeterminate") =>
          changeArchived({ id: row.original.id, isArchived: e })
        }
      />
    ),
    filterFn: FilterOneInclude,
  },
  {
    accessorKey: "isFeatured",
    header: "Mise en avant",
    cell: ({ row }) => (
      <CheckboxCell
        isCheckbox={row.original.isFeatured}
        onChange={(e: boolean | "indeterminate") =>
          changeFeatured({ id: row.original.id, isFeatured: e })
        }
      />
    ),
    filterFn: FilterOneInclude,
  },
  {
    accessorKey: "isPro",
    header: "Professionnel",
    cell: ({ row }) => (
      <CheckboxCell
        isCheckbox={row.original.isPro}
        onChange={(e: boolean | "indeterminate") =>
          changePro({ id: row.original.id, isPro: e })
        }
      />
    ),
    filterFn: FilterOneInclude,
  },
  {
    accessorKey: "price",
    header: "Prix",
  },
  {
    accessorKey: "category",
    header: "Categorie",
    filterFn: FilterOneInclude,
  },

  {
    accessorKey: "createdAt",
    header: CreatedAtHeader,
    cell: ({ row }) => <DateCell date={row.original.createdAt} />,
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

export const filterableColumns = (
  categories: string[],
): DataTableFilterableColumn<ProductColumn>[] => {
  const catArray = categories.map((item) => ({
    label: item,
    value: item,
  }));

  return [
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
    {
      id: "category",
      title: "Catégorie",
      options: catArray,
    },
  ];
};

export const searchableColumns: DataTableSearchableColumn<ProductColumn>[] = [
  {
    id: "name",
    title: "Nom",
  },
  {
    id: "price",
    title: "Prix",
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
    id: "createdAt",
    title: "Date de création",
  },
  {
    id: "actions" as keyof ProductColumn,
    title: "Actions",
  },
];
