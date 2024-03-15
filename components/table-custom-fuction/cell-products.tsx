"use client";

import { Row } from "@tanstack/react-table";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";
import { changeFeatured, changePro } from "./products-server-actions";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
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
          setStatus(e);
          router.refresh();
          toast.success("Statut mise à jour");
        }
      }}
    />
  );
}

type ProCellProps<T = {}> = T & {
  isPro: boolean;
  id: string;
};

function ProCell<T>({ row }: { row: Row<ProCellProps<T>> }) {
  const [status, setStatus] = useState<boolean | "indeterminate">(
    row.original.isPro,
  );
  const router = useRouter();

  return (
    <Checkbox
      className="self-center"
      checked={status}
      onCheckedChange={async (e) => {
        setStatus("indeterminate");
        const result = await changePro({
          id: row.original.id,
          isPro: e,
        });
        if (!result.success) {
          toast.error(result.message);
          setStatus(!e);
        } else {
          setStatus(e);
          router.refresh();
          toast.success("Statut mise à jour");
        }
      }}
    />
  );
}

export { FeaturedCell, LinkProductsCell, ProCell };
