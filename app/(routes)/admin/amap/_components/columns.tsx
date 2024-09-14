"use client";

import { ProductCell } from "@/components/table-custom-fuction/cell-orders";
import { NameCell } from "@/components/table-custom-fuction/common-cell";
import { FilterAllInclude, FilterOneInclude } from "@/components/table-custom-fuction/common-filter";
import { Button } from "@/components/ui/button";
import { dateFormatter, getDaysInFuture, getNextDay, getRelativeDate } from "@/lib/date-utils";
import { currencyFormatter } from "@/lib/utils";
import type { DataTableFilterableColumn, DataTableViewOptionsColumn } from "@/types";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { CellAction } from "./cell-action";

export type AMAPColumn = {
  id: string;
  userId: string;
  name: string;
  // isPaid: boolean;
  shippingDays: Date[];
  shippedDays: Date[];
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
    cell: ({ row }) => {
      const daysInfuture = getDaysInFuture(row.original.shippingDays);
      const nextDay = getNextDay(daysInfuture);

      return (
        <Button asChild variant={"link"} className="px-0 font-bold flex flex-col justify-start h-auto">
          <Link href={`/admin/amap/${row.original.id}`}>
            {nextDay ? (
              <>
                <p className="text-left whitespace-nowrap">Prochaine livraison {getRelativeDate(nextDay)}</p>
                <p>
                  {daysInfuture.length} livraison{daysInfuture.length > 1 && "s"} restante
                  {daysInfuture.length > 1 && "s"}
                </p>
              </>
            ) : (
              "Aucune livraison"
            )}
            <p>
              {row.original.shippedDays.length} livraison{row.original.shippedDays.length > 1 && "s"} éffectuée
            </p>
          </Link>
        </Button>
      );
    },
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
      const daysInfuture = getDaysInFuture(row.original.shippingDays);
      const nextDay = getNextDay(daysInfuture);
      if (!nextDay) {
        return <p>Toutes les livraisons sont passées</p>;
      }
      return <p className="text-left whitespace-nowrap">{dateFormatter(nextDay, { days: true })}</p>;
    },
  },
  {
    accessorKey: "startDate",
    header: "Début/fin du contrat",
    cell: ({ row }) => (
      <p className="text-left flex flex-col">
        <span className="whitespace-nowrap">{dateFormatter(row.original.startDate, { days: true })}</span>
        <span className="whitespace-nowrap">{dateFormatter(row.original.endDate, { days: true })}</span>
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
