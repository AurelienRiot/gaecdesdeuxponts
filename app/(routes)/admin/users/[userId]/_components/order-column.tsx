"use client";

import { DataInvoiceType } from "@/components/pdf/data-invoice";
import {
  FactureCell,
  ProductCell,
} from "@/components/table-custom-fuction/cell-orders";
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
import { DataTableFilterableColumn, DataTableViewOptionsColumn } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { OrderCellAction } from "./order-cell-action";

export type OrderColumn = {
  id: string;
  isPaid: boolean;
  status: "En cours de validation" | "Validé" | "Payé";
  datePickUp: Date;
  totalPrice: string;
  products: string;
  productsList: { name: string; quantity?: string; unit?: string }[];
  createdAt: Date;
  shopName: string;
  shopId: string;
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
    accessorKey: "totalPrice",
    header: "Prix total",
  },
  {
    accessorKey: "isPaid",
    header: "Facture",
    cell: FactureCell,
  },
  {
    accessorKey: "status",
    header: "Statut",
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
    cell: ({ row }) => <OrderCellAction data={row.original} />,
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
    id: "isPaid",
    title: "Facture",
  },
  {
    id: "isPaid",
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
