"use client";

import { DataTable } from "@/components/ui/data-table/data-table";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { getMonthNumber } from "@/lib/date-utils";
import { useRouter, useSearchParams } from "next/navigation";
import { columns, filterableColumns, viewOptionsColumns, type OrderColumn } from "./order-column";

interface OrderTableProps {
  data: OrderColumn[];
}

export const OrderTable: React.FC<OrderTableProps> = ({ data }) => {
  const searchParams = useSearchParams();
  const search = {
    id: searchParams.get("id") || "",
    month: searchParams.get("month") !== null ? Number(searchParams.get("month")) : new Date().getMonth(),
    year: searchParams.get("year") !== null ? Number(searchParams.get("year")) : new Date().getFullYear(),
  };

  const filteredOrders = data
    .filter((order) => {
      if (search.id) {
        return order.id.toLowerCase().includes(search.id.toLowerCase());
      }
      const month = new Date(order.datePickUp).getMonth();
      const year = new Date(order.datePickUp).getFullYear();
      return month === search.month && year === search.year;
    })
    .sort((a, b) => new Date(b.datePickUp).getTime() - new Date(a.datePickUp).getTime());

  const products = filteredOrders.flatMap((product) => product.productsList.map((p) => p.name));
  const categoriesWithoutDuplicates = [...new Set(products.map((product) => product))].sort((a, b) =>
    a.localeCompare(b),
  );

  const shopsName = filteredOrders.map((order) => order.shopName);
  const shopsNameWithoutDuplicates = [...new Set(shopsName.map((product) => product))].sort((a, b) =>
    a.localeCompare(b),
  );

  const yearSet = new Set(data.map((order) => new Date(order.createdAt).getFullYear()));
  const yearArray = Array.from(yearSet);

  return (
    <>
      <Heading
        title={`Commandes de ${getMonthNumber(search.month)} ${search.year} (${filteredOrders.length})`}
        description="Gérez les commandes"
      />
      <Separator className="my-4" />
      <SearchOrders search={search} yearArray={yearArray} />
      <DataTable
        filterableColumns={filterableColumns({
          products: categoriesWithoutDuplicates,
          shopsName: shopsNameWithoutDuplicates,
        })}
        viewOptionsColumns={viewOptionsColumns}
        columns={columns}
        data={filteredOrders}
        emptyRows
        dowloadButton
      />
    </>
  );
};

function SearchOrders({
  search,
  yearArray,
}: {
  search: { id: string; month: number; year: number };
  yearArray: number[];
}) {
  const router = useRouter();
  return (
    <>
      <div className="flex items-center gap-4 flex-wrap">
        <Select
          onValueChange={(newValue) => {
            router.push(`?month=${Number(newValue)}&year=${search.year}`, { scroll: false });
          }}
          value={search.month.toString()}
        >
          <SelectTrigger className="w-24 capitalize">
            <SelectValue placeholder="Mois" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 12 }).map((_, index) => (
              <SelectItem key={index} value={index.toString()} className="capitalize">
                {getMonthNumber(index)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          onValueChange={(newValue) => {
            router.push(`?month=${search.month}&year=${Number(newValue)}`, { scroll: false });
          }}
          value={search.year.toString()}
        >
          <SelectTrigger className="w-16">
            <SelectValue placeholder="Année" />
          </SelectTrigger>
          <SelectContent side="top">
            {yearArray.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Input
        value={search.id}
        onChange={(e) =>
          router.push(`?month=${search.month}&year=${search.year}&id=${e.target.value}`, { scroll: false })
        }
        placeholder="Rechercher par numéro de commande"
        className="max-w-64 my-4"
      />
    </>
  );
}
