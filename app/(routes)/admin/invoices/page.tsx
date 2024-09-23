import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { getProUsersWithOrders } from "./_functions/get-pro-users-with-orders";
import GroupedInvoicePage from "./_components/grouped-invoice";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import prismadb from "@/lib/prismadb";
import type { InvoiceColumn } from "./_components/columns";
import { getUserName } from "@/components/table-custom-fuction";
import { currencyFormatter } from "@/lib/utils";
import InvoiceTable from "./_components/table";
import { DataTableSkeleton } from "@/components/skeleton-ui/data-table-skeleton";

async function InvoicesPage() {
  return (
    <div className="space-y-4 p-6">
      <div className="flex justify-between items-center">
        <Heading title={`Factures`} description="Gérer les factures mensuelles des professionnels" />

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
  const allUsers = await getProUsersWithOrders();
  return <GroupedInvoicePage proUserWithOrders={allUsers} />;
}

async function InvoiceTableServer() {
  const invoices = await prismadb.invoice.findMany({
    where: { deletedAt: null },
    include: { customer: true, user: { select: { image: true } } },
    orderBy: { createdAt: "desc" },
  });

  const formattedInvoices: InvoiceColumn[] = invoices.map((invoice) => ({
    id: invoice.id,
    image: invoice.user?.image,
    name: invoice.customer ? getUserName(invoice.customer) : "Non renseigné",
    userId: invoice.customer?.userId,
    totalPrice: currencyFormatter.format(invoice.totalPrice),
    status: invoice.dateOfPayment ? "Commande Payée" : "En cours de paiement",
    emailSend: !!invoice.invoiceEmail,
    createdAt: invoice.createdAt,
  }));
  return <InvoiceTable data={formattedInvoices} />;
}
