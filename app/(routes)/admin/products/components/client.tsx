"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  ProductColumn,
  columns,
  filterableColumns,
  searchableColumns,
  viewOptionsColumns,
} from "./columns";
import { DataTable } from "@/components/ui/data-table/data-table";

interface ProductClientProps {
  data: ProductColumn[];
}

export const ProductClient: React.FC<ProductClientProps> = ({ data }) => {
  const router = useRouter();

  const categories = data.map((product) => product.category);
  const categoriesWithoutDuplicates = [
    ...new Set(categories.map((category) => category)),
  ];

  return (
    <>
      <div className="flex flex-col items-center justify-between sm:flex-row">
        <Heading
          title={`Produits (${data.length})`}
          description="Gérez les produits"
        />
        <Button
          onClick={() => router.push(`/admin/products/new`)}
          className="m-2 pb-6 pt-6 sm:ml-2 sm:pb-0 sm:pt-0"
        >
          <Plus className="mr-2  h-4 w-4" />
          Ajouter un nouveau
        </Button>
      </div>
      <Separator />
      <DataTable
        filterableColumns={filterableColumns(categoriesWithoutDuplicates)}
        searchableColumns={searchableColumns}
        viewOptionsColumns={viewOptionsColumns}
        columns={columns}
        data={data}
      />
    </>
  );
};
