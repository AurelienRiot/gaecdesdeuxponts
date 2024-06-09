"use client";

import { Button, LoadingButton } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table/data-table";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";
import {
  OrderColumn,
  columns,
  filterableColumns,
  searchableColumns,
  viewOptionsColumns,
} from "./columns";
import { Plus } from "lucide-react";

interface OrderClientProps {
  initialData: OrderColumn[];
  initialDateRange: DateRange;
}

export const OrderClient: React.FC<OrderClientProps> = ({
  initialData,
  initialDateRange,
}) => {
  const [data, setData] = useState<OrderColumn[]>(initialData);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    initialDateRange,
  );
  const [loading, setLoading] = useState(false);
  const pathName = usePathname();
  const router = useRouter();

  const handleChangeDate = async () => {
    setLoading(true);
    if (!dateRange?.from || !dateRange?.to) {
      setLoading(false);
      toast.error("Veuillez choisir une date");
      return;
    }
    const queryParams = new URLSearchParams({
      from: dateRange.from.toISOString(),
      to: dateRange.to.toISOString(),
    }).toString();
    router.push(`${pathName}?${queryParams}`);

    setLoading(false);
  };

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const products = data.flatMap((product) =>
    product.productsList.map((p) => p.name),
  );
  const productsWithoutDuplicates = [
    ...new Set(products.map((product) => product)),
  ].sort((a, b) => a.localeCompare(b));

  const shopsName = data.map((order) => order.shopName);
  const shopsNameWithoutDuplicates = [
    ...new Set(shopsName.map((product) => product)),
  ].sort((a, b) => a.localeCompare(b));
  return (
    <>
      <div className="flex flex-col items-center justify-between sm:flex-row">
        <Heading
          title={`Commandes (${data.length})`}
          description="Gérer les commandes"
        />
        <Button
          onClick={() => router.push(`/admin/orders/new`)}
          className="m-2 pb-6 pt-6 sm:ml-2 sm:pb-0 sm:pt-0"
        >
          <Plus className="mr-2 h-4 w-4" />
          Créer une commande
        </Button>
      </div>

      <Separator className="mb-4" />
      <div className="flex flex-col gap-4 sm:flex-row">
        <DatePickerWithRange date={dateRange} setDate={setDateRange} />
        <LoadingButton
          className="w-fit"
          disabled={loading}
          onClick={() => handleChangeDate()}
        >
          Valider
        </LoadingButton>
      </div>
      <DataTable
        filterableColumns={filterableColumns({
          products: productsWithoutDuplicates,
          shopsName: shopsNameWithoutDuplicates,
        })}
        searchableColumns={searchableColumns}
        viewOptionsColumns={viewOptionsColumns}
        columns={columns}
        data={data}
      />
    </>
  );
};
