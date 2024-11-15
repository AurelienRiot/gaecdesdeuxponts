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

  for (const invoiceId of invoiceIds) {
    const response = await sendInvoice(invoiceId);
    yield encoder.encode(JSON.stringify(response) + "\n");
  }

  // const pendingPromises = invoiceIds.map((invoiceId, index) => {
  //   const promise = (async () => {
  //     if (index !== 0) {
  //       await new Promise((resolve) => setTimeout(resolve, 500 + 10 * index));
  //     }
  //     const response = await sendInvoice(invoiceId);
  //     return encoder.encode(JSON.stringify(response) + "\n");
  //   })();
  //   return { promise };
  // });

  // while (pendingPromises.length > 0) {
  //   // Wait for the fastest promise to resolve
  //   const { result, promise } = await Promise.race(
  //     pendingPromises.map(({ promise }) => promise.then((result) => ({ result, promise }))),
  //   );

  //   // Remove the resolved promise from the array
  //   const index = pendingPromises.findIndex((p) => p.promise === promise);
  //   if (index !== -1) {
  //     pendingPromises.splice(index, 1);
  //   }

  //   // Yield the result
  //   yield result;
  // }
}

function iteratorToStream<T>(iterator: AsyncGenerator<T, void, unknown>) {
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
