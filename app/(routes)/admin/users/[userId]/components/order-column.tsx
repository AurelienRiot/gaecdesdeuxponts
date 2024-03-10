"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { dateFormatter } from "@/lib/utils";
import { ColumnDef, Row } from "@tanstack/react-table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowUpDown } from "lucide-react";
import { toast } from "sonner";
import { changeStatus } from "../../../orders/components/server-action";
import { OrderCellAction } from "./order-cell-action";
import { useOrderStatus } from "./order-table";
import dynamic from "next/dynamic";
import { DataInvoiceType } from "@/components/pdf/data-invoice";
const DisplayPDF = dynamic(() => import("@/components/pdf/displayPDF"), {
  ssr: false,
});

export type OrderColumn = {
  id: string;
  isPaid: boolean;
  datePickUp: Date;
  totalPrice: string;
  products: string;
  createdAt: Date;
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
    cell: ({ row }) => <FactureCell row={row} />,
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
  const { orderStatus, setOrderStatus } = useOrderStatus();

  return (
    <Checkbox
      className="self-center"
      checked={
        orderStatus[row.original.id] === undefined
          ? "indeterminate"
          : orderStatus[row.original.id]
      }
      onCheckedChange={async (e) => {
        setOrderStatus({
          ...orderStatus,
          [row.original.id]: "indeterminate",
        });
        const result = await changeStatus({ id: row.original.id, isPaid: e });
        if (!result.success) {
          toast.error(result.message);
          setOrderStatus({
            ...orderStatus,
            [row.original.id]: !e,
          });
        } else {
          toast.success("Statut mis à jour");
          setOrderStatus({
            ...orderStatus,
            [row.original.id]: e,
          });
        }
      }}
    />
  );
}

function FactureCell({ row }: { row: Row<OrderColumn> }) {
  const { orderStatus } = useOrderStatus();
  return (
    <>
      {!orderStatus[row.original.id] ||
      orderStatus[row.original.id] === "indeterminate" ? (
        "Non disponible"
      ) : (
        <DisplayPDF data={row.original.dataInvoice} />
      )}
    </>
  );
}
