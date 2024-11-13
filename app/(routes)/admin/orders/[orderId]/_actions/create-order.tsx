"use server";

import { SHIPPING_ONLY } from "@/components/auth";
import safeServerAction from "@/lib/server-action";
import { orderSchema, type OrderFormValues } from "../_components/order-schema";
import createOrderAction from "../_functions/create-order";

async function createOrder(data: OrderFormValues) {
  return await safeServerAction({
    schema: orderSchema,
    data,
    roles: SHIPPING_ONLY,
    serverAction: async (data) => {
      return await createOrderAction(data);
    },
  });
}

export { createOrder };
