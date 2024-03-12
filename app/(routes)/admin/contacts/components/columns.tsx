"use client";

import {
  CreatedAtCell,
  NameCell,
  PhoneCell,
  TextCell,
} from "@/components/table-custom-fuction/common-cell";
import { CreatedAtHeader } from "@/components/table-custom-fuction/common-header";
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
    cell: NameCell,
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
  },
  {
    accessorKey: "message",
    header: "Message",
    cell: TextCell,
  },
  {
    accessorKey: "createdAt",
    header: CreatedAtHeader,
    cell: CreatedAtCell,
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
