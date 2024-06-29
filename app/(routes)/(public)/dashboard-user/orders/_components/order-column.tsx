"use client";

import { ShopCard } from "@/components/display-shops/shop-card";
import { ProductCell, type Status } from "@/components/table-custom-fuction/cell-orders";
import { DateCell } from "@/components/table-custom-fuction/common-cell";
import { FilterOneInclude } from "@/components/table-custom-fuction/common-filter";
import { DatePickUpHeader } from "@/components/table-custom-fuction/header-orders";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { DataTableFilterableColumn, DataTableSearchableColumn, DataTableViewOptionsColumn } from "@/types";
import type { Shop } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
import { Search } from "lucide-react";

export type OrderColumnType = {
  id: string;
  datePickUp: Date;
  totalPrice: string;
  products: string;
  status: Status;
  productsList: { name: string; quantity?: string; unit?: string }[];
  createdAt: Date;
  shopName: string;
  shop?: Shop;
};
export const OrdersColumn: ColumnDef<OrderColumnType>[] = [
  {
    accessorKey: "products",
    header: "Produits",
    cell: ProductCell,
  },
  {
    accessorKey: "id",
    header: "Prix total",
    cell: ({ row }) => row.original.totalPrice,
  },
  {
    accessorKey: "status",
    header: "Statut",
    filterFn: FilterOneInclude,
  },
  // {
  //   accessorKey: "id",
  //   header: "Facture",
  //   cell: ({ row }) => {
  //     return row.original.status === "En cours de validation" ? (
  //       "Non disponible"
  //     ) : (
  //       <DisplayInvoice orderId={row.original.id} />
  //     );
  //   },
  // },
  {
    accessorKey: "datePickUp",
    header: DatePickUpHeader,
    cell: ({ row }) => <DateCell date={row.original.datePickUp} hours />,
  },
  {
    accessorKey: "shopName",
    header: "Lieu de retrait",
    cell: ({ row }) =>
      row.original.shop ? (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"linkHover2"}
              className="justify-left flex flex-row items-center gap-2 whitespace-nowrap px-0 after:w-full hover:text-primary"
            >
              <Search className="h-4 w-4 flex-shrink-0" />

              {row.getValue("shopName")}
            </Button>
          </PopoverTrigger>
          <PopoverContent asChild align="center" side="top">
            <ShopCard
              className="min-w-[500px]"
              display="profile"
              shop={row.original.shop}
              coordinates={{ lat: undefined, long: undefined }}
            />
          </PopoverContent>
        </Popover>
      ) : (
        <Button variant={"ghost"} className="cursor-default px-0">
          {"Livraison à domicile"}
        </Button>
      ),
  },
];

export const filterableColumns = (): DataTableFilterableColumn<OrderColumnType>[] => {
  const statutsArray: { label: Status; value: Status }[] = [
    { label: "En cours de validation", value: "En cours de validation" },
    { label: "Commande valide", value: "Commande valide" },
    { label: "En cours de paiement", value: "En cours de paiement" },
    { label: "Payé", value: "Payé" },
  ];
  return [
    {
      id: "status",
      title: "Statut",
      options: statutsArray,
    },
  ];
};

export const searchableColumns: DataTableSearchableColumn<OrderColumnType>[] = [
  {
    id: "id",
    title: "Numéro de commande",
  },
  {
    id: "products",
    title: "Produits",
  },
];

export const viewOptionsColumns: DataTableViewOptionsColumn<OrderColumnType>[] = [
  {
    id: "products",
    title: "Produits",
  },
  {
    id: "id",
    title: "Prix",
  },

  {
    id: "status",
    title: "Statut",
  },
  // {
  //   id: "id",
  //   title: "Facture",
  // },
  {
    id: "datePickUp",
    title: "Date de livraison",
  },

  {
    id: "shopName",
    title: "Lieu de retrait",
  },
];
