"use client";

import { Row } from "@tanstack/react-table";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";
import { useState } from "react";
import { changeArchived, changeFeatured } from "./products-server-actions";
import { toast } from "sonner";
import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";

type LinkProductsCellProps<T = {}> = T & {
  linkProducts: {
    id: string;
    name: string;
  }[];
  id: string;
};

function LinkProductsCell<T>({ row }: { row: Row<LinkProductsCellProps<T>> }) {
  return (
    <div className="flex flex-wrap gap-1">
      {row.original.linkProducts.map((product) => {
        return <Badge key={product.id}>{product.name}</Badge>;
      })}
    </div>
  );
}

type FeaturedCellProps<T = {}> = T & {
  isFeatured: boolean;
  id: string;
};

function FeaturedCell<T>({ row }: { row: Row<FeaturedCellProps<T>> }) {
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
          toast.success("Statut mise à jour");
          setStatus(e);
        }
      }}
    />
  );
}

type NameWithImageCellProps<T = {}> = T & {
  imageUrl: string;
  id: string;
  name: string;
  type: "products" | "categories";
};

function NameWithImageCell<T>({
  row,
}: {
  row: Row<NameWithImageCellProps<T>>;
}) {
  return (
    <Button asChild variant={"link"}>
      <Link
        href={`/admin/${row.original.type}/${row.original.id}`}
        className="flex  cursor-pointer items-center justify-start gap-2"
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
  );
}

export { LinkProductsCell, FeaturedCell, NameWithImageCell };
