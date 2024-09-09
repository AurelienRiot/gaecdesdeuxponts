"use client";

import { DataTable } from "@/components/ui/data-table/data-table";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { getMonthName } from "@/lib/date-utils";
import { useState, type Dispatch, type SetStateAction } from "react";
import { columns, filterableColumns, viewOptionsColumns, type OrderColumn } from "./order-column";

interface OrderTableProps {
  data: OrderColumn[];
}

export const OrderTable: React.FC<OrderTableProps> = ({ data }) => {
  const [search, setSearch] = useState({ id: "", month: new Date().getMonth(), year: new Date().getFullYear() });

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
        title={`Commandes de ${getMonthName(search.month)} ${search.year} (${filteredOrders.length})`}
        description="Gérez les commandes"
      />
      <Separator className="my-4" />
      <SearchOrders search={search} yearArray={yearArray} setSearch={setSearch} />
      <DataTable
        filterableColumns={filterableColumns({
          products: categoriesWithoutDuplicates,
          shopsName: shopsNameWithoutDuplicates,
        })}
        viewOptionsColumns={viewOptionsColumns}
        columns={columns}
        data={filteredOrders}
        emptyRows
      />
    </>
  );
};

function SearchOrders({
  search,
  setSearch,
  yearArray,
}: {
  search: { id: string; month: number; year: number };
  setSearch: Dispatch<SetStateAction<{ id: string; month: number; year: number }>>;
  yearArray: number[];
}) {
  return (
    <>
      <div className="flex items-center gap-4 flex-wrap">
        <Select
          onValueChange={(newValue) => {
            setSearch(({ year }) => ({ id: "", month: Number(newValue), year }));
          }}
          value={search.month.toString()}
        >
          <SelectTrigger className="w-24 capitalize">
            <SelectValue placeholder="Mois" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 12 }).map((_, index) => (
              <SelectItem key={index} value={index.toString()} className="capitalize">
                {getMonthName(index)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          onValueChange={(newValue) => {
            setSearch(({ month }) => ({ id: "", month, year: Number(newValue) }));
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
        onChange={(e) => setSearch(({ month, year }) => ({ id: e.target.value, month, year }))}
        placeholder="Rechercher par numéro de commande"
        className="max-w-64 my-4"
      />
    </>
  );
}
