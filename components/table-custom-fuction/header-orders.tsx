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
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      Date de retrait
      <ArrowUpDown className="ml-2 h-4 w-4 flex-shrink-0" />
    </Button>
  );
}

export { DatePickUpHeader };
