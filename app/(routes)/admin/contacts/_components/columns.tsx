"use client";

import {
  DateCell,
  NameCell,
  PhoneCell,
  TextCell,
} from "@/components/table-custom-fuction/common-cell";
import { CreatedAtHeader } from "@/components/table-custom-fuction/common-header";
import { DataTableSearchableColumn, DataTableViewOptionsColumn } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type ContactColumn = {
  id: string;
  name: string;
  userId: string | null;
  phone: string;
  email: string;
  subject: string;
  text: string;
  createdAt: Date;
};

export const columns: ColumnDef<ContactColumn>[] = [
  {
    accessorKey: "name",
    header: "Nom",
    cell: ({ row }) => (
      <NameCell
        name={row.original.name}
        url={
          row.original.userId
            ? `/admin/users/${row.original.userId}`
            : undefined
        }
      />
    ),
  },
  {
    accessorKey: "phone",
    header: "Téléphone",
    cell: PhoneCell,
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "subject",
    header: "Sujet",
    cell: ({ row }) => (
      <p
        className={
          row.original.subject === "RAPPORT DE BUG"
            ? "font-bold text-destructive"
            : ""
        }
      >
        {row.original.subject}
      </p>
    ),
  },
  {
    accessorKey: "text",
    header: "Message",
    cell: TextCell,
  },
  {
    accessorKey: "createdAt",
    header: CreatedAtHeader,
    cell: ({ row }) => <DateCell date={row.original.createdAt} />,
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

export const searchableColumns: DataTableSearchableColumn<ContactColumn>[] = [
  {
    id: "name",
    title: "Nom",
  },
  {
    id: "phone",
    title: "Téléphone",
  },
  {
    id: "email",
    title: "Email",
  },
  {
    id: "subject",
    title: "Sujet",
  },
  {
    id: "text",
    title: "Message",
  },
];

export const viewOptionsColumns: DataTableViewOptionsColumn<ContactColumn>[] = [
  {
    id: "name",
    title: "Nom",
  },

  {
    id: "phone",
    title: "Téléphone",
  },

  {
    id: "email",
    title: "Email",
  },
  {
    id: "subject",
    title: "Sujet",
  },
  {
    id: "text",
    title: "Message",
  },

  {
    id: "createdAt",
    title: "Date de création",
  },
  {
    id: "actions" as keyof ContactColumn,
    title: "Actions",
  },
];
