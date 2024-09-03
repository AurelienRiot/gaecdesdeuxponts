"use client";

import {
  AdminShopNameCell,
  OrderIdCell,
  ProductCell,
  StatusCell,
  statusArray,
  type Status,
} from "@/components/table-custom-fuction/cell-orders";
import { DateCell } from "@/components/table-custom-fuction/common-cell";
import { FilterAllInclude, FilterOneInclude } from "@/components/table-custom-fuction/common-filter";
import { DatePickUpHeader, ShopNameHeader } from "@/components/table-custom-fuction/header-orders";
import type { DataTableFilterableColumn, DataTableSearchableColumn, DataTableViewOptionsColumn } from "@/types";
import type { ColumnDef } from "@tanstack/react-table";
import { OrderCellAction } from "./order-cell-action";

export type OrderColumn = {
  id: string;
  isPaid: boolean;
  status: Status;
  datePickUp: Date;
  totalPrice: string;
  products: string;
  productsList: { name: string; quantity?: string; unit?: string }[];
  createdAt: Date;
  shopName: string;
  shippingEmail: Date | null;
  invoiceEmail: Date | null;
  shopId: string;
};
export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "id",
    header: "Commande",
    cell: ({ row }) => (
      <OrderIdCell
        id={row.original.id}
        shippingEmail={row.original.shippingEmail}
        invoiceEmail={row.original.invoiceEmail}
      />
    ),
  },
  {
    accessorKey: "products",
    header: "Produits",
    cell: ProductCell,
    filterFn: FilterAllInclude,
  },
  {
    accessorKey: "totalPrice",
    header: "Prix total",
  },

  {
    accessorKey: "status",
    header: "Statut",
    cell: StatusCell,
    filterFn: FilterOneInclude,
  },
  {
    accessorKey: "datePickUp",
    header: DatePickUpHeader,
    cell: ({ row }) => <DateCell date={row.original.datePickUp} days={true} />,
  },
  {
    accessorKey: "shopName",
    header: ShopNameHeader,
    cell: ({ row }) => <AdminShopNameCell shopName={row.original.shopName} shopId={row.original.shopId} />,
    filterFn: FilterOneInclude,
  },

  {
    id: "actions",
    cell: ({ row }) => <OrderCellAction data={row.original} />,
  },
];

export const searchableColumns: DataTableSearchableColumn<OrderColumn>[] = [
  {
    id: "id",
    title: "numéro de commande",
  },
];

export const filterableColumns = ({
  products,
  shopsName,
}: {
  products: string[];
  shopsName: string[];
}): DataTableFilterableColumn<OrderColumn>[] => {
  const prodArray = products.map((item) => ({
    label: item,
    value: item,
  }));
  const shopArray = shopsName.map((item) => ({
    label: item,
    value: item,
  }));

  return [
    {
      id: "products",
      title: "Produits",
      options: prodArray,
    },
    {
      id: "status",
      title: "Statut",
      options: statusArray,
    },
    {
      id: "shopName",
      title: "Lieu de retrait",
      options: shopArray,
    },
  ];
};

export const viewOptionsColumns: DataTableViewOptionsColumn<OrderColumn>[] = [
  {
    id: "products",
    title: "Produits",
  },

  {
    id: "totalPrice",
    title: "Prix",
  },

  {
    id: "id",
    title: "Facture",
  },
  {
    id: "status",
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

  {
    id: "actions" as keyof OrderColumn,
    title: "Actions",
  },
];
