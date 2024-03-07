"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { CategoryColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";

interface CategoryClientProps {
  data: CategoryColumn[];
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
          <Plus className="mr-2 h-8 w-8 sm:h-4 sm:w-4" />
          Ajouter un nouveau
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} initialData={data} />
    </>
  );
};
