"use client";

import { ShopCard } from "@/components/display-shops/shop-card";
import { DataInvoiceType } from "@/components/pdf/data-invoice";
import {
  FactureCell,
  ProductCell,
} from "@/components/table-custom-fuction/cell-orders";
import { DateCell } from "@/components/table-custom-fuction/common-cell";
import { FilterOneInclude } from "@/components/table-custom-fuction/common-filter";
import { DatePickUpHeader } from "@/components/table-custom-fuction/header-orders";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DataTableFilterableColumn,
  DataTableSearchableColumn,
  DataTableViewOptionsColumn,
} from "@/types";
import { Shop } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Search } from "lucide-react";

export type OrderColumnType = {
  id: string;
  isPaid: boolean;
  datePickUp: Date;
  totalPrice: string;
  products: string;
  productsList: { name: string; quantity?: string }[];
  createdAt: Date;
  shopName: string;
  shop: Shop;
  dataInvoice: DataInvoiceType;
};
export const OrdersColumn: ColumnDef<OrderColumnType>[] = [
  {
    accessorKey: "products",
    header: "Produits",
    cell: ProductCell,
  },
  {
    accessorKey: "totalPrice",
    header: "Prix total",
  },
  {
    accessorKey: "isPaid",
    header: "Facture",
    id: "pdf",
    cell: FactureCell,
  },
  {
    accessorKey: "isPaid",
    header: "Payé",
    cell: ({ row }) => (
      <Checkbox
        className="cursor-default self-center"
        checked={row.original.isPaid}
      />
    ),
    filterFn: FilterOneInclude,
  },
  {
    accessorKey: "datePickUp",
    header: DatePickUpHeader,
    cell: ({ row }) => <DateCell date={row.original.datePickUp} />,
  },
  {
    accessorKey: "shopName",
    header: "Lieu de retrait",
    cell: ({ row }) => (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"linkHover2"}
            className="justify-left flex flex-row items-center gap-2 whitespace-nowrap px-0 after:w-full hover:text-primary"
          >
            <Search className=" h-4 w-4 flex-shrink-0" />

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
    ),
  },
];

export const filterableColumns: DataTableFilterableColumn<OrderColumnType>[] = [
  {
    id: "isPaid",
    title: "Status",
    options: [
      { label: "Payé", value: "true" },
      { label: "Non Payé", value: "false" },
    ],
  },
];

export const searchableColumns: DataTableSearchableColumn<OrderColumnType>[] = [
  {
    id: "products",
    title: "Produits",
  },
  {
    id: "totalPrice",
    title: "Prix",
  },
];

export const viewOptionsColumns: DataTableViewOptionsColumn<OrderColumnType>[] =
  [
    {
      id: "products",
      title: "Produits",
    },
    {
      id: "totalPrice",
      title: "Prix",
    },

    {
      id: "pdf" as keyof OrderColumnType,
      title: "Facture",
    },
    {
      id: "isPaid",
      title: "Status",
    },
    {
      id: "datePickUp",
      title: "Date de livraison",
    },

    {
      id: "shopName",
      title: "Lieu de retrait",
    },
  ];
