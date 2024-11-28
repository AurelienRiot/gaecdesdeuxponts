"use client";

import { DisplayUserInvoice } from "@/components/pdf/button/display-user-invoice";
import { StatusCell, type Status } from "@/components/table-custom-fuction/cell-orders";
import type { ProfileUserType } from "@/hooks/use-query/user-query";
import type { ColumnDef } from "@tanstack/react-table";

export type InvoiceColumnType = {
  id: string;
  totalPrice: string;
  totalOrders: number;
  status: Status;
  date: string;
};
export const InvoiceColumn: ColumnDef<ProfileUserType["invoices"][number]>[] = [
  {
    accessorKey: "id",
    header: "N° de facture",
  },

  {
    accessorKey: "button",
    header: "Facture",
    cell: ({ row }) => <DisplayUserInvoice invoiceId={row.original.id} />,
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => <StatusCell status={row.original.status} />,
  },
  {
    accessorKey: "totalPrice",
    header: "Prix total (TTC)",
    cell: ({ row }) => (
      <span className="font-bold lining-nums">
        {row.original.totalPrice} {row.original.totalOrders > 1 ? `(${row.original.totalOrders} commandes)` : ""}
      </span>
    ),
  },
  {
    accessorKey: "date",
    header: "Date",
  },
];
