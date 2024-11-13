"server only";
import { getUnitLabel } from "@/components/product/product-function";
import { getUserName } from "@/components/table-custom-fuction";
import { createDatePickUp, createStatus } from "@/components/table-custom-fuction/cell-orders";
import type { CalendarOrderType } from "@/components/zod-schema/calendar-orders";
import prismadb from "@/lib/prismadb";
import { addressFormatter, currencyFormatter } from "@/lib/utils";

export const getOrdersByDate = async ({ from, to }: { from: Date; to: Date }) => {
  const orders = await getOrders({ from, to });
  const formattedOrders = orders.map((order) => formatOrder(order));

  return { success: true, data: formattedOrders, message: "Commandes trouvées" };
};

export type GetOrdersType = Awaited<ReturnType<typeof getOrders>>;
async function getOrders({ from, to }: { from: Date; to: Date }) {
  return await prismadb.order.findMany({
    where: {
      dateOfShipping: {
        gte: from,
        lt: to,
      },
      deletedAt: null,
    },
    include: {
      orderItems: true,
      shop: true,
      user: { select: { email: true, name: true, company: true, address: true, image: true } },
      invoiceOrder: {
        select: { invoice: { select: { id: true, invoiceEmail: true, dateOfPayment: true } } },
        orderBy: { createdAt: "desc" },
        where: { invoice: { deletedAt: null } },
      },
    },
  });
}

export function formatOrder(order: GetOrdersType[number]): CalendarOrderType {
  return {
    id: order.id,
    userName: getUserName(order.user),
    userId: order.userId,
    userImage: order.user.image,
    index: order.index,
    shippingDate: createDatePickUp({ dateOfShipping: order.dateOfShipping, datePickUp: order.datePickUp }),
    productsList: order.orderItems.map((item) => ({
      itemId: item.itemId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      unit: getUnitLabel(item.unit).quantity,
    })),
    address: {
      label: order.shop ? order.shop.address : addressFormatter(order.user.address, false),
      longitude: order.shop ? order.shop.long : order.user.address?.longitude,
      latitude: order.shop ? order.shop.lat : order.user.address?.latitude,
    },
    status: createStatus(order),
    totalPrice: currencyFormatter.format(order.totalPrice),
    createdAt: order.createdAt,
    shopName: order.shop?.name || "Livraison à domicile",
    shopId: order.shop?.id,
  };
}
