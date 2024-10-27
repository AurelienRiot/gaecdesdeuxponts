import { getOrdersByDate } from "@/app/(routes)/admin/calendar/_functions/get-orders";
import { READ_ONLY_ADMIN } from "@/components/auth";
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
    roles: READ_ONLY_ADMIN,
    serverError: "[GET_DAY_ORDERS]",
    serverAction: async ({ from, to }) => {
      return await getOrdersByDate({ from, to });
    },
  });
}
