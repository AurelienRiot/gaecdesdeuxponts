import { dateFormatter } from "@/lib/utils";
import { Row } from "@tanstack/react-table";
import { Button } from "../ui/button";
import Link from "next/link";

type CreatedAtCellProps<T = {}> = T & {
  createdAt: Date;
};

function CreatedAtCell<T>({ row }: { row: Row<CreatedAtCellProps<T>> }) {
  return (
    <div className="flex md:pl-10">
      {dateFormatter(row.getValue("createdAt"))}
    </div>
  );
}

type NameCellProps<T = {}> = T & {
  name: string;
  userId: string;
};

function NameCell<T>({ row }: { row: Row<NameCellProps<T>> }) {
  return (
    <Button asChild variant={"link"} className="px-0">
      <Link href={`/admin/users/${row.original.userId}`}>
        {row.getValue("name")}
      </Link>
    </Button>
  );
}

export { CreatedAtCell, NameCell };
