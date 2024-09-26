"use client";

import { DisplayUserShippingOrder } from "@/components/pdf/button/display-user-shipping-order";
import {
  ProductCell,
  ShopNameCell,
  StatusCell,
  statusArray,
  type Status,
} from "@/components/table-custom-fuction/cell-orders";
import { DateCell } from "@/components/table-custom-fuction/common-cell";
import { FilterOneInclude } from "@/components/table-custom-fuction/common-filter";
import { DatePickUpHeader, ShopNameHeader } from "@/components/table-custom-fuction/header-orders";
import type { DataTableFilterableColumn, DataTableSearchableColumn, DataTableViewOptionsColumn } from "@/types";
import type { Shop } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
import { useSession } from "next-auth/react";

export type OrderColumnType = {
  id: string;
  datePickUp: Date;
  totalPrice: string;
  products: string;
  status: Status;
  productsList: { name: string; quantity?: string; unit?: string }[];
  createdAt: Date;
  delivered: boolean;
  shopName: string;
  shop?: Shop;
};
export const OrdersColumn: ColumnDef<OrderColumnType>[] = [
  {
    accessorKey: "status",
    header: "N° de commande",
    cell: ({ row }) => (
      <div className="flex flex-col justify-center items-start gap-2">
        <span className="whitespace-nowrap">{row.original.id}</span>
        <StatusCell status={row.original.status} />
      </div>
    ),
  },
  {
    accessorKey: "products",
    header: "Produits",
    cell: ProductCell,
  },
  {
    accessorKey: "totalPrice",
    header: "Prix total",
    cell: ({ row }) => row.original.totalPrice,
  },
  {
    accessorKey: "delivered",
    header: () => {
      const session = useSession();
      if (session?.data?.user.role !== "pro") {
        return null;
      }
      return "Bon de livraison";
    },
    cell: ({ row }) => {
      const session = useSession();
      if (session.data?.user?.role !== "pro") {
        return null;
      }
      if (row.original.delivered) {
        return <DisplayUserShippingOrder orderId={row.original.id} />;
      }
      return "Commande en attente de livraison";
    },
    filterFn: FilterOneInclude,
  },
  {
    accessorKey: "datePickUp",
    header: DatePickUpHeader,
    cell: ({ row }) => <DateCell date={row.original.datePickUp} />,
  },
  // {
  //   accessorKey: "shopName",
  //   header: ShopNameHeader,
  //   cell: ({ row }) => <ShopNameCell shopName={row.original.shopName} shop={row.original.shop} />,
  // },
];

export const filterableColumns = (): DataTableFilterableColumn<OrderColumnType>[] => {
  return [
    {
      id: "status",
      title: "Statut",
      options: statusArray,
    },
  ];
};

export const searchableColumns: DataTableSearchableColumn<OrderColumnType>[] = [
  {
    id: "id",
    title: "numéro de commande",
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

  {
    id: "datePickUp",
    title: "Date de livraison",
  },

  {
    id: "shopName",
    title: "Lieu de retrait",
  },
];
