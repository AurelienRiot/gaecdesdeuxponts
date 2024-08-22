import { Button } from "@/components/ui/button";
import type { Column } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

type CreatedAtHeaderProps = {
  createdAt: Date;
};

function CreatedAtHeader<T>({
  column,
}: {
  column: Column<T & CreatedAtHeaderProps>;
}) {
  return (
    <Button
      variant="ghost"
      className="text-left px-0"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      Date de création
      <ArrowUpDown className="ml-2 h-4 w-4 flex-shrink-0" />
    </Button>
  );
}

export { CreatedAtHeader };
