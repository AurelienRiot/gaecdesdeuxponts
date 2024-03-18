"use client";

import { DataInvoiceType } from "@/components/pdf/data-invoice";
import {
  FactureCell,
  ProductCell,
} from "@/components/table-custom-fuction/cell-orders";
import {
  CheckboxCell,
  DateCell,
  NameCell,
} from "@/components/table-custom-fuction/common-cell";
import {
  FilterAllInclude,
  FilterOneInclude,
} from "@/components/table-custom-fuction/common-filter";
import { CreatedAtHeader } from "@/components/table-custom-fuction/common-header";
import { DatePickUpHeader } from "@/components/table-custom-fuction/header-orders";
import {
  DataTableFilterableColumn,
  DataTableSearchableColumn,
  DataTableViewOptionsColumn,
} from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { changeStatus } from "./server-action";

export type OrderColumn = {
  id: string;
  userId: string;
  name: string;
  isPaid: boolean;
  datePickUp: Date;
  totalPrice: string;
  products: string;
  productsList: { name: string; quantity?: string }[];
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
    accessorKey: "totalPrice",
    header: "Prix Total",
  },
  {
    accessorKey: "isPaid",
    header: "Facture",
    id: "pdf",
    cell: FactureCell,
  },
  {
    accessorKey: "isPaid",
    header: "Statut",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <CheckboxCell
          isCheckbox={row.getValue("isPaid")}
          onChange={(e: boolean | "indeterminate") =>
            changeStatus({ id: row.original.id, isPaid: e })
          }
        />
      </div>
    ),

    filterFn: FilterOneInclude,
  },
  {
    accessorKey: "datePickUp",
    header: DatePickUpHeader,
    cell: ({ row }) => <DateCell date={row.original.datePickUp} />,
  },
  {
    accessorKey: "shopName",
    header: "Lieu de retrait",
    cell: ({ row }) => (
      <NameCell
        name={row.original.shopName}
        url={`/admin/shop/${row.original.shopId}`}
      />
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
    {
      id: "isPaid",
      title: "Status",
      options: [
        { label: "Payé", value: "true" },
        { label: "Non Payé", value: "false" },
      ],
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
    id: "pdf" as keyof OrderColumn,
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
