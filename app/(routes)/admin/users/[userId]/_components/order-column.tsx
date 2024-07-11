"use client";

import {
  AdminShopNameCell,
  OrderIdCell,
  ProductCell,
  type Status,
} from "@/components/table-custom-fuction/cell-orders";
import { DateCell, NameCell } from "@/components/table-custom-fuction/common-cell";
import { FilterAllInclude, FilterOneInclude } from "@/components/table-custom-fuction/common-filter";
import { CreatedAtHeader } from "@/components/table-custom-fuction/common-header";
import { DatePickUpHeader, ShopNameHeader } from "@/components/table-custom-fuction/header-orders";
import { Button } from "@/components/ui/button";
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
    header: "Facture",
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
    filterFn: FilterOneInclude,
  },
  {
    accessorKey: "datePickUp",
    header: DatePickUpHeader,
    cell: ({ row }) => <DateCell date={row.original.datePickUp} />,
  },
  {
    accessorKey: "shopName",
    header: ShopNameHeader,
    cell: ({ row }) => <AdminShopNameCell shopName={row.original.shopName} shopId={row.original.shopId} />,
    filterFn: FilterOneInclude,
  },
  {
    accessorKey: "createdAt",
    header: CreatedAtHeader,
    cell: ({ row }) => <DateCell date={row.original.createdAt} />,
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
  const statutsArray: { label: Status; value: Status }[] = [
    { label: "En cours de validation", value: "En cours de validation" },
    { label: "Commande valide", value: "Commande valide" },
    { label: "En cours de paiement", value: "En cours de paiement" },
    { label: "Payé", value: "Payé" },
  ];

  return [
    {
      id: "products",
      title: "Produits",
      options: prodArray,
    },
    {
      id: "status",
      title: "Statut",
      options: statutsArray,
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
    id: "createdAt",
    title: "Date de création",
  },
  {
    id: "actions" as keyof OrderColumn,
    title: "Actions",
  },
];
