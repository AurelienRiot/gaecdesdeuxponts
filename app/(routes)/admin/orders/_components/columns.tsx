"use client";

import {
  AdminShopNameCell,
  OrderIdCell,
  ProductCell,
  StatusCell,
  statusArray,
  type Status,
} from "@/components/table-custom-fuction/cell-orders";
import { DateCell, NameCell } from "@/components/table-custom-fuction/common-cell";
import { FilterAllInclude, FilterOneInclude } from "@/components/table-custom-fuction/common-filter";
import { CreatedAtHeader } from "@/components/table-custom-fuction/common-header";
import { DatePickUpHeader, ShopNameHeader } from "@/components/table-custom-fuction/header-orders";
import type { DataTableFilterableColumn, DataTableSearchableColumn, DataTableViewOptionsColumn } from "@/types";
import type { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { getRelativeDate } from "@/lib/date-utils";

export type OrderColumn = {
  id: string;
  image: string | null;
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
  shippingEmail: Date | null;
  invoiceEmail: Date | null;
  createdAt: Date;
};

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "id",
    header: "Commande",
    cell: ({ row }) => (
      <>
        <OrderIdCell
          id={row.original.id}
          shippingEmail={row.original.shippingEmail}
          invoiceEmail={row.original.invoiceEmail}
        />
        <StatusCell status={row.original.status} />
      </>
    ),
  },
  {
    accessorKey: "name",
    header: "Client",
    cell: ({ row }) => (
      <NameCell image={row.original.image} name={row.original.name} url={`/admin/users/${row.original.userId}`} />
    ),
    filterFn: FilterOneInclude,
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
    accessorKey: "datePickUp",
    header: DatePickUpHeader,
    cell: ({ row }) => (
      <div>
        <DateCell date={row.original.datePickUp} days={true} />
        <span>{`${getRelativeDate(row.original.datePickUp)}`}</span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => <StatusCell status={row.original.status} />,
    filterFn: FilterOneInclude,
  },
  {
    accessorKey: "shopName",
    header: ShopNameHeader,
    cell: ({ row }) => <AdminShopNameCell shopName={row.original.shopName} shopId={row.original.shopId} />,
    filterFn: FilterOneInclude,
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

export const filterableColumns = ({
  products,
  shopsName,
  userNames,
}: {
  products: string[];
  shopsName: string[];
  userNames: string[];
}): DataTableFilterableColumn<OrderColumn>[] => {
  const prodArray = products.map((item) => ({
    label: item,
    value: item,
  }));
  const shopArray = shopsName.map((item) => ({
    label: item,
    value: item,
  }));

  const userArray = userNames.map((item) => ({
    label: item,
    value: item,
  }));

  return [
    {
      id: "name",
      title: "Client",
      options: userArray,
    },
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
    id: "actions" as keyof OrderColumn,
    title: "Actions",
  },
];
