import { checkAdmin } from "@/components/auth/checkAuth";
import { sendInvoice } from "@/components/pdf/server-actions/create-and-send-invoice";
import { NextResponse } from "next/server";
import { z } from "zod";

const groupedMonthlyInvoiceSchema = z.object({ invoiceId: z.string() });

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validatedData = groupedMonthlyInvoiceSchema.safeParse(body);
    if (!validatedData.success) {
      return new NextResponse("Erreur dans la validation de la requête", {
        status: 400,
      });
    }
    const user = await checkAdmin();

    if (!user) {
      return new NextResponse("Vous devez être authentifier avec un compte admin", {
        status: 401,
      });
    }

    const response = await sendInvoice(validatedData.data.invoiceId);

    if (!response.success) {
      return new NextResponse(response.message, {
        status: 500,
      });
    }
    return new NextResponse(response.message, {
      status: 200,
    });
  } catch (error) {
    console.log("[GROUPED_INVOICE]", error);
    return new NextResponse("Erreur", {
      status: 500,
    });
  }
}
