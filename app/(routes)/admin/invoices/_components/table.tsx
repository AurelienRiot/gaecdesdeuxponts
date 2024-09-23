"use client";

import { DataTable } from "@/components/ui/data-table/data-table";
import { type InvoiceColumn, columns, searchableColumns, viewOptionsColumns } from "./columns";

interface ContactClientProps {
  data: InvoiceColumn[];
}

const InvoiceTable: React.FC<ContactClientProps> = ({ data }) => {
  return (
    <DataTable
      searchableColumns={searchableColumns}
      viewOptionsColumns={viewOptionsColumns}
      columns={columns}
      data={data}
    />
  );
};

export default InvoiceTable;
