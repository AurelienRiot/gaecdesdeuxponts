import { Button } from "@/components/ui/button";
import { Column } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

type CreatedAtHeaderProps<T = {}> = T & {
  createdAt: Date;
};

function CreatedAtHeader<T>({
  column,
}: {
  column: Column<CreatedAtHeaderProps<T>>;
}) {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      Date de création
      <ArrowUpDown className="ml-2 h-4 w-4 flex-shrink-0" />
    </Button>
  );
}

export { CreatedAtHeader };
