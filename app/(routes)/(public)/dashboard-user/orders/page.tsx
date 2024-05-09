"use client";

import { DataTableSkeleton } from "@/components/skeleton-ui/data-table-skeleton";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { useUserContext } from "@/context/user-context";
import {
  addressFormatter,
  currencyFormatter,
  dateFormatter,
} from "@/lib/utils";
import {
  OrderColumnType,
  OrdersColumn,
  filterableColumns,
  searchableColumns,
  viewOptionsColumns,
} from "./_components/order-column";

const PageOrderTable = () => {
  const { user } = useUserContext();

  if (!user) {
    return (
      <div className="w-full space-y-4 p-6">
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
      shopName: order.shop?.name || "Livraison à domicile",
      shop: order.shop || undefined,
      createdAt: order.createdAt,
      dataInvoice: {
        customer: {
          id: user.id || "",
          name: user.name ? user.name + " - " + user.company : "",
          address: (() => {
            const a =
              user?.address[0] && user?.address[0].line1
                ? addressFormatter(user.address[0])
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

  return (
    <div className="w-full space-y-4 p-6">
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

export default PageOrderTable;
