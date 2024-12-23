import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Suspense } from "react";
import CardFilter from "./_components/card-filter";
import { InvoiceModalProvider } from "./_components/payment-method-modal";
import getInvoices from "./_functions/get-invoices";
import { addDelay } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/skeleton-ui/skeleton";
import { MoreHorizontal } from "lucide-react";

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
        <Suspense fallback={<InvoiceLoading />}>
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

function InvoiceLoading() {
  return (
    <div className="space-y-4">
      <Button type="button" variant={"outline"}>
        Nom de client
      </Button>
      <div className="flex flex-wrap gap-4 justify-center">
        {Array(10)
          .fill(null)
          .map((_, i) => (
            <InvoiceCardLoading key={String(i)} />
          ))}
      </div>
    </div>
  );
}

function InvoiceCardLoading() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="flex-col   gap-2 p-4 w-full justify-start items-start">
        <div className="flex items-center justify-between  w-full ">
          <div className="flex gap-2 items-center">
            <Skeleton size={"icon"} />
            <Skeleton size={"default"} />
          </div>
          <Button variant="ghost" className="p-0 relative w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
        <Skeleton size={"sm"} />
      </CardHeader>
      <CardContent className="grid gap-4 p-4">
        <div className="flex items-center justify-between">
          <Skeleton size={"sm"} />
          <Skeleton size={"xs"} />
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Email envoyé:</span>
            <Skeleton size={"icon"} />
          </div>
          <Skeleton size={"xs"} className="w-10" />
        </div>
      </CardContent>
    </Card>
  );
}
