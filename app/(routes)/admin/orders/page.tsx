import { createProduct, createProductList, createStatus } from "@/components/table-custom-fuction/cell-orders";
import prismadb from "@/lib/prismadb";
import { currencyFormatter } from "@/lib/utils";
import type { DateRange } from "react-day-picker";
import { OrderClient } from "./_components/client";

export const dynamic = "force-dynamic";

const OrdersPage = async (context: {
  searchParams: { from: string | undefined; to: string | undefined };
}) => {
  let from: Date;
  let to: Date;
  if (context.searchParams.from && context.searchParams.to) {
    from = new Date(context.searchParams.from);
    to = new Date(context.searchParams.to);
  } else {
    from = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000);
    to = new Date();
  }

  const dateRange: DateRange = {
    from: from,
    to: to,
  };

  const orders = await prismadb.order.findMany({
    include: {
      orderItems: true,
      shop: true,
      user: { include: { address: true, billingAddress: true } },
      customer: true,
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

  const formattedOrders = orders.map((order) => ({
    id: order.id,
    name: order.user.company || order.user.name || order.user.email || "",
    userId: order.userId,
    isPaid: !!order.dateOfPayment,
    datePickUp: order.datePickUp,
    productsList: createProductList(order),
    products: createProduct(order),
    status: createStatus(order),
    totalPrice: currencyFormatter.format(order.totalPrice),
    createdAt: order.createdAt,
    shopName: order.shop?.name || "Livraison à domicile",
    shopId: order.shop?.id || "",
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient initialData={formattedOrders} initialDateRange={dateRange} />
      </div>
    </div>
  );
};

export default OrdersPage;
