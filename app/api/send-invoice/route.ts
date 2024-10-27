import { ADMIN } from "@/components/auth";
import { sendInvoice } from "@/components/pdf/server-actions/create-and-send-invoice";
import { safeRouteAPI } from "@/lib/server-action";
import type { NextRequest } from "next/server";
import { z } from "zod";

export const dynamic = "force-dynamic";

const schema = z.object({ invoiceId: z.string() });

export async function POST(request: NextRequest) {
  return await safeRouteAPI({
    request,
    schema,
    roles: ADMIN,
    serverError: "[SEND_INVOICE]",
    serverAction: async ({ invoiceId }) => {
      return await sendInvoice(invoiceId);
    },
  });
}
