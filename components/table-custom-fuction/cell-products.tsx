"use client";

import type { Row } from "@tanstack/react-table";
import { Badge } from "../ui/badge";

type LinkProductsCellProps =  {
  linkProducts: {
    id: string;
    name: string;
  }[];
  id: string;
};

function LinkProductsCell<T>({ row }: { row: Row<T & LinkProductsCellProps> }) {
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
