"use client";

import { DataTable } from "@/components/ui/data-table/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import {
  OrderColumnType,
  OrdersColumn,
  viewOptionsColumns,
  filterableColumns,
  searchableColumns,
} from "./order-column";

interface OrderTableProps {
  data: OrderColumnType[];
}

export const OrderTable: React.FC<OrderTableProps> = ({ data }) => {
  return (
    <div className="space-y-4 px-4">
      <Heading
        title={`Commandes (${data.length})`}
        description="Résumé des commandes"
      />
      <Separator />
      <DataTable
        data={data}
        columns={OrdersColumn}
        filterableColumns={filterableColumns}
        searchableColumns={searchableColumns}
        viewOptionsColumns={viewOptionsColumns}
      />
    </div>
  );
};
