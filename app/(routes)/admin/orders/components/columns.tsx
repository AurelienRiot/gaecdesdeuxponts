"use client";

import { DataInvoiceType } from "@/components/pdf/data-invoice";
import {
  DatePickUpCell,
  FactureCell,
  ProductCell,
  ShopNameCell,
  StatusCell,
} from "@/components/table-custom-fuction/cell-orders";
import {
  CreatedAtCell,
  NameCell,
} from "@/components/table-custom-fuction/common-cell";
import { CreatedAtHeader } from "@/components/table-custom-fuction/common-header";
import { DatePickUpHeader } from "@/components/table-custom-fuction/header-orders";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import {
  DataTableFilterableColumn,
  DataTableSearchableColumn,
  DataTableViewOptionsColumn,
} from "@/types";
import {
  FilterExclude,
  FilterInclude,
} from "@/components/table-custom-fuction/common-filter";

export type OrderColumn = {
  id: string;
  userId: string;
  name: string;
  isPaid: boolean;
  datePickUp: Date;
  totalPrice: string;
  products: string;
  productsList: { name: string; quantity?: string }[];
  shopName: string;
  shopId: string;
  createdAt: Date;
  dataInvoice: DataInvoiceType;
};

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "products",
    header: "Produits",
    cell: ProductCell,
    filterFn: FilterExclude,
  },
  {
    accessorKey: "name",
    header: "Nom",
    cell: NameCell,
  },
  {
    accessorKey: "totalPrice",
    header: "Prix Total",
  },
  {
    accessorKey: "isPaid",
    header: "Facture",
    id: "pdf",
    cell: FactureCell,
  },
  {
    accessorKey: "isPaid",
    header: "Statut",
    cell: StatusCell,
    filterFn: FilterInclude,
  },
  {
    accessorKey: "datePickUp",
    header: DatePickUpHeader,
    cell: DatePickUpCell,
  },
  {
    accessorKey: "shopName",
    header: "Lieu de retrait",
    cell: ShopNameCell,
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

export const filterableColumns = (
  products: string[],
): DataTableFilterableColumn<OrderColumn>[] => {
  const prodArray = products.map((item) => ({
    label: item,
    value: item,
  }));

  return [
    {
      id: "products",
      title: "Produits",
      options: prodArray,
    },
    {
      id: "isPaid",
      title: "Status",
      options: [
        { label: "Payé", value: "true" },
        { label: "Non Payé", value: "false" },
      ],
    },
  ];
};

export const searchableColumns: DataTableSearchableColumn<OrderColumn>[] = [
  {
    id: "name",
    title: "Nom",
  },
  {
    id: "totalPrice",
    title: "Prix",
  },
  {
    id: "shopName",
    title: "Lieu de retrait",
  },
];

export const viewOptionsColumns: DataTableViewOptionsColumn<OrderColumn>[] = [
  {
    id: "products",
    title: "Produits",
  },
  {
    id: "name",
    title: "Nom",
  },
  {
    id: "totalPrice",
    title: "Prix",
  },

  {
    id: "pdf" as keyof OrderColumn,
    title: "Facture",
  },
  {
    id: "isPaid",
    title: "Status",
  },
  {
    id: "datePickUp",
    title: "Date de livraison",
  },

  {
    id: "shopName",
    title: "Lieu de retrait",
  },
  {
    id: "createdAt",
    title: "Date de création",
  },
];
