"use server";

import { SHIPPING } from "@/components/auth";
import safeServerAction from "@/lib/server-action";
import z from "zod";
import getUsersForOrders from "../../orders/[orderId]/_functions/get-users-for-orders";

const schema = z.object({});

async function getUsersForOrdersAction(data: z.infer<typeof schema>) {
  return await safeServerAction({
    data,
    schema,
    roles: SHIPPING,
    serverAction: async () => {
      const users = await getUsersForOrders();
      return { success: true, data: users, message: "" };
    },
  });
}

export default getUsersForOrdersAction;
