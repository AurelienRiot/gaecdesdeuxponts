import prismadb from "@/lib/prismadb";
import { currencyFormatter, dateFormatter } from "@/lib/utils";
import { OrderClient } from "./components/client";
import { OrderColumn } from "./components/columns";
import { DateRange } from "react-day-picker";
import { OrderStatusProvider } from "@/hooks/use-order-status";

const OrdersPage = async () => {
  const from = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000);
  const to = new Date();

  const dateRange: DateRange = {
    from: from,
    to: to,
  };

  const orders = await prismadb.order.findMany({
    include: {
      orderItems: true,
      shop: { select: { name: true, id: true } },
      user: {
        select: {
          id: true,
          name: true,
          address: true,
          phone: true,
          email: true,
        },
      },
    },
    where: {
      createdAt: {
        gte: dateRange.from,
        lte: dateRange.to,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedOrders: OrderColumn[] = orders.map((order) => ({
    id: order.id,
    userId: order.userId,
    isPaid: order.isPaid,
    datePickUp: order.datePickUp,
    name: order.name,
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
    totalPrice: currencyFormatter.format(order.totalPrice),
    createdAt: order.createdAt,
    shopName: order.shop.name,
    shopId: order.shop.id,
    dataInvoice: {
      customer: {
        id: order.user.id || "",
        name: order.user.name || "",
        address: (() => {
          const u = order.user;
          const a =
            order.user.address[0] && u.address[0].line1
              ? `${u.address[0].line1} ${u.address[0].postalCode} ${u.address[0].city}`
              : "";

          return a;
        })(),
        phone: order.user.phone || "",
        email: order.user.email || "",
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
  }));

  return (
    <OrderStatusProvider initialData={formattedOrders}>
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <OrderClient
            initialData={formattedOrders}
            initialDateRange={dateRange}
          />
        </div>
      </div>
    </OrderStatusProvider>
  );
};

export default OrdersPage;
