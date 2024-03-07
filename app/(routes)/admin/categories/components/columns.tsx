"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { fr } from "date-fns/locale";
import { format } from "date-fns";
import Link from "next/link";
import Image from "next/image";

export type CategoryColumn = {
  id: string;
  name: string;
  imageUrl: string;
  createdAt: Date;
};

export const columns: ColumnDef<CategoryColumn>[] = [
  {
    accessorKey: "name",
    header: "Nom",
    cell: ({ row }) => (
      <Button asChild variant={"link"}>
        <Link
          href={`/admin/categories/${row.original.id}`}
          className="flex items-center justify-start gap-2"
        >
          {row.original.imageUrl ? (
            <span className=" relative aspect-square h-[30px] rounded-sm bg-transparent">
              <Image
                src={row.original.imageUrl}
                alt=""
                fill
                sizes="(max-width: 768px) 30px, (max-width: 1200px) 30px, 30px"
                className="rounded-sm object-cover"
              />
            </span>
          ) : null}
          <span>{row.getValue("name")}</span>
        </Link>
      </Button>
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
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
