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

    include: { orders: { select: { id: true } }, customer: true, user: { select: { image: true } } },
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
    createdAt: invoice.createdAt,
  }));
  return <InvoiceTable data={formattedInvoices.sort((a, b) => (a.status === "En attente de paiement" ? -1 : 1))} />;
}
