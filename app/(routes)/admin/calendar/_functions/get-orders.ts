"server only";
import type { ProductQuantities } from "@/components/google-events";
import type { Status } from "@/components/table-custom-fuction/cell-orders";
import prismadb from "@/lib/prismadb";
import type { Point } from "../../direction/_components/direction-schema";
import { getUnitLabel } from "@/components/product/product-function";
import { getUserName } from "@/components/table-custom-fuction";
import { createDatePickUp, createStatus } from "@/components/table-custom-fuction/cell-orders";
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

export function formatOrder(order: GetOrdersType[number]): CalendarOrdersType {
  return {
    id: order.id,
    userName: getUserName(order.user),
    userId: order.userId,
    userImage: order.user.image,
    index: order.index,
    // user: {
    //   name: order.user.name,
    //   email: order.user.email,
    //   company: order.user.company,
    //   completed: order.user.completed,
    //   image: order.user.image,
    //   phone: order.user.phone,
    //   address: addressFormatter(order.user.address, false),
    //   notes: order.user.notes,
    //   links: order.user.links,
    //   id: order.user.id,
    // },
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

export type CalendarOrdersType = {
  id: string;
  index: number | null;
  userName: string;
  userId: string;
  userImage?: string | null;
  // user: {
  //   id: string;
  //   name?: string | null;
  //   completed?: boolean;
  //   email?: string | null;
  //   phone?: string | null;
  //   company?: string | null;
  //   image?: string | null;
  //   address?: string | null;
  //   links: { label: string; value: string }[];
  //   notes: string | null;
  // };
  shippingDate: Date;
  totalPrice: string;
  status: Status;
  productsList: ProductQuantities[];
  shopName: string;
  address: Point;
  shopId?: string;
  createdAt: Date;
};
