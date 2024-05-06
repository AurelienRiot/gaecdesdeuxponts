"use client";

import {
  CheckboxCell,
  DateCell,
  NameWithImageCell,
  OptionsCell,
} from "@/components/table-custom-fuction/common-cell";
import {
  FilterAllInclude,
  FilterOneInclude,
} from "@/components/table-custom-fuction/common-filter";
import { CreatedAtHeader } from "@/components/table-custom-fuction/common-header";
import {
  DataTableFilterableColumn,
  DataTableSearchableColumn,
  DataTableViewOptionsColumn,
} from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { changeArchived, changePro } from "./server-action";

export type ProductColumn = {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
  optionsName: string;
  productOptions: {
    price: number;
    options: { name: string; value: string }[];
  }[];
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
    filterFn: FilterOneInclude,
  },
  {
    accessorKey: "category",
    header: "Categorie",
    filterFn: FilterOneInclude,
  },
  {
    accessorKey: "optionsName",
    header: "Options",
    cell: OptionsCell,
    filterFn: FilterAllInclude,
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
    accessorKey: "createdAt",
    header: CreatedAtHeader,
    cell: ({ row }) => <DateCell date={row.original.createdAt} />,
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

export const filterableColumns = ({
  categoryNames,
  productNames,
  optionValues,
}: {
  categoryNames: string[];
  productNames: string[];
  optionValues: string[];
}): DataTableFilterableColumn<ProductColumn>[] => {
  const catArray = categoryNames.map((item) => ({
    label: item,
    value: item,
  }));

  const nameArray = productNames.map((item) => ({
    label: item,
    value: item,
  }));

  const optionArray = optionValues.map((item) => ({
    label: item,
    value: item,
  }));

  return [
    {
      id: "name",
      title: "Nom",
      options: nameArray,
    },
    {
      id: "category",
      title: "Catégorie",
      options: catArray,
    },
    {
      id: "optionsName",
      title: "Options",
      options: optionArray,
    },
    {
      id: "isArchived",
      title: "Archivé",
      options: [
        { label: "Archivé", value: "true" },
        { label: "Non archivé", value: "false" },
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
};

export const searchableColumns: DataTableSearchableColumn<ProductColumn>[] = [
  {
    id: "name",
    title: "Nom",
  },

  // {
  //   id: "price",
  //   title: "Prix",
  // },
];

export const viewOptionsColumns: DataTableViewOptionsColumn<ProductColumn>[] = [
  {
    id: "name",
    title: "Produits",
  },
  {
    id: "category",
    title: "Categorie",
  },
  {
    id: "optionsName",
    title: "Options",
  },
  {
    id: "isArchived",
    title: "Archivé",
  },

  {
    id: "isPro",
    title: "Professionnel",
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
