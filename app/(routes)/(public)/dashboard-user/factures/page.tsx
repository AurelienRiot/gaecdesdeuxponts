"use client";

import { DataTableSkeleton } from "@/components/skeleton-ui/data-table-skeleton";
import { DataTable } from "@/components/ui/data-table/data-table";
import { useUserContext } from "@/context/user-context";
import { currencyFormatter } from "@/lib/utils";
import { InvoiceColumn, type InvoiceColumnType } from "./_components/invoice-column";

const PageOrderTable = () => {
  const { user } = useUserContext();

  if (!user) {
    return <DataTableSkeleton columnCount={5} />;
  }

  const formattedInvoices: InvoiceColumnType[] = user.invoices.map((invoice) => ({
    id: invoice.id,
    totalOrders: invoice.orders.length,
    totalPrice: currencyFormatter.format(invoice.totalPrice),
    status: invoice.dateOfPayment ? "Payé" : "En attente de paiement",
    emailSend: !!invoice.invoiceEmail,
    createdAt: invoice.createdAt,
  }));

  return <DataTable data={formattedInvoices} columns={InvoiceColumn} />;
};

export default PageOrderTable;
