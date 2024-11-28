"use client";

import { DataTableSkeleton } from "@/components/skeleton-ui/data-table-skeleton";
import { DataTable } from "@/components/ui/data-table/data-table";
import { useUserQuery } from "../../../../../hooks/use-query/user-query";
import { InvoiceColumn } from "./_components/invoice-column";

const PageOrderTable = () => {
  const { data: user } = useUserQuery();

  if (!user) {
    return <DataTableSkeleton columnCount={5} />;
  }

  return <DataTable data={user.invoices} columns={InvoiceColumn} />;
};

export default PageOrderTable;
