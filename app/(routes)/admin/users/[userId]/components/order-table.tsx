"use client";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { OrderColumn, columns } from "./order-column";

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
      <DataTable searchKey="products" columns={columns} initialData={data} />
    </>
  );
};
