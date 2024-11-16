import getUsersForOrders from "@/app/(routes)/admin/orders/[orderId]/_functions/get-users-for-orders";
import { SHIPPING } from "@/components/auth";
import { safeAPIRoute } from "@/lib/api-route";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  return await safeAPIRoute({
    method: "GET",
    request,
    roles: SHIPPING,
    serverError: "[GET_USERS_FOR_ORDERS]",
    serverAction: async () => {
      const users = await getUsersForOrders();
      return { success: true, data: users, message: "" };
    },
  });
}
