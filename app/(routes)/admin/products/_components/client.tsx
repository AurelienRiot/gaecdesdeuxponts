"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  columns,
  filterableColumns,
  viewOptionsColumns,
  type ProductColumn
} from "./columns";

interface ProductClientProps {
  data: ProductColumn[];
}

export const ProductClient: React.FC<ProductClientProps> = ({ data }) => {
  const router = useRouter();

  const productNames = data.map((product) => product.name);

  const categories = data.map((product) => product.category);
  const categoryNames = [...new Set(categories.map((category) => category))];

  const options = data.flatMap((product) =>
    product.productOptions.flatMap((option) =>
      option.options.map((opt) => opt.value),
    ),
  );

  const optionValues = [...new Set(options.map((value) => value))].sort(
    (a, b) => b.localeCompare(a),
  );

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
        filterableColumns={filterableColumns({
          categoryNames,
          productNames,
          optionValues,
        })}
        viewOptionsColumns={viewOptionsColumns}
        columns={columns}
        data={data}
      />
    </>
  );
};
