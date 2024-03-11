import prismadb from "@/lib/prismadb";
import { currencyFormatter, dateFormatter } from "@/lib/utils";
import { OrderClient } from "./components/client";
import { OrderColumn } from "./components/columns";

const OrdersPage = async () => {
  const orders = await prismadb.order.findMany({
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
      shop: { select: { name: true, id: true } },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // fetch all the user that have an order in the database

  const users = await prismadb.user.findMany({
    select: {
      id: true,
      name: true,
      address: true,
      phone: true,
      email: true,
    },
    where: {
      id: {
        in: orders.map((order) => order.userId),
      },
    },
  });

  const formattedOrders: OrderColumn[] = orders.map((order) => ({
    id: order.id,
    userId: order.userId,
    isPaid: order.isPaid,
    datePickUp: order.datePickUp,
    name: order.name,
    products: order.orderItems
      .map((item) => {
        let name = item.product.name;
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
        id: users.find((user) => user.id === order.userId)?.id || "",
        name: users.find((user) => user.id === order.userId)?.name || "",
        address: (() => {
          const u = users.find((user) => user.id === order.userId);
          const a =
            u?.address[0] && u.address[0].line1
              ? `${u.address[0].line1} ${u.address[0].postalCode} ${u.address[0].city}`
              : "";

          return a;
        })(),
        phone: users.find((user) => user.id === order.userId)?.phone || "",
        email: users.find((user) => user.id === order.userId)?.email || "",
      },

      order: {
        id: order.id,
        dateOfPayment: dateFormatter(order.datePickUp),
        dateOfEdition: dateFormatter(new Date()),
        items: order.orderItems.map((item) => ({
          desc: item.product.name,
          qty: item.quantity,
          priceTTC: item.price,
        })),
        total: order.totalPrice,
      },
    },
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  );
};

export default OrdersPage;
