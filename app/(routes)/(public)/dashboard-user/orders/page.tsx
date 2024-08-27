"use client";

import { DataTableSkeleton } from "@/components/skeleton-ui/data-table-skeleton";
import {
  createDatePickUp,
  createProduct,
  createProductList,
  createStatus,
} from "@/components/table-custom-fuction/cell-orders";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { useUserContext } from "@/context/user-context";
import { currencyFormatter } from "@/lib/utils";
import {
  OrdersColumn,
  filterableColumns,
  searchableColumns,
  viewOptionsColumns,
  type OrderColumnType,
} from "./_components/order-column";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import useServerAction from "@/hooks/use-server-action";
import sendCheckoutEmail from "./_actions/send-chekout-email";

const PageOrderTable = () => {
  const { user } = useUserContext();
  const { serverAction } = useServerAction(sendCheckoutEmail);

  const searchParams = useSearchParams();

  if (!user) {
    return (
      <div className="w-full space-y-4 p-6">
        <Heading title={`Commandes `} description="Résumé des commandes" />
        <Separator />
        <DataTableSkeleton columnCount={6} filterableColumnCount={2} searchableColumnCount={1} />
      </div>
    );
  }

  const formattedOrders: OrderColumnType[] = (user.orders || []).map((order) => ({
    id: order.id,
    productsList: createProductList(order.orderItems),
    products: createProduct(order.orderItems),
    totalPrice: currencyFormatter.format(order.totalPrice),
    status: createStatus(order),
    datePickUp: createDatePickUp({ dateOfShipping: order.dateOfShipping, datePickUp: order.datePickUp }),
    shopName: order.shop?.name || "Livraison à domicile",
    shop: order.shop || undefined,
    createdAt: order.createdAt,
  }));

  useEffect(() => {
    async function sendCheckoutEmail() {
      const orderId = searchParams.get("orderId");
      if (orderId) {
        const order = user?.orders.find((order) => order.id === searchParams.get("orderId"));
        if (order && !order.orderEmail) {
          await serverAction({ data: { orderId } });
        }
      }
    }

    sendCheckoutEmail();
  }, []);

  return (
    <>
      <div className="w-full space-y-4 p-6">
        <Heading title={`Commandes (${formattedOrders.length})`} description="Résumé des commandes" />
        <Separator />
        <DataTable
          data={formattedOrders}
          columns={OrdersColumn}
          searchableColumns={searchableColumns}
          filterableColumns={filterableColumns()}
          viewOptionsColumns={viewOptionsColumns}
        />
      </div>
    </>
  );
};

export default PageOrderTable;
