"server only";

import prismadb from "@/lib/prismadb";
import { unstable_cache } from "next/cache";
import type { InvoiceColumn } from "../_components/columns";
import { getUserName } from "@/components/table-custom-fuction";
import { currencyFormatter } from "@/lib/utils";
import { dateFormatter, dateMonthYear } from "@/lib/date-utils";

const getInvoices = unstable_cache(
  async (): Promise<InvoiceColumn[]> => {
    const invoices = await prismadb.invoice.findMany({
      where: { deletedAt: null },

      include: {
        orders: { select: { id: true, dateOfShipping: true } },
        customer: true,
        user: { select: { image: true, name: true, company: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    const formattedInvoices = invoices.map((invoice) => ({
      id: invoice.id,
      image: invoice.user?.image,
      name: getUserName(invoice.user),
      userId: invoice.customer?.userId,
      totalOrders: invoice.orders.length,
      totalPrice: currencyFormatter.format(invoice.totalPrice),
      status: invoice.dateOfPayment ? "Payé" : "En attente de paiement",
      paymentMethode: invoice.paymentMethod,
      emailSend: !!invoice.invoiceEmail,
      date:
        invoice.orders.length > 1
          ? dateMonthYear(invoice.orders.map((order) => order.dateOfShipping))
          : dateFormatter(invoice.dateOfEdition),
      createdAt: invoice.createdAt,
    })) satisfies InvoiceColumn[];
    return formattedInvoices.sort((a, b) => {
      const targetStatus = "En attente de paiement";

      // Check if 'a' or 'b' has the target status
      const aIsTarget = a.status === targetStatus;
      const bIsTarget = b.status === targetStatus;

      if (aIsTarget && !bIsTarget) {
        // 'a' has target status and 'b' does not => 'a' comes first
        return -1;
      }
      if (!aIsTarget && bIsTarget) {
        // 'b' has target status and 'a' does not => 'b' comes first
        return 1;
      }
      if (aIsTarget && bIsTarget) {
        // Both have target status => sort by 'createdAt' ascending
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA; // Earlier date comes first
      }
      // Neither has target status => sort by 'createdAt' descending (optional)
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA; // Later date comes first
    });
  },
  ["getInvoices"],
  { revalidate: 60 * 60 * 24, tags: ["invoices", "users"] },
);
export default getInvoices;
