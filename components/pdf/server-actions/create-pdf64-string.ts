import { dateMonthYear } from "@/lib/date-utils";
import prismadb from "@/lib/prismadb";
import { generatePdfSring64 } from "../pdf-fuction";

export async function createInvoicePDF64String(invoiceId: string) {
  const fullInvoice = await prismadb.invoice.findUnique({
    where: {
      id: invoiceId,
      deletedAt: null,
    },
    include: {
      customer: true,
      user: { select: { id: true } },
      orders: {
        include: { invoiceOrderItems: true },
      },
    },
  });
  if (!fullInvoice) {
    return {
      success: false,
      message: "La facture n'existe pas",
    };
  }
  const type = fullInvoice.orders.length === 1 ? "single" : "monthly";
  const date = dateMonthYear(fullInvoice.orders.map((order) => order.dateOfShipping));

  const base64String = await generatePdfSring64({ data: fullInvoice, type });
  return {
    success: true,
    message: "",
    data: { base64String, date, type, userId: fullInvoice.user.id },
  };
}

export async function createShippingPDF64String(orderId: string) {
  const order = await prismadb.order.findUnique({
    where: {
      id: orderId,
      deletedAt: null,
    },
    include: {
      orderItems: true,
      shop: true,
      user: { include: { address: true, billingAddress: true } },
      invoiceOrder: {
        select: { invoice: { select: { id: true, invoiceEmail: true, dateOfPayment: true } } },
        orderBy: { createdAt: "desc" },
        where: { invoice: { deletedAt: null } },
      },
    },
  });
  if (!order) {
    return {
      success: false,
      message: "La commande n'existe pas",
    };
  }

  const base64String = await generatePdfSring64({ data: order, type: "shipping" });
  return {
    success: true,
    message: "",
    data: { base64String, userId: order.user.id, delivered: !!order.shippingEmail },
  };
}
