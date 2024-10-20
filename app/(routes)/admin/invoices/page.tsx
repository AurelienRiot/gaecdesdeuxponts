import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Suspense } from "react";
import GroupedInvoicePage from "./_components/grouped-invoice";
import InvoiceTable from "./_components/table";
import getInvoices from "./_functions/get-invoices";
import { getUsersWithOrders } from "./_functions/get-users-with-orders";

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
  const invoices = await getInvoices();

  return <InvoiceTable data={invoices} />;
}
