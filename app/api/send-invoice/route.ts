import { ADMIN } from "@/components/auth";
import { checkUser } from "@/components/auth/checkAuth";
import { sendInvoice } from "@/components/pdf/server-actions/create-and-send-invoice";
import { safeRouteAPI } from "@/lib/server-action";
import { addDelay } from "@/lib/utils";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

export const dynamic = "force-dynamic";

const schema = z.object({ invoiceId: z.string() });

export async function POST(request: NextRequest) {
  return await safeRouteAPI({
    method: "POST",
    request,
    schema,
    roles: ADMIN,
    serverError: "[SEND_INVOICE]",
    serverAction: async ({ invoiceId }) => {
      return await sendInvoice(invoiceId);
    },
  });
}

const schemaPatch = z.object({ invoiceIds: z.array(z.string()) });

export async function PATCH(request: NextRequest) {
  try {
    const user = await checkUser();
    const data = await request.json();

    const validatedData = schemaPatch.safeParse(data);

    if (!validatedData.success) {
      return new NextResponse(validatedData.error.issues[0].message, {
        status: 400,
      });
    }

    if (!user || user.role !== "admin") {
      return new NextResponse("Vous devez être authentifier pour continuer", {
        status: 401,
      });
    }
    const iterator = sendInvoices(validatedData.data.invoiceIds);
    const stream = iteratorToStream(iterator);

    return new Response(stream);
  } catch (error) {
    console.log("SEND_INVOICES", error);
    return new NextResponse("Erreur", {
      status: 500,
    });
  }
}

async function* sendInvoices(invoiceIds: string[]) {
  const encoder = new TextEncoder();

  // Create an array of objects containing the promise and invoiceId
  const pendingPromises = invoiceIds.map((invoiceId) => {
    const promise = (async () => {
      // const delay = Math.random() * (3000 - 1000) + 1000;
      // await addDelay(delay);
      // console.log(`Sending invoice ${invoiceId} with a delay of ${delay}ms`);
      // const response = {
      //   invoiceId,
      //   delay,
      //   status: "sent",
      // };
      const response = await sendInvoice(invoiceId);
      return encoder.encode(JSON.stringify(response));
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
