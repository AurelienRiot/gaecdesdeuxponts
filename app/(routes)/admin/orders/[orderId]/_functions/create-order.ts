"server only";

import prismadb from "@/lib/prismadb";
import type { OrderFormValues } from "../_components/order-schema";
import getOrdersIndex from "./get-orders-index";
import { createId } from "@/lib/id";
import { createCustomer } from "@/components/pdf/pdf-data";
import createOrdersEvent from "@/components/google-events/create-orders-event";
import { revalidateTag } from "next/cache";
import { formatOrder } from "../../../calendar/_functions/get-orders";

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
        create: orderItems.map(({ categoryName, description, itemId, name, price, quantity, unit, tax, stocks }) => {
          return {
            itemId,
            price,
            stocks,
            quantity,
            unit,
            name,
            tax,
            categoryName,
            description,
          };
        }),
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

  await createOrdersEvent(dateOfShipping || datePickUp);
  revalidateTag("orders");
  return {
    success: true,
    message: "Commande crée",
    data: formatOrder(order),
  };
}

export default createOrderAction;
