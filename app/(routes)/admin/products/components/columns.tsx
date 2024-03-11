"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef, Row } from "@tanstack/react-table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowUpDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CellAction } from "./cell-action";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { changeArchived, changeFeatured } from "./server-action";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export type ProductColumn = {
  id: string;
  name: string;
  image: string;
  price: string;
  category: string;
  linkProducts: {
    id: string;
    name: string;
  }[];
  isFeatured: boolean;
  isArchived: boolean;
  createdAt: Date;
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Nom",
    cell: ({ row }) => (
      <Button asChild variant={"link"}>
        <Link
          href={`/admin/products/${row.original.id}`}
          className="flex  cursor-pointer items-center justify-start gap-2"
        >
          {row.original.image ? (
            <span className=" relative aspect-square h-[30px] rounded-sm bg-transparent">
              <Image
                src={row.original.image}
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
    accessorKey: "isArchived",
    header: "Archivé",
    cell: ({ row }) => <ArchivedCell row={row} />,
  },
  {
    accessorKey: "isFeatured",
    header: "Mise en avant",
    cell: ({ row }) => <FeaturedCell row={row} />,
  },
  {
    accessorKey: "price",
    header: "Prix",
  },
  {
    accessorKey: "category",
    header: "Categorie",
  },
  {
    accessorKey: "linkProducts",
    header: "Produits lieés",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.linkProducts.map((product) => {
          return <Badge key={product.id}>{product.name}</Badge>;
        })}
      </div>
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

function ArchivedCell({ row }: { row: Row<ProductColumn> }) {
  const [status, setStatus] = useState<boolean | "indeterminate">(
    row.original.isArchived,
  );
  return (
    <Checkbox
      className="self-center"
      checked={status}
      onCheckedChange={async (e) => {
        setStatus("indeterminate");
        const result = await changeArchived({
          id: row.original.id,
          isArchived: e,
        });
        if (!result.success) {
          toast.error(result.message);
          setStatus(!e);
        } else {
          toast.success("Statut mis à jour");
          setStatus(e);
        }
      }}
    />
  );
}

function FeaturedCell({ row }: { row: Row<ProductColumn> }) {
  const [status, setStatus] = useState<boolean | "indeterminate">(
    row.original.isFeatured,
  );
  return (
    <Checkbox
      className="self-center"
      checked={status}
      onCheckedChange={async (e) => {
        setStatus("indeterminate");
        const result = await changeFeatured({
          id: row.original.id,
          isFeatured: e,
        });
        if (!result.success) {
          toast.error(result.message);
          setStatus(!e);
        } else {
          toast.success("Statut mis à jour");
          setStatus(e);
        }
      }}
    />
  );
}
