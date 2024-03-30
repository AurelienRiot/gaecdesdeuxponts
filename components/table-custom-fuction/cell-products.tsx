"use client";

import { Row } from "@tanstack/react-table";
import { Badge } from "../ui/badge";

type LinkProductsCellProps<T = {}> = T & {
  linkProducts: {
    id: string;
    name: string;
  }[];
  id: string;
};

function LinkProductsCell<T>({ row }: { row: Row<LinkProductsCellProps<T>> }) {
  return (
    <div className="flex flex-wrap gap-1 ">
      {row.original.linkProducts.map((product) => {
        return (
          <Badge variant={"orange"} key={product.id}>
            {product.name}
          </Badge>
        );
      })}
    </div>
  );
}

export { LinkProductsCell };
