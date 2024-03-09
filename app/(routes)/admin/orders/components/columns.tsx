"use client";

import { Button } from "@/components/ui/button";
import { addDelay, dateFormatter } from "@/lib/utils";
import { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { CellAction } from "./cell-action";
import { Checkbox } from "@/components/ui/checkbox";
import { changeStatus } from "./server-action";
import { toast } from "sonner";
import { useState } from "react";

export type OrderColumn = {
  id: string;
  userId: string;
  name: string;
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
    accessorKey: "name",
    header: "Nom",
    cell: ({ row }) => (
      <Button asChild variant={"link"} className="px-0">
        <Link href={`/admin/users/${row.original.userId}`}>
          {row.getValue("name")}
        </Link>
      </Button>
    ),
  },
  {
    accessorKey: "totalPrice",
    header: "Prix Total",
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
        {dateFormatter(row.getValue("createdAt"))}
      </div>
    ),
  },

  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
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
