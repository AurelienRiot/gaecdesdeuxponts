"use client";
import { useOrderStatusContext } from "@/hooks/use-order-status";
import { dateFormatter } from "@/lib/utils";
import { Row } from "@tanstack/react-table";
import dynamic from "next/dynamic";
import Link from "next/link";
import { toast } from "sonner";
import { DataInvoiceType } from "../pdf/data-invoice";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { changeStatus } from "./orders-server-actions";
const DisplayPDF = dynamic(() => import("@/components/pdf/pdf-button"), {
  ssr: false,
});

type StatusCellProps<T = {}> = T & {
  id: string;
  isPaid: boolean;
};

function StatusCell<T>({ row }: { row: Row<StatusCellProps<T>> }) {
  const { orderStatus, setOrderStatus } = useOrderStatusContext();
  return (
    <div className="justify-left flex items-center">
      <Checkbox
        checked={orderStatus[row.original.id]}
        disabled={orderStatus[row.original.id] === "indeterminate"}
        onCheckedChange={(e) => {
          setOrderStatus({
            ...orderStatus,
            [row.original.id]: "indeterminate",
          });

          changeStatus({ id: row.original.id, isPaid: e }).then((result) => {
            if (!result.success) {
              toast.error(result.message);
              setOrderStatus({
                ...orderStatus,
                [row.original.id]: !e,
              });
            } else {
              toast.success("Statut mise à jour");
              setOrderStatus({
                ...orderStatus,
                [row.original.id]: e,
              });
            }
          });
        }}
      />
    </div>
  );
}

type FactureCellProps<T = {}> = T & {
  id: string;
  dataInvoice: DataInvoiceType;
};

function FactureCell<T>({ row }: { row: Row<FactureCellProps<T>> }) {
  const { orderStatus } = useOrderStatusContext();
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

type DatePickUpCellProps<T = {}> = T & {
  datePickUp: Date;
};

function DatePickUpCell<T>({ row }: { row: Row<DatePickUpCellProps<T>> }) {
  return (
    <div className="flex md:pl-10">
      {" "}
      {dateFormatter(row.getValue("datePickUp"))}
    </div>
  );
}

type ShopNameCellProps<T = {}> = T & {
  id: string;
  shopId: string;
  shopName: string;
};

function ShopNameCell<T>({ row }: { row: Row<ShopNameCellProps<T>> }) {
  return (
    <Button asChild variant={"link"} className="px-0">
      <Link href={`/admin/shops/${row.original.shopId}`}>
        {row.getValue("shopName")}
      </Link>
    </Button>
  );
}

export { DatePickUpCell, FactureCell, ShopNameCell, StatusCell };
