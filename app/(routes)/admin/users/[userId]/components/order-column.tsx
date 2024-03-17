"use client";

import { DataInvoiceType } from "@/components/pdf/data-invoice";
import {
  DatePickUpCell,
  FactureCell,
  ProductCell,
  ShopNameCell,
  StatusCell,
} from "@/components/table-custom-fuction/cell-orders";
import { DatePickUpHeader } from "@/components/table-custom-fuction/header-orders";
import { ColumnDef } from "@tanstack/react-table";
import { CreatedAtCell } from "@/components/table-custom-fuction/common-cell";
import { CreatedAtHeader } from "@/components/table-custom-fuction/common-header";
import { OrderCellAction } from "./order-cell-action";
import {
  DataTableFilterableColumn,
  DataTableSearchableColumn,
  DataTableViewOptionsColumn,
} from "@/types";
import { FilterInclude } from "@/components/table-custom-fuction/common-filter";

export type OrderColumn = {
  id: string;
  isPaid: boolean;
  datePickUp: Date;
  totalPrice: string;
  products: string;
  productsList: { name: string; quantity?: string }[];
  createdAt: Date;
  shopName: string;
  shopId: string;
  dataInvoice: DataInvoiceType;
};
export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "products",
    header: "Produits",
    cell: ProductCell,
  },
  {
    accessorKey: "totalPrice",
    header: "Prix total",
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
    cell: ({ row }) => <OrderCellAction data={row.original} />,
  },
];

export const filterableColumns: DataTableFilterableColumn<OrderColumn>[] = [
  {
    id: "isPaid",
    title: "Status",
    options: [
      { label: "Payé", value: "true" },
      { label: "Non Payé", value: "false" },
    ],
  },
];

export const searchableColumns: DataTableSearchableColumn<OrderColumn>[] = [
  {
    id: "products",
    title: "Produits",
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
