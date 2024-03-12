"use client";

import { DataInvoiceType } from "@/components/pdf/data-invoice";
import {
  DatePickUpCell,
  FactureCell,
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

export type OrderColumn = {
  id: string;
  userId: string;
  name: string;
  isPaid: boolean;
  datePickUp: Date;
  totalPrice: string;
  products: string;
  shopName: string;
  shopId: string;
  createdAt: Date;
  dataInvoice: DataInvoiceType;
};

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "products",
    header: "Produits",
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
