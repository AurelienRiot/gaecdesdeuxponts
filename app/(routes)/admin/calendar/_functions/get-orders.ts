"server only";
import { getUnitLabel } from "@/components/product/product-function";
import { getUserName } from "@/components/table-custom-fuction";
import { type Status, createDatePickUp, createStatus } from "@/components/table-custom-fuction/cell-orders";
import prismadb from "@/lib/prismadb";
import { addressFormatter, currencyFormatter } from "@/lib/utils";
import type { Point } from "../../direction/_components/direction-schema";
import type { ProductQuantities } from "@/components/google-events";

export const getOrdersByDate = async ({ from, to }: { from: Date; to: Date }) => {
  const orders = await prismadb.order.findMany({
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
      user: { include: { address: true, billingAddress: true, links: true } },
      invoiceOrder: {
        select: { invoice: { select: { id: true, invoiceEmail: true, dateOfPayment: true } } },
        orderBy: { createdAt: "desc" },
        where: { invoice: { deletedAt: null } },
      },
    },
  });
  const formattedOrders: CalendarOrdersType[] = orders
    .map((order) => ({
      id: order.id,
      name: getUserName(order.user),
      index: order.index,
      user: {
        name: order.user.name,
        email: order.user.email,
        company: order.user.company,
        completed: order.user.completed,
        image: order.user.image,
        phone: order.user.phone,
        address: addressFormatter(order.user.address, false),
        notes: order.user.notes,
        links: order.user.links,
        id: order.user.id,
      },
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
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
  return { success: true, data: formattedOrders, message: "Commandes trouvées" };
};

export type CalendarOrdersType = {
  id: string;
  name: string;
  index: number | null;
  user: {
    id: string;
    name?: string | null;
    completed?: boolean;
    email?: string | null;
    phone?: string | null;
    company?: string | null;
    image?: string | null;
    address?: string | null;
    links: { label: string; value: string }[];
    notes: string | null;
  };
  shippingDate: Date;
  totalPrice: string;
  status: Status;
  productsList: ProductQuantities[];
  shopName: string;
  address: Point;
  shopId?: string;
  createdAt: Date;
};
