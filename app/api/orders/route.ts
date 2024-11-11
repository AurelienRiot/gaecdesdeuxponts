import { getOrdersByDate } from "@/app/(routes)/admin/calendar/_functions/get-orders";
import { SHIPPING } from "@/components/auth";
import { safeRouteAPI } from "@/lib/server-action";
import type { NextRequest } from "next/server";
import { z } from "zod";

export const dynamic = "force-dynamic";

const schema = z.object({
  from: z.coerce.date(),
  to: z.coerce.date(),
});

export async function GET(request: NextRequest) {
  return await safeRouteAPI({
    searchParamsReq: true,
    request,
    schema,
    roles: SHIPPING,
    serverError: "[GET_ORDERS_BY_DATE]",
    serverAction: async ({ from, to }) => {
      return await getOrdersByDate({ from, to });
    },
  });
}
