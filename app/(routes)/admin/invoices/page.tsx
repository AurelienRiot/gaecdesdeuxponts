import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Suspense } from "react";
import InvoiceTable from "./_components/table";
import getInvoices from "./_functions/get-invoices";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function InvoicesPage() {
  return (
    <div className="space-y-4 p-6">
      <div className="flex justify-between flex-wrap items-center">
        <Heading title={`Factures`} description="Gérer les factures mensuelles" />
        <Button asChild>
          <Link href="/admin/invoices/send-invoices">Envoie groupé de facture</Link>
        </Button>
      </div>
      <Separator />
      <Suspense fallback={"Loading..."}>
        <InvoiceTableServer />
      </Suspense>
    </div>
  );
}

export default InvoicesPage;

async function InvoiceTableServer() {
  const invoices = await getInvoices();

  return <InvoiceTable data={invoices} />;
}
