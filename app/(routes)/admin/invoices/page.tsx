import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Suspense } from "react";
import CardFilter from "./_components/card-filter";
import { InvoiceModalProvider } from "./_components/payment-method-modal";
import getInvoices from "./_functions/get-invoices";
import { addDelay } from "@/lib/utils";

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
      <InvoiceModalProvider>
        <Suspense fallback={"Loading..."}>
          <InvoiceTableServer />
        </Suspense>
      </InvoiceModalProvider>
    </div>
  );
}

export default InvoicesPage;

async function InvoiceTableServer() {
  const invoices = await getInvoices();

  return <CardFilter invoices={invoices} />;
}
