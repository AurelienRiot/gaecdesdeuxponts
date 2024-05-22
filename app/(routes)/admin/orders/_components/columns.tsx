"use client";

import { DataInvoiceType } from "@/components/pdf/data-invoice";
import { DisplayInvoice } from "@/components/pdf/pdf-button";
import { ProductCell } from "@/components/table-custom-fuction/cell-orders";
import {
  DateCell,
  NameCell,
} from "@/components/table-custom-fuction/common-cell";
import {
  FilterAllInclude,
  FilterOneInclude,
} from "@/components/table-custom-fuction/common-filter";
import { CreatedAtHeader } from "@/components/table-custom-fuction/common-header";
import { DatePickUpHeader } from "@/components/table-custom-fuction/header-orders";
import { Button } from "@/components/ui/button";
import {
  DataTableFilterableColumn,
  DataTableSearchableColumn,
  DataTableViewOptionsColumn,
} from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { CellAction } from "./cell-action";

export type OrderColumn = {
  id: string;
  userId: string;
  name: string;
  isPaid: boolean;
  datePickUp: Date;
  totalPrice: string;
  products: string;
  status: "En cours de validation" | "Validé" | "Payé";
  productsList: { name: string; quantity?: string; unit?: string }[];
  shopName: string;
  shopId: string;
  createdAt: Date;
  dataInvoice: DataInvoiceType;
};

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "products",
    header: "Produits",
    cell: ProductCell,
    filterFn: FilterAllInclude,
  },
  {
    accessorKey: "name",
    header: "Nom",
    cell: ({ row }) => (
      <NameCell
        name={row.original.name}
        url={`/admin/users/${row.original.userId}`}
      />
    ),
  },
  {
    accessorKey: "status",
    header: "Statut",
  },
  {
    accessorKey: "totalPrice",
    header: "Prix Total",
  },
  {
    accessorKey: "dataInvoice",
    header: "Facture",
    id: "pdf",
    cell: ({ row }) => {
      return row.original.status === "En cours de validation" ? (
        <Button asChild variant={"link"} className="px-0">
          <Link href={`/admin/orders/${row.original.id}`}>
            Éditer le bon de livraison
          </Link>
        </Button>
      ) : (
        <DisplayInvoice
          isPaid={row.original.status === "Payé"}
          data={row.original.dataInvoice}
        />
      );
    },
  },
  {
    accessorKey: "datePickUp",
    header: DatePickUpHeader,
    cell: ({ row }) => <DateCell date={row.original.datePickUp} />,
  },
  {
    accessorKey: "shopName",
    header: "Lieu de retrait",
    cell: ({ row }) =>
      row.original.shopName !== "Livraison à domicile" ? (
        <NameCell
          name={row.original.shopName}
          url={`/admin/shops/${row.original.shopId}`}
        />
      ) : (
        <Button variant={"ghost"} className="cursor-default px-0">
          {row.original.shopName}
        </Button>
      ),
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

  return [
    {
      id: "products",
      title: "Produits",
      options: prodArray,
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
    id: "totalPrice",
    title: "Prix",
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
