import { getOrdersByDate } from "@/app/(routes)/admin/calendar/_functions/get-orders";
import { safeRouteAPI } from "@/lib/server-action";
import type { NextRequest } from "next/server";
import { z } from "zod";

export const dynamic = "force-dynamic";

const schema = z.object({
  from: z.coerce.date(),
  to: z.coerce.date(),
});

export async function POST(request: NextRequest) {
  return await safeRouteAPI({
    request,
    schema,
    roles: ["admin", "readOnlyAdmin"],
    serverError: "[GET_DAY_ORDERS]",
    serverAction: async ({ from, to }) => {
      return await getOrdersByDate({ from, to });
    },
  });
}