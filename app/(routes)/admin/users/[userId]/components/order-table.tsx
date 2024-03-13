"use client";

import { DataTable } from "@/components/ui/data-table/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import {
  OrderColumn,
  columns,
  filterableColumns,
  searchableColumns,
  viewOptionsColumns,
} from "./order-column";

interface OrderTableProps {
  data: OrderColumn[];
}

export const OrderTable: React.FC<OrderTableProps> = ({ data }) => {
  return (
    <>
      <Heading
        title={`Commandes (${data.length})`}
        description="Gérez les commandes"
      />
      <Separator />
      <DataTable
        filterableColumns={filterableColumns}
        searchableColumns={searchableColumns}
        viewOptionsColumns={viewOptionsColumns}
        columns={columns}
        data={data}
      />
    </>
  );
};
