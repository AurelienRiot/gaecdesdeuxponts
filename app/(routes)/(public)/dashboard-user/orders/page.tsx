"use client";

import { DataTableSkeleton } from "@/components/skeleton-ui/data-table-skeleton";
import {
  createDatePickUp,
  createProduct,
  createProductList,
  createStatus,
} from "@/components/table-custom-fuction/cell-orders";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useUserContext } from "@/context/user-context";
import useServerAction from "@/hooks/use-server-action";
import { getMonthName } from "@/lib/date-utils";
import { currencyFormatter } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import sendCheckoutEmail from "./_actions/send-chekout-email";
import { OrdersColumn, filterableColumns, viewOptionsColumns, type OrderColumnType } from "./_components/order-column";

const PageOrderTable = () => {
  const { user } = useUserContext();
  const { serverAction } = useServerAction(sendCheckoutEmail);

  const searchParams = useSearchParams();

  if (!user) {
    return (
      <div className="w-full space-y-4 p-6">
        <Heading title={`Commandes `} description="Résumé des commandes" />
        <Separator />
        <DataTableSkeleton columnCount={6} filterableColumnCount={2} searchableColumnCount={1} />
      </div>
    );
  }

  const formattedOrders: OrderColumnType[] = (user.orders || []).map((order) => ({
    id: order.id,
    productsList: createProductList(order.orderItems),
    products: createProduct(order.orderItems),
    totalPrice: currencyFormatter.format(order.totalPrice),
    status: createStatus(order),
    datePickUp: createDatePickUp({ dateOfShipping: order.dateOfShipping, datePickUp: order.datePickUp }),
    shopName: order.shop?.name || "Livraison à domicile",
    shop: order.shop || undefined,
    createdAt: order.createdAt,
  }));

  useEffect(() => {
    async function sendCheckoutEmail() {
      const orderId = searchParams.get("orderId");
      if (orderId) {
        const order = user?.orders.find((order) => order.id === searchParams.get("orderId"));
        if (order && !order.orderEmail) {
          await serverAction({ data: { orderId } });
        }
      }
    }

    sendCheckoutEmail();
  }, []);

  const yearSet = new Set(formattedOrders.map((order) => new Date(order.createdAt).getFullYear()));
  const yearArray = Array.from(yearSet);

  return <FilterOrders formattedOrders={formattedOrders} yearArray={yearArray} />;
};

export default PageOrderTable;

const FilterOrders = ({ formattedOrders, yearArray }: { formattedOrders: OrderColumnType[]; yearArray: number[] }) => {
  const [search, setSearch] = useState({ id: "", month: new Date().getMonth(), year: new Date().getFullYear() });

  const filteredOrders = formattedOrders
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
        title={`Commandes de ${getMonthName(search.month)} ${search.year} (${filteredOrders.length})`}
        description="Résumé des commandes"
      />
      <Separator />
      <SearchOrders search={search} yearArray={yearArray} setSearch={setSearch} />
      <DataTable
        data={filteredOrders}
        columns={OrdersColumn}
        filterableColumns={filterableColumns()}
        viewOptionsColumns={viewOptionsColumns}
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
        className="max-w-64"
      />
    </>
  );
}
