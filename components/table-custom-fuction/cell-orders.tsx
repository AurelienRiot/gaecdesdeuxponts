"use client";
import { Row } from "@tanstack/react-table";
import { DataInvoiceType } from "../pdf/data-invoice";
import DisplayPDF from "../pdf/pdf-button";

type FactureCellProps<T = {}> = T & {
  id: string;
  isPaid: boolean;
  dataInvoice: DataInvoiceType;
};

function FactureCell<T>({ row }: { row: Row<FactureCellProps<T>> }) {
  return (
    <>
      {!row.getValue("isPaid") ? (
        "Non disponible"
      ) : (
        <DisplayPDF data={row.original.dataInvoice} />
      )}
    </>
  );
}

type ProductCellProps<T = {}> = T & {
  products: string;
  productsList: { name: string; quantity?: string }[];
};

function ProductCell<T>({ row }: { row: Row<ProductCellProps<T>> }) {
  return (
    <div className="flex flex-col gap-[1px]">
      {row.original.productsList.map((product) => (
        <span key={product.name}>
          <strong>{product.name}</strong>
          {product.quantity}
        </span>
      ))}
    </div>
  );
}

export { FactureCell, ProductCell };
