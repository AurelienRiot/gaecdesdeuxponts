"use client";

import { DataTable } from "@/components/ui/data-table/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import {
  type  OrderColumn,
  columns,
  filterableColumns,
  viewOptionsColumns,
} from "./order-column";

interface OrderTableProps {
  data: OrderColumn[];
}

export const OrderTable: React.FC<OrderTableProps> = ({ data }) => {
  const products = data.flatMap((product) =>
    product.productsList.map((p) => p.name),
  );
  const categoriesWithoutDuplicates = [
    ...new Set(products.map((product) => product)),
  ].sort((a, b) => a.localeCompare(b));

  const shopsName = data.map((order) => order.shopName);
  const shopsNameWithoutDuplicates = [
    ...new Set(shopsName.map((product) => product)),
  ].sort((a, b) => a.localeCompare(b));
  return (
    <>
      <Heading
        title={`Commandes (${data.length})`}
        description="Gérez les commandes"
      />
      <Separator className="my-4" />
      <DataTable
        filterableColumns={filterableColumns({
          products: categoriesWithoutDuplicates,
          shopsName: shopsNameWithoutDuplicates,
        })}
        viewOptionsColumns={viewOptionsColumns}
        columns={columns}
        data={data}
        emptyRows
      />
    </>
  );
};
