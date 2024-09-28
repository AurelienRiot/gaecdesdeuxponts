import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Factures",
};

function InvoiceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full space-y-4 p-6">
      <Heading title={`Factures`} description="Résumé des factures" />
      <Separator />
      {children}
    </div>
  );
}

export default InvoiceLayout;
