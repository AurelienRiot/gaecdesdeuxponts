"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { fr } from "date-fns/locale";
import { format } from "date-fns";
import Link from "next/link";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { formatPhoneNumber } from "react-phone-number-input";

export type ContactColumn = {
  id: string;
  name: string;
  userId: string | null;
  phone?: string;
  email: string;
  subject: string;
  message: string;
  createdAt: Date;
};

export const columns: ColumnDef<ContactColumn>[] = [
  {
    accessorKey: "name",
    header: "Nom",
    cell: ({ row }) => (
      <div className="flex capitalize md:pl-10 ">
        <Button asChild variant={"link"}>
          {row.original.userId ? (
            <Link href={`/admin/users/${row.original.userId}`}>
              {row.getValue("name")}
            </Link>
          ) : (
            <span>{row.getValue("name")}</span>
          )}
        </Button>
      </div>
    ),
  },
  {
    accessorKey: "phone",
    header: "Téléphone",
    cell: ({ row }) =>
      row.getValue("phone") ? (
        <span>{formatPhoneNumber(row.getValue("phone"))}</span>
      ) : (
        <span>Non renseigné</span>
      ),
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "subject",
    header: "Sujet",
  },
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => (
      <AutosizeTextarea
        className="flex resize-none items-center justify-center border-none bg-transparent p-0 text-sm outline-none focus-visible:ring-0 disabled:cursor-default disabled:opacity-100"
        placeholder="..."
        value={row.original.message}
        disabled
      />
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
