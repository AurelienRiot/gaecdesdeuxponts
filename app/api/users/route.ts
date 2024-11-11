import getUsersForOrders from "@/app/(routes)/admin/orders/[orderId]/_functions/get-users-for-orders";
import { SHIPPING } from "@/components/auth";
import { safeRouteAPI } from "@/lib/server-action";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  return await safeRouteAPI({
    searchParamsReq: true,
    request,
    roles: SHIPPING,
    serverError: "[GET_USERS_FOR_ORDERS]",
    serverAction: async () => {
      const users = await getUsersForOrders();
      return { success: true, data: users, message: "" };
    },
  });
}
