import { checkAdmin } from "@/components/auth/checkAuth";
import { getAndSendMonthlyInvoice } from "@/components/pdf/server-actions/get-and-send-monthly-invoice";
import { NextResponse } from "next/server";
import { z } from "zod";

const groupedMonthlyInvoiceSchema = z.array(z.string());

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

    const montlyInvoice = await getAndSendMonthlyInvoice(validatedData.data);
    return montlyInvoice.success
      ? new NextResponse(montlyInvoice.message, {
          status: 200,
        })
      : new NextResponse(montlyInvoice.message, {
          status: 500,
        });
  } catch (error) {
    console.log("[GROUPED_INVOICE]", error);
    return new NextResponse("Erreur", {
      status: 500,
    });
  }
}
