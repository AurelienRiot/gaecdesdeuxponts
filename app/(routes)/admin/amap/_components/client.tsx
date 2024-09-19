"use client";

import { Button, LoadingButton } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table/data-table";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { columns, filterableColumns, viewOptionsColumns, type AMAPColumn } from "./columns";
import { Drawer } from "vaul";
import { dateFormatter } from "@/lib/date-utils";
import DateModal from "@/components/date-modal";

interface AMAPClientProps {
  initialData: AMAPColumn[];
  endDate: Date;
}

export const AMAPClient: React.FC<AMAPClientProps> = ({ initialData, endDate }) => {
  const [data, setData] = useState<AMAPColumn[]>(initialData);
  const [date, setDate] = useState<Date | undefined>(endDate);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChangeDate = async () => {
    setLoading(true);
    if (!date) {
      setLoading(false);
      toast.error("Veuillez choisir une date");
      return;
    }
    const queryParams = new URLSearchParams({
      date: date.toISOString(),
    }).toString();
    router.push(`?${queryParams}`);

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
      <div className="flex flex-wrap gap-4 ">
        <DateModal
          value={date}
          onValueChange={(value) => setDate(value)}
          startMonth={new Date(2024, 0)}
          endMonth={new Date(new Date().getFullYear() + 1, 11)}
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
  const [searchId, setSearchId] = useState("");
  const router = useRouter();

  function onSubmit() {
    router.push(`?id=${searchId}`);
  }
  return (
    <div className="flex flex-wrap gap-2">
      <Input
        className="max-w-xs"
        value={searchId}
        onChange={(event) => {
          setSearchId(event.target.value);
        }}
        placeholder="Rechercher par numéros de commande"
      />
      <Button onClick={onSubmit}>Rechercher</Button>
      <Button
        variant={"outline"}
        className="border-dashed"
        onClick={() => {
          setSearchId("");
          router.push(`/admin/amap`);
        }}
      >
        Effacer
      </Button>
    </div>
  );
}
