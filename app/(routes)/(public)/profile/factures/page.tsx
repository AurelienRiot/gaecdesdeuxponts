"use client";

import { DataTableSkeleton } from "@/components/skeleton-ui/data-table-skeleton";
import { DataTable } from "@/components/ui/data-table/data-table";
import { dateFormatter, dateMonthYear } from "@/lib/date-utils";
import { currencyFormatter } from "@/lib/utils";
import { InvoiceColumn, type InvoiceColumnType } from "./_components/invoice-column";
import { useUserQuery } from "../_functions/user-query";

const PageOrderTable = () => {
  const { data: user } = useUserQuery();

  if (!user) {
    return <DataTableSkeleton columnCount={5} />;
  }

  const formattedInvoices: InvoiceColumnType[] = user.invoices.map((invoice) => ({
    id: invoice.id,
    totalOrders: invoice.orders.length,
    totalPrice: currencyFormatter.format(invoice.totalPrice),
    status: invoice.dateOfPayment ? "Payé" : "En attente de paiement",
    emailSend: !!invoice.invoiceEmail,
    date:
      invoice.orders.length > 1
        ? dateMonthYear(invoice.orders.map((order) => order.dateOfShipping))
        : dateFormatter(invoice.dateOfEdition),
  }));

  return <DataTable data={formattedInvoices} columns={InvoiceColumn} />;
};

export default PageOrderTable;
