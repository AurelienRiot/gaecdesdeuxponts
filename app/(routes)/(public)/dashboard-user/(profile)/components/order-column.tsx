"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { dateFormatter } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import dynamic from "next/dynamic";
const DisplayPDF = dynamic(() => import("@/components/pdf/displayPDF"), {
  ssr: false,
});

export type OrderColumnType = {
  id: string;
  isPaid: boolean;
  datePickUp: Date;
  totalPrice: string;
  products: string;
  createdAt: Date;
};
export const OrdersColumn: ColumnDef<OrderColumnType>[] = [
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
    cell: ({ row }) => (
      <>{!row.original.isPaid ? "Non disponible" : <DisplayPDF />}</>
    ),
  },
  {
    accessorKey: "isPaid",
    header: "Payé",
    cell: ({ row }) => (
      <Checkbox className="self-center" checked={row.original.isPaid} />
    ),
  },
  {
    accessorKey: "datePickUp",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date de retrait
          <ArrowUpDown className="ml-2 h-4 w-4 flex-shrink-0" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="flex md:pl-10">
        {" "}
        {dateFormatter(row.getValue("datePickUp"))}
      </div>
    ),
  },
];
