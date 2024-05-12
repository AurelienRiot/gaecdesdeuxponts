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
    <DisplayPDF isPaid={row.original.isPaid} data={row.original.dataInvoice} />
  );
}

type ProductCellProps<T = {}> = T & {
  products: string;
  productsList: { name: string; quantity?: string; unit?: string }[];
};

function ProductCell<T>({ row }: { row: Row<ProductCellProps<T>> }) {
  return (
    <div className="flex flex-col gap-[1px]">
      {row.original.productsList.map((product) => (
        <span className="whitespace-nowrap" key={product.name}>
          {!product.unit ? (
            <>
              <strong>{product.name}</strong>
              {product.quantity ? ` x${product.quantity}` : ""}
            </>
          ) : (
            <>
              <strong>{product.name}</strong> {product.quantity}
              {product.unit}
            </>
          )}
        </span>
      ))}
    </div>
  );
}

export { FactureCell, ProductCell };
