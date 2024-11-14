import { ADMIN } from "@/components/auth";
import { sendInvoice } from "@/components/pdf/server-actions/create-and-send-invoice";
import { safeAPIRoute } from "@/lib/api-route";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

export const dynamic = "force-dynamic";

const sendInvoicesSchema = z.object({ invoiceIds: z.array(z.string()) });

export async function POST(request: NextRequest) {
  return await safeAPIRoute({
    method: "POST",
    request,
    schema: sendInvoicesSchema,
    roles: ADMIN,
    serverError: "[SEND_INVOICE]",
    serverAction: async ({ invoiceIds }) => {
      const iterator = sendInvoices(invoiceIds);
      const stream = iteratorToStream(iterator);

      return new NextResponse(stream);
    },
  });
}

async function* sendInvoices(invoiceIds: string[]) {
  const encoder = new TextEncoder();

  const pendingPromises = invoiceIds.map((invoiceId) => {
    const promise = (async () => {
      const response = await sendInvoice(invoiceId);
      return encoder.encode(JSON.stringify(response) + "\n");
    })();
    return { promise, invoiceId };
  });

  while (pendingPromises.length > 0) {
    // Wait for the fastest promise to resolve
    const { result, promise } = await Promise.race(
      pendingPromises.map(({ promise, invoiceId }) => promise.then((result) => ({ result, promise }))),
    );

    // Remove the resolved promise from the array
    const index = pendingPromises.findIndex((p) => p.promise === promise);
    if (index !== -1) {
      pendingPromises.splice(index, 1);
    }

    // Yield the result
    yield result;
  }
}

function iteratorToStream(iterator: any) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();

      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
  });
}
