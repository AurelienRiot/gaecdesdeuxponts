"use client";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "./data-table";
import { OrderColumnType, OrdersColumn } from "./order-column";
import { useRouter, useSearchParams } from "next/navigation";
// import useCart from "@/hooks/use-cart";
import { useEffect } from "react";

interface OrderTableProps {
  data: OrderColumnType[];
}

export const OrderTable: React.FC<OrderTableProps> = ({ data }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  // const removeAll = useCart((state) => state.removeAll);

  // useEffect(() => {
  //   if (searchParams.get("success-order")) {
  //     toast.success("Paiement réussi.");
  //     router.replace("/dashboard-user");
  //     removeAll();
  //   }
  // }, [searchParams, router, removeAll]);

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
