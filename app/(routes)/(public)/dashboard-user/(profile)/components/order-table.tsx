"use client";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "./data-table";
import { OrderColumnType, OrdersColumn } from "./order-column";

interface OrderTableProps {
  data: OrderColumnType[];
}

export const OrderTable: React.FC<OrderTableProps> = ({ data }) => {
  return (
    <>
      <Heading
        title={`Commandes (${data.length})`}
        description="Résumé des commandes"
      />
      <Separator />
      <DataTable
        searchKey="products"
        columns={OrdersColumn}
        initialData={data}
      />
    </>
  );
};
