"use client";

import { DisplayInvoice } from "@/components/pdf/button/display-invoice";
import { PaymentMethodCell, type Status, StatusCell } from "@/components/table-custom-fuction/cell-orders";
import { NameCell } from "@/components/table-custom-fuction/common-cell";
import { Checkbox } from "@/components/ui/checkbox";
import type { DataTableSearchableColumn, DataTableViewOptionsColumn } from "@/types";
import type { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import type { PaymentMethod } from "@prisma/client";

export type InvoiceColumn = {
  id: string;
  name: string;
  image?: string | null;
  userId?: string;
  totalPrice: string;
  totalOrders: number;
  status: Status;
  paymentMethode: PaymentMethod | null;
  emailSend: boolean;
  date: string;
  createdAt: Date;
};

export const columns: ColumnDef<InvoiceColumn>[] = [
  {
    accessorKey: "id",
    header: "N° de facture",
  },
  {
    accessorKey: "name",
    header: "Nom",
    cell: ({ row }) => (
      <NameCell
        name={row.original.name}
        image={row.original.image}
        imageSize={16}
        url={row.original.userId ? `/admin/users/${row.original.userId}` : undefined}
      />
    ),
  },
  {
    accessorKey: "button",
    header: "Facture",
    cell: ({ row }) => <DisplayInvoice invoiceId={row.original.id} isSend={row.original.emailSend} />,
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <StatusCell status={row.original.status} />
        {row.original.paymentMethode && row.original.status === "Payé" && (
          <PaymentMethodCell paymentMethod={row.original.paymentMethode} />
        )}
      </div>
    ),
  },
  {
    accessorKey: "totalPrice",
    header: "Prix total",
    cell: ({ row }) => (
      <span className="font-bold lining-nums">
        {row.original.totalPrice} {`(${row.original.totalOrders} commande${row.original.totalOrders > 1 ? "s" : ""})`}
      </span>
    ),
  },
  {
    accessorKey: "emailSend",
    header: "Email envoyé",
    cell: ({ row }) => <Checkbox checked={row.original.emailSend} className="cursor-default" />,
  },

  {
    accessorKey: "date",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

export const searchableColumns: DataTableSearchableColumn<InvoiceColumn>[] = [
  {
    id: "id",
    title: "N° de facture",
  },
  {
    id: "name",
    title: "Nom",
  },
];

export const viewOptionsColumns: DataTableViewOptionsColumn<InvoiceColumn>[] = [
  {
    id: "id",
    title: "N° de facture",
  },
  {
    id: "name",
    title: "Nom",
  },
  {
    id: "button" as keyof InvoiceColumn,
    title: "Facture",
  },
  {
    id: "status",
    title: "Statut",
  },
  {
    id: "totalPrice",
    title: "Prix total",
  },
  {
    id: "emailSend",
    title: "Email envoyé",
  },
  {
    id: "createdAt",
    title: "Date de création",
  },
  { id: "actions" as keyof InvoiceColumn, title: "Actions" },
];
