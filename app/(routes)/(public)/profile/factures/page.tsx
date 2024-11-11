"use client";

import { DataTableSkeleton } from "@/components/skeleton-ui/data-table-skeleton";
import { DataTable } from "@/components/ui/data-table/data-table";
import { dateFormatter, dateMonthYear } from "@/lib/date-utils";
import { currencyFormatter } from "@/lib/utils";
import { InvoiceColumn, type InvoiceColumnType } from "./_components/invoice-column";
import { useUserQuery } from "../../../../../hooks/use-query/user-query";

const PageOrderTable = () => {
  const { data: user } = useUserQuery();

  const formattedInvoices: InvoiceColumnType[] | undefined = user?.invoices.map((invoice) => ({
    id: invoice.id,
    totalOrders: invoice.orders.length,
    totalPrice: currencyFormatter.format(invoice.totalPrice),
    status: invoice.dateOfPayment ? "Payé" : "En attente de paiement",
    emailSend: !!invoice.invoiceEmail,
    date:
      invoice.orders.length > 1
        ? dateMonthYear(invoice.orders.map((order) => (order.dateOfShipping ? new Date(order.dateOfShipping) : null)))
        : dateFormatter(new Date(invoice.dateOfEdition)),
  }));

  if (!formattedInvoices) {
    return <DataTableSkeleton columnCount={5} />;
  }

  return <DataTable data={formattedInvoices} columns={InvoiceColumn} />;
};

export default PageOrderTable;
