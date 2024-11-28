"use client";

import { DisplayUserShippingOrder } from "@/components/pdf/button/display-user-shipping-order";
import { ProductCell, StatusCell, statusArray } from "@/components/table-custom-fuction/cell-orders";
import { DateCell } from "@/components/table-custom-fuction/common-cell";
import { DatePickUpHeader } from "@/components/table-custom-fuction/header-orders";
import { useUserQuery, type ProfileUserType } from "@/hooks/use-query/user-query";
import type { DataTableFilterableColumn, DataTableSearchableColumn, DataTableViewOptionsColumn } from "@/types";
import type { ColumnDef } from "@tanstack/react-table";

export const OrdersColumn: ColumnDef<ProfileUserType["orders"][number]>[] = [
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
    header: "Prix total (TTC)",
    cell: ({ row }) => row.original.totalPrice,
  },
  {
    accessorKey: "delivered",
    header: () => {
      const { data: user } = useUserQuery();
      if (user?.role !== "pro") {
        return null;
      }
      return "Bon de livraison";
    },
    cell: ({ row }) => {
      const { data: user } = useUserQuery();
      if (user?.role !== "pro") {
        return null;
      }
      if (row.original.delivered) {
        return <DisplayUserShippingOrder orderId={row.original.id} />;
      }
      return "Commande en attente de livraison";
    },
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

export const filterableColumns = (): DataTableFilterableColumn<ProfileUserType["orders"][number]>[] => {
  return [
    {
      id: "status",
      title: "Statut",
      options: statusArray,
    },
  ];
};

export const searchableColumns: DataTableSearchableColumn<ProfileUserType["orders"][number]>[] = [
  {
    id: "id",
    title: "numéro de commande",
  },
];

export const viewOptionsColumns: DataTableViewOptionsColumn<ProfileUserType["orders"][number]>[] = [
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
];
