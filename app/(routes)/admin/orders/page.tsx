import { getUnitLabel } from "@/components/product/product-function";
import { getUserName } from "@/components/table-custom-fuction";
import { createDatePickUp, createProduct, createStatus } from "@/components/table-custom-fuction/cell-orders";
import prismadb from "@/lib/prismadb";
import { currencyFormatter } from "@/lib/utils";
import type { OrderItem } from "@prisma/client";
import { addYears } from "date-fns";
import type { DateRange } from "react-day-picker";
import { OrderClient } from "./_components/client";

export const dynamic = "force-dynamic";

const OrdersPage = async (context: {
  searchParams: { from: string | undefined; to: string | undefined; id: string | undefined };
}) => {
  const id = context.searchParams.id;

  let from: Date;
  let to: Date;
  if (context.searchParams.from && context.searchParams.to) {
    from = new Date(context.searchParams.from);
    to = new Date(context.searchParams.to);
  } else {
    from = new Date(new Date().getTime() - 14 * 24 * 60 * 60 * 1000);
    to = addYears(new Date(), 1);
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
    where: !id
      ? {
          OR: [
            {
              dateOfShipping: {
                gte: dateRange.from,
                lte: dateRange.to,
              },
            },
            {
              dateOfShipping: null,
            },
          ],
          deletedAt: null,
        }
      : {
          id: {
            contains: id,
          },
          deletedAt: null,
        },
    orderBy: [
      {
        dateOfShipping: { sort: "desc", nulls: "first" },
      },
      { datePickUp: "desc" },
    ],
  });

  function createProductList(items: OrderItem[]) {
    return items.map((item) => {
      const name = item.name;
      if (item.quantity !== 1) {
        return {
          name,
          price: item.price,
          quantity: `${item.quantity}`,
          unit: getUnitLabel(item.unit).quantity || undefined,
        };
      }
      return { name, price: item.price, quantity: "", unit: undefined };
    });
  }

  const formattedOrders = orders.map((order) => ({
    id: order.id,
    image: order.user.image,
    userId: order.userId,
    name: getUserName(order.user),
    shippingDate: createDatePickUp({ dateOfShipping: order.dateOfShipping, datePickUp: order.datePickUp }),
    productsList: createProductList(order.orderItems),
    products: createProduct(order.orderItems),
    status: createStatus(order),
    totalPrice: currencyFormatter.format(order.totalPrice),
    createdAt: order.createdAt,
    shopName: order.shop?.name || "Livraison à domicile",
    shopId: order.shop?.id || "",
  }));

  // const formattedOrders = orders.map((order) => ({
  //   id: order.id,
  //   image: order.user.image,
  //   shippingEmail: order.shippingEmail,
  //   invoiceEmail: order.invoiceEmail,
  //   name: order.user.company || order.user.name || order.user.email || "",
  //   userId: order.userId,
  //   isPaid: !!order.dateOfPayment,
  //   datePickUp: createDatePickUp({ dateOfShipping: order.dateOfShipping, datePickUp: order.datePickUp }),
  //   productsList: createProductList(order.orderItems),
  //   products: createProduct(order.orderItems),
  //   status: createStatus(order),
  //   totalPrice: currencyFormatter.format(order.totalPrice),
  //   createdAt: order.createdAt,
  //   shopName: order.shop?.name || "Livraison à domicile",
  //   shopId: order.shop?.id || "",
  // }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient initialData={formattedOrders} initialDateRange={dateRange} />
      </div>
    </div>
  );
};

export default OrdersPage;
