"use client";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ContactColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";

interface ContactClientProps {
  data: ContactColumn[];
}

export const ContactClient: React.FC<ContactClientProps> = ({ data }) => {
  return (
    <>
      <Heading
        title={`Contacts (${data.length})`}
        description="Messages reçus"
      />

      <Separator />
      <DataTable searchKey="message" columns={columns} initialData={data} />
    </>
  );
};
