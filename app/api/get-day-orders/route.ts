import { getOrdersByDate } from "@/app/(routes)/admin/calendar/_functions/get-orders";
import { SHIPPING } from "@/components/auth";
import { safeAPIRoute } from "@/lib/api-route";
import type { NextRequest } from "next/server";
import { z } from "zod";

export const dynamic = "force-dynamic";

const schema = z.object({
  from: z.coerce.date(),
  to: z.coerce.date(),
});

export async function POST(request: NextRequest) {
  return await safeAPIRoute({
    method: "POST",
    request,
    schema,
    roles: SHIPPING,
    serverError: "[GET_DAY_ORDERS]",
    serverAction: async ({ from, to }) => {
      return await getOrdersByDate({ from, to });
    },
  });
}
