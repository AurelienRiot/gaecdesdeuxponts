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
import type { DataTableFilterableColumn, DataTableSearchableColumn, DataTableViewOptionsColumn } from "@/types";
import type { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type OrderColumn = {
  id: string;
  userId: string;
  name: string;
  isPaid: boolean;
  datePickUp: Date;
  totalPrice: string;
  products: string;
  status: Status;
  productsList: { name: string; quantity?: string; unit?: string }[];
  shopName: string;
  shopId: string;
  createdAt: Date;
};

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "id",
    header: "Facture",
    cell: ({ row }) => <OrderIdCell id={row.original.id} />,
  },
  {
    accessorKey: "name",
    header: "Nom",
    cell: ({ row }) => <NameCell name={row.original.name} url={`/admin/users/${row.original.userId}`} />,
  },
  {
    accessorKey: "products",
    header: "Produits",
    cell: ProductCell,
    filterFn: FilterAllInclude,
  },

  {
    accessorKey: "status",
    header: "Statut",
    filterFn: FilterOneInclude,
  },
  {
    accessorKey: "totalPrice",
    header: "Prix Total",
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
    cell: ({ row }) => <CellAction data={row.original} />,
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

export const searchableColumns: DataTableSearchableColumn<OrderColumn>[] = [
  {
    id: "name",
    title: "Nom",
  },
  {
    id: "id",
    title: "numéro de commande",
  },
];

export const viewOptionsColumns: DataTableViewOptionsColumn<OrderColumn>[] = [
  {
    id: "products",
    title: "Produits",
  },
  {
    id: "name",
    title: "Nom",
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
