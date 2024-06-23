"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  type CategoryColumnType,
  CategoryColumn,
  searchableColumns,
  viewOptionsColumns,
} from "./columns";
import { DataTable } from "@/components/ui/data-table/data-table";

interface CategoryClientProps {
  data: CategoryColumnType[];
}

export const CategoryClient: React.FC<CategoryClientProps> = ({ data }) => {
  const router = useRouter();

  return (
    <>
      <div className="flex flex-col items-center justify-between sm:flex-row">
        <Heading
          title={`Categories (${data.length})`}
          description="Gerer les categories"
        />
        <Button
          onClick={() => router.push(`/admin/categories/new`)}
          className="m-2 pb-6 pt-6 sm:ml-2 sm:pb-0 sm:pt-0"
        >
          <Plus className="mr-2  h-4 w-4" />
          Ajouter un nouveau
        </Button>
      </div>
      <Separator />
      <DataTable
        columns={CategoryColumn}
        data={data}
        searchableColumns={searchableColumns}
        viewOptionsColumns={viewOptionsColumns}
      />
    </>
  );
};
