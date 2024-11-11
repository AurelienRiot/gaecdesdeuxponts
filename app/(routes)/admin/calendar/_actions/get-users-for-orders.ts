"use server";

import { SHIPPING } from "@/components/auth";
import safeServerAction from "@/lib/server-action";
import getUsersForOrders from "../../orders/[orderId]/_functions/get-users-for-orders";
import type { emptySchema } from "@/components/zod-schema";
import type z from "zod";

async function getUsersForOrdersAction(data: z.infer<typeof emptySchema>) {
  return await safeServerAction({
    data,
    roles: SHIPPING,
    serverAction: async () => {
      const users = await getUsersForOrders();
      return { success: true, data: users, message: "" };
    },
  });
}

export default getUsersForOrdersAction;
