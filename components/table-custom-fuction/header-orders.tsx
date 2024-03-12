"use client";

import { Column } from "@tanstack/react-table";
import { DataInvoiceType } from "../pdf/data-invoice";
import { Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";

type DatePickUpHeaderProps<T = {}> = T & {
  id: string;
  dataInvoice: DataInvoiceType;
};

function DatePickUpHeader<T>({
  column,
}: {
  column: Column<DatePickUpHeaderProps<T>>;
}) {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      Date de livraison
      <ArrowUpDown className="ml-2 h-4 w-4 flex-shrink-0" />
    </Button>
  );
}

export { DatePickUpHeader };
