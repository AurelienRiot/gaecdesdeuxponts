"use client";

import { DataTableSkeleton } from "@/components/skeleton-ui/data-table-skeleton";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useUserQuery, type ProfileUserType } from "@/hooks/use-query/user-query";
import useServerAction from "@/hooks/use-server-action";
import { getMonthNumber } from "@/lib/date-utils";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import sendCheckoutEmail from "./_actions/send-chekout-email";
import { OrdersColumn } from "./_components/order-column";

const PageOrderTable = () => {
  const { data: user } = useUserQuery();
  const { serverAction } = useServerAction(sendCheckoutEmail);
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const order = user?.orders.find((order) => order.id === orderId);

  useEffect(() => {
    const sendCheckoutEmail = async () => {
      if (orderId && order && !order.orderEmail) {
        await serverAction({ data: { orderId } });
      }
    };

    sendCheckoutEmail();
  }, [orderId, order, serverAction]);

  if (!user) {
    return (
      <div className="w-full space-y-4 p-6">
        <Heading title={`Commandes `} description="Résumé des commandes" />
        <Separator />
        <DataTableSkeleton columnCount={5} />
      </div>
    );
  }

  const yearSet = new Set(user.orders.map((order) => new Date(order.createdAt).getFullYear()));
  const yearArray = Array.from(yearSet);

  return <FilterOrders orders={user.orders} yearArray={yearArray} />;
};

export default PageOrderTable;

const FilterOrders = ({ orders, yearArray }: { orders: ProfileUserType["orders"]; yearArray: number[] }) => {
  const [search, setSearch] = useState({ id: "", month: new Date().getMonth(), year: new Date().getFullYear() });

  const filteredOrders = orders
    .filter((order) => {
      if (search.id) {
        return order.id.toLowerCase().includes(search.id.toLowerCase());
      }
      const month = new Date(order.datePickUp).getMonth();
      const year = new Date(order.datePickUp).getFullYear();
      return month === search.month && year === search.year;
    })
    .sort((a, b) => new Date(b.datePickUp).getTime() - new Date(a.datePickUp).getTime());

  return (
    <div className="w-full space-y-4 p-6">
      <Heading
        title={`Commandes de ${getMonthNumber(search.month)} ${search.year} (${filteredOrders.length})`}
        description="Résumé des commandes"
      />
      <Separator />
      <SearchOrders search={search} yearArray={yearArray} setSearch={setSearch} />
      <DataTable
        data={filteredOrders}
        columns={OrdersColumn}
        // filterableColumns={filterableColumns()}
        // viewOptionsColumns={viewOptionsColumns}
      />
    </div>
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
                {getMonthNumber(index)}
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
        className="max-w-64"
      />
    </>
  );
}
