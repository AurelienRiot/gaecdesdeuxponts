"use server";

import { SHIPPING_ONLY } from "@/components/auth";
import createOrdersEvent from "@/components/google-events/create-orders-event";
import { createCustomer } from "@/components/pdf/pdf-data";
import { createId } from "@/lib/id";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { revalidateTag } from "next/cache";
import { formatOrders } from "../../../calendar/_functions/get-orders";
import { orderSchema, type OrderFormValues } from "../_components/order-schema";
import getOrdersIndex from "../_functions/get-orders-index";

async function createOrder(data: OrderFormValues) {
  return await safeServerAction({
    schema: orderSchema,
    data,
    roles: SHIPPING_ONLY,
    serverAction: async ({ datePickUp, orderItems, totalPrice, userId, dateOfEdition, dateOfShipping, shopId }) => {
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
              ({ categoryName, description, itemId, name, price, quantity, unit, tax, stocks }) => {
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
              },
            ),
          },
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

      const customer = createCustomer(order.user);
      await prismadb.shippingCustomer.create({
        data: {
          orderId: order.id,
          ...customer,
        },
      });

      if (dateOfShipping) {
        await createOrdersEvent({ date: dateOfShipping });
      }
      revalidateTag("orders");
      return {
        success: true,
        message: "Commande crée",
        data: formatOrders(order),
      };
    },
  });
}

export default createOrder;
