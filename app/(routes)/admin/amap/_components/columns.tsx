"use client";

import { AdminShopNameCell, OrderIdCell, ProductCell } from "@/components/table-custom-fuction/cell-orders";
import { NameCell } from "@/components/table-custom-fuction/common-cell";
import { FilterAllInclude, FilterOneInclude } from "@/components/table-custom-fuction/common-filter";
import { ShopNameHeader } from "@/components/table-custom-fuction/header-orders";
import type { DataTableFilterableColumn, DataTableViewOptionsColumn } from "@/types";
import type { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { dateFormatter } from "@/lib/date-utils";
import { currencyFormatter } from "@/lib/utils";

export type AMAPColumn = {
  id: string;
  userId: string;
  name: string;
  // isPaid: boolean;
  shippingDays: Date[];
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  totalPaid: number;
  products: string;
  productsList: { name: string; quantity?: string; unit?: string }[];
  shopName: string;
  shopId: string;
};

export const columns: ColumnDef<AMAPColumn>[] = [
  {
    accessorKey: "id",
    header: "Contrat AMAP",
    cell: ({ row }) => (
      <Button asChild variant={"link"} className="px-0 font-bold flex flex-col justify-start h-auto">
        <Link href={`/admin/amap/${row.original.id}`}>
          <p className="whitespace-nowrap mr-auto">Éditer le contrat</p>
        </Link>
      </Button>
    ),
  },
  {
    accessorKey: "name",
    header: "Client",
    cell: ({ row }) => <NameCell name={row.original.name} url={`/admin/users/${row.original.userId}`} />,
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
    cell: ({ row }) => currencyFormatter.format(row.original.totalPrice),
  },
  {
    accessorKey: "totalPaid",
    header: "Total payé",
    cell: ({ row }) => currencyFormatter.format(row.original.totalPaid),
  },
  {
    accessorKey: "shippingDays",
    header: "Prochaine livraison",
    cell: ({ row }) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const closestFutureDate = row.original.shippingDays.reduce((a, b) => {
        const aIsFuture = a.getTime() >= today.getTime();
        const bIsFuture = b.getTime() >= today.getTime();
        if (!aIsFuture) return b;
        if (!bIsFuture) return a;
        return a.getTime() < b.getTime() ? a : b;
      });
      return <p className="text-left">{dateFormatter(closestFutureDate, { days: true })}</p>;
    },
  },
  {
    accessorKey: "startDate",
    header: "Début/fin du contrat",
    cell: ({ row }) => (
      <p className="text-left flex flex-col">
        <span>{dateFormatter(row.original.startDate, { days: true })}</span>
        <span>{dateFormatter(row.original.endDate, { days: true })}</span>
      </p>
    ),
  },
  {
    accessorKey: "shopName",
    header: "Nom de l'AMAP",
    cell: ({ row }) => <NameCell name={row.original.shopName} url={`/admin/shops/${row.original.shopId}`} />,
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
}): DataTableFilterableColumn<AMAPColumn>[] => {
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
      id: "shopName",
      title: "Nom de l'AMAP",
      options: shopArray,
    },
  ];
};

export const viewOptionsColumns: DataTableViewOptionsColumn<AMAPColumn>[] = [
  {
    id: "id",
    title: "Contrat AMAP",
  },
  {
    id: "name",
    title: "Client",
  },
  {
    id: "products",
    title: "Produits",
  },
  {
    id: "totalPrice",
    title: "Prix total",
  },
  {
    id: "totalPaid",
    title: "Total payé",
  },

  {
    id: "shopName",
    title: "Nom de l'AMAP",
  },

  {
    id: "actions" as keyof AMAPColumn,
    title: "Actions",
  },
];
