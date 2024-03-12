"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { fr } from "date-fns/locale";
import { format } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import { NameWithImageCell } from "@/components/table-custom-fuction/cell-products";
import { CreatedAtHeader } from "@/components/table-custom-fuction/common-header";
import { CreatedAtCell } from "@/components/table-custom-fuction/common-cell";

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
    cell: NameWithImageCell,
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
