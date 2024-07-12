"use client";

import type { Column } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "../ui/button";

type DatePickUpHeaderProps = {
  datePickUp: Date;
};

function DatePickUpHeader<T>({
  column,
}: {
  column: Column<T & DatePickUpHeaderProps>;
}) {
  return (
    <Button
      className="text-left px-0"
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      Date de retrait/
      <br />
      livraison
      <ArrowUpDown className="ml-2 h-4 w-4 flex-shrink-0" />
    </Button>
  );
}

type ShopNameHeaderProps = {
  shopName: string;
};

function ShopNameHeader<T>({
  column,
}: {
  column: Column<T & ShopNameHeaderProps>;
}) {
  return (
    <p>
      Lieu de retrait/
      <br />
      livraison
    </p>
  );
}
export { DatePickUpHeader, ShopNameHeader };
