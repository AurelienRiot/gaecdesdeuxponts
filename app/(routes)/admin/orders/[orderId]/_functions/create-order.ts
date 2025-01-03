"server only";

import { createCustomer } from "@/components/pdf/pdf-data";
import { createId } from "@/lib/id";
import prismadb from "@/lib/prismadb";
import { revalidateOrders } from "@/lib/revalidate-path";
import { formatOrder } from "../../../calendar/_functions/get-orders";
import type { OrderFormValues } from "../_components/order-schema";
import getOrdersIndex from "./get-orders-index";

async function createOrderAction({
  datePickUp,
  orderItems,
  totalPrice,
  userId,
  dateOfShipping,
  dateOfEdition,
  shopId,
}: OrderFormValues) {
  const index = await getOrdersIndex(userId, dateOfShipping);

  const order = await prismadb.order.create({
    data: {
      id: createId("order", dateOfShipping),
      totalPrice,
      userId,
      dateOfShipping,
      dateOfEdition,
      datePickUp,
      shopId,
      index,
      orderItems: {
        create: orderItems.map(
          ({ categoryName, description, itemId, name, price, quantity, unit, tax, stocks, icon }) => {
            return {
              itemId,
              price,
              stocks,
              quantity,
              unit,
              icon,
              name,
              tax,
              categoryName,
              description,
            };
          },
        ),
      },
    },
    include: {
      orderItems: true,
      shop: true,
      user: { include: { address: true, billingAddress: true } },
      invoiceOrder: {
        select: { invoice: { select: { id: true, invoiceEmail: true, dateOfPayment: true } } },
        orderBy: { createdAt: "desc" },
        where: { invoice: { deletedAt: null } },
      },
    },
  });

  const customer = createCustomer(order.user);
  await prismadb.shippingCustomer.create({
    data: {
      orderId: order.id,
      ...customer,
    },
  });

  revalidateOrders();
  return {
    success: true,
    message: "Commande crée",
    data: formatOrder(order),
  };
}

export default createOrderAction;
