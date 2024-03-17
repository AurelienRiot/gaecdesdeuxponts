import prismadb from "@/lib/prismadb";
import { DateRange } from "react-day-picker";
import { OrderClient } from "./components/client";
import { formatOrders } from "./components/format-orders";

export const dynamic = "force-dynamic";

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

  const formattedOrders = formatOrders(orders);

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient
          initialData={formattedOrders}
          initialDateRange={dateRange}
        />
      </div>
    </div>
  );
};

export default OrdersPage;
