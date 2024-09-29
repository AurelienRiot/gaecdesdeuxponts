import { getUserName } from "@/components/table-custom-fuction";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import prismadb from "@/lib/prismadb";
import { currencyFormatter } from "@/lib/utils";
import { Suspense } from "react";
import type { InvoiceColumn } from "./_components/columns";
import GroupedInvoicePage from "./_components/grouped-invoice";
import InvoiceTable from "./_components/table";
import { getUsersWithOrders } from "./_functions/get-users-with-orders";
import { dateFormatter, dateMonthYear } from "@/lib/date-utils";

export const dynamic = "force-dynamic";

async function InvoicesPage() {
  return (
    <div className="space-y-4 p-6">
      <div className="flex justify-between flex-wrap items-center">
        <Heading title={`Factures`} description="Gérer les factures mensuelles" />

        <Suspense fallback={<Button disabled> Envoie groupé de facture </Button>}>
          <GroupedInvoice />
        </Suspense>
      </div>
      <Separator />
      <Suspense fallback={"Loading..."}>
        <InvoiceTableServer />
      </Suspense>
    </div>
  );
}

export default InvoicesPage;

async function GroupedInvoice() {
  const allUsers = await getUsersWithOrders();
  return <GroupedInvoicePage proUserWithOrders={allUsers} />;
}

async function InvoiceTableServer() {
  const invoices = await prismadb.invoice.findMany({
    where: { deletedAt: null },

    include: {
      orders: { select: { id: true, dateOfShipping: true } },
      customer: true,
      user: { select: { image: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const formattedInvoices: InvoiceColumn[] = invoices.map((invoice) => ({
    id: invoice.id,
    image: invoice.user?.image,
    name: invoice.customer ? getUserName(invoice.customer) : "Non renseigné",
    userId: invoice.customer?.userId,
    totalOrders: invoice.orders.length,
    totalPrice: currencyFormatter.format(invoice.totalPrice),
    status: invoice.dateOfPayment ? "Payé" : "En attente de paiement",
    emailSend: !!invoice.invoiceEmail,
    date:
      invoice.orders.length > 1
        ? dateMonthYear(invoice.orders.map((order) => order.dateOfShipping))
        : dateFormatter(invoice.dateOfEdition),
    createdAt: invoice.createdAt,
  }));
  return (
    <InvoiceTable
      data={formattedInvoices.sort((a, b) => {
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
      })}
    />
  );
}
