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
import { useUserContext } from "@/context/user-context";
import { currencyFormatter, dateFormatter } from "@/lib/utils";
import NoResults from "@/components/ui/no-results";
import { DataTableSkeleton } from "@/components/skeleton-ui/data-table-skeleton";

export const OrderTable = () => {
  const { user } = useUserContext();

  if (!user) {
    return (
      <div className="space-y-4 px-4">
        <Heading title={`Commandes `} description="Résumé des commandes" />
        <Separator />
        <DataTableSkeleton
          columnCount={6}
          filterableColumnCount={2}
          searchableColumnCount={1}
        />
      </div>
    );
  }

  const formattedOrders: OrderColumnType[] = (user.orders || []).map(
    (order) => ({
      id: order.id,

      productsList: order.orderItems.map((item) => {
        let name = item.name;
        if (Number(item.quantity) > 1) {
          const quantity = ` x${item.quantity}`;
          return { name, quantity: quantity };
        }
        return { name, quantity: "" };
      }),
      products: order.orderItems
        .map((item) => {
          let name = item.name;
          if (Number(item.quantity) > 1) {
            name += ` x${item.quantity}`;
          }
          return name;
        })
        .join(", "),
      totalPrice: currencyFormatter.format(Number(order.totalPrice)),
      isPaid: order.isPaid,
      datePickUp: order.datePickUp,
      shopName: order.shop.name,
      shop: order.shop,
      createdAt: order.createdAt,
      dataInvoice: {
        customer: {
          id: user.id || "",
          name: user.name || "",
          address: (() => {
            const a =
              user?.address[0] && user?.address[0].line1
                ? `${user?.address[0].line1} ${user?.address[0].postalCode} ${user?.address[0].city}`
                : "";
            return a;
          })(),
          phone: user.phone || "",
          email: user.email || "",
        },
        order: {
          id: order.id,
          dateOfPayment: dateFormatter(order.datePickUp),
          dateOfEdition: dateFormatter(new Date()),
          items: order.orderItems.map((item) => ({
            desc: item.name,
            qty: item.quantity,
            priceTTC: item.price,
          })),
          total: order.totalPrice,
        },
      },
    }),
  );

  if (formattedOrders.length === 0) {
    return <NoResults />;
  }

  return (
    <div className="space-y-4 px-4">
      <Heading
        title={`Commandes (${formattedOrders.length})`}
        description="Résumé des commandes"
      />
      <Separator />
      <DataTable
        data={formattedOrders}
        columns={OrdersColumn}
        filterableColumns={filterableColumns}
        searchableColumns={searchableColumns}
        viewOptionsColumns={viewOptionsColumns}
      />
    </div>
  );
};
