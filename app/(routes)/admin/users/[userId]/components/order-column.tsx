"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { dateFormatter } from "@/lib/utils";
import { ColumnDef, Row } from "@tanstack/react-table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowUpDown } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { changeStatus } from "../../../orders/components/server-action";
import { OrderCellAction } from "./order-cell-action";

export type OrderColumn = {
  id: string;
  isPaid: boolean;
  datePickUp: Date;
  totalPrice: string;
  products: string;
  createdAt: Date;
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
    cell: ({ row }) => (row.getValue("isPaid") ? "Payé" : "Non disponible"),
  },
  {
    accessorKey: "isPaid",
    header: "Statut",
    cell: ({ row }) => <StatusCell row={row} />,
  },
  {
    accessorKey: "datePickUp",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date de livraison
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
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date de création
          <ArrowUpDown className="ml-2 h-4 w-4 flex-shrink-0" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="flex md:pl-10">
        {" "}
        {format(row.getValue("createdAt"), "d MMMM yyyy", { locale: fr })}
      </div>
    ),
  },

  {
    id: "actions",
    cell: ({ row }) => <OrderCellAction data={row.original} />,
  },
];

function StatusCell({ row }: { row: Row<OrderColumn> }) {
  const [statut, setStatut] = useState<boolean | "indeterminate">(
    row.getValue("isPaid"),
  );
  return (
    <Checkbox
      className="self-center"
      checked={statut}
      onCheckedChange={async (e) => {
        setStatut(() => "indeterminate");
        const result = await changeStatus({ id: row.original.id, isPaid: e });
        if (!result.success) {
          toast.error(result.message);
          setStatut(() => !e);
        } else {
          toast.success("Statut mis à jour");
          setStatut(() => e);
        }
      }}
    />
  );
}
