"use client";

import { ShopCard } from "@/components/display-shops/shop-card";
import { DataInvoiceType } from "@/components/pdf/data-invoice";
import DisplayPDF from "@/components/pdf/pdf-button";
import { DatePickUpCell } from "@/components/table-custom-fuction/cell-orders";
import { DatePickUpHeader } from "@/components/table-custom-fuction/header-orders";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Shop } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Search } from "lucide-react";

export type OrderColumnType = {
  id: string;
  isPaid: boolean;
  datePickUp: Date;
  totalPrice: string;
  products: string;
  createdAt: Date;
  shopName: string;
  shop: Shop;
  dataInvoice: DataInvoiceType;
};
export const OrdersColumn: ColumnDef<OrderColumnType>[] = [
  {
    accessorKey: "products",
    header: "Produits",
  },
  {
    accessorKey: "totalPrice",
    header: "Prix total",
  },
  {
    accessorKey: "isPaid",
    header: "Facture",
    id: "pdf",
    cell: ({ row }) => (
      <>
        {!row.original.isPaid ? (
          "Non disponible"
        ) : (
          <DisplayPDF data={row.original.dataInvoice} />
        )}
      </>
    ),
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
  },
  {
    accessorKey: "datePickUp",
    header: DatePickUpHeader,
    cell: DatePickUpCell,
  },
  {
    accessorKey: "shopName",
    header: "Lieu de retrait",
    cell: ({ row }) => (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"linkHover2"}
            className="justify-left flex flex-row items-center gap-2 px-0 after:w-full hover:text-primary"
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
