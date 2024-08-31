"use client";

import { Button, LoadingButton } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table/data-table";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { FormEventHandler, useEffect, useRef, useState } from "react";
import type { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { columns, filterableColumns, viewOptionsColumns, type OrderColumn } from "./columns";
import { Input } from "@/components/ui/input";

interface OrderClientProps {
  initialData: OrderColumn[];
  initialDateRange: DateRange;
}

export const OrderClient: React.FC<OrderClientProps> = ({ initialData, initialDateRange }) => {
  const [data, setData] = useState<OrderColumn[]>(initialData);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(initialDateRange);
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

  const products = data.flatMap((product) => product.productsList.map((p) => p.name));
  const productsWithoutDuplicates = [...new Set(products.map((product) => product))].sort((a, b) => a.localeCompare(b));

  const shopsName = data.map((order) => order.shopName);
  const shopsNameWithoutDuplicates = [...new Set(shopsName.map((product) => product))].sort((a, b) =>
    a.localeCompare(b),
  );
  const userNames = [...new Set(initialData.map((order) => order.name))];
  return (
    <>
      <div className="flex flex-col items-center justify-between sm:flex-row">
        <Heading title={`Commandes (${data.length})`} description="Gérer les commandes" />
        <Button onClick={() => router.push(`/admin/orders/new`)} className="m-2 pb-6 pt-6 sm:ml-2 sm:pb-0 sm:pt-0">
          <Plus className="mr-2 h-4 w-4" />
          Créer une commande
        </Button>
      </div>

      <Separator className="mb-4" />
      <div className="flex flex-col gap-4 sm:flex-row">
        <DatePickerWithRange
          date={dateRange}
          setDate={setDateRange}
          startMonth={new Date(2024, 0)}
          endMonth={new Date(new Date().getFullYear(), 11)}
        />
        <LoadingButton className="w-fit" disabled={loading} onClick={() => handleChangeDate()}>
          Valider
        </LoadingButton>
      </div>
      <SearchId />
      <Separator className="my-4" />

      <DataTable
        filterableColumns={filterableColumns({
          products: productsWithoutDuplicates,
          shopsName: shopsNameWithoutDuplicates,
          userNames,
        })}
        viewOptionsColumns={viewOptionsColumns}
        columns={columns}
        data={data}
      />
    </>
  );
};

function SearchId() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  function onSubmit(formData: FormData) {
    router.push(`?id=${formData.get("searchId")}`);
  }
  return (
    <form className="flex flex-wrap gap-2" action={onSubmit}>
      <Input name="searchId" className="max-w-xs" placeholder="Rechercher par numéros de commande" />
      <Button type="submit">Rechercher</Button>
      <Button
        type="button"
        variant={"outline"}
        className="border-dashed"
        onClick={() => {
          formRef.current?.reset();
          router.push(`/admin/orders`);
        }}
      >
        Réinitialiser
      </Button>
    </form>
  );
}
