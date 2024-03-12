"use client";

import { DataInvoiceType } from "@/components/pdf/data-invoice";
import {
  DatePickUpCell,
  FactureCell,
  ShopNameCell,
  StatusCell,
} from "@/components/table-custom-fuction/cell-orders";
import { DatePickUpHeader } from "@/components/table-custom-fuction/header-orders";
import { ColumnDef } from "@tanstack/react-table";
import { CreatedAtCell } from "@/components/table-custom-fuction/common-cell";
import { CreatedAtHeader } from "@/components/table-custom-fuction/common-header";
import { OrderCellAction } from "./order-cell-action";

export type OrderColumn = {
  id: string;
  isPaid: boolean;
  datePickUp: Date;
  totalPrice: string;
  products: string;
  createdAt: Date;
  shopName: string;
  shopId: string;
  dataInvoice: DataInvoiceType;
};
export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "products",
    header: "Produits",
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
