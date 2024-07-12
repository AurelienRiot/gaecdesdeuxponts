import type { OrderWithItemsAndShop } from "@/types";
import type { Row } from "@tanstack/react-table";
import { Button } from "../ui/button";
import Link from "next/link";
import { NameCell } from "./common-cell";
import type { Shop } from "@prisma/client";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Search } from "lucide-react";
import { ShopCard } from "../display-shops/shop-card";

type ProductCellProps = {
  products: string;
  productsList: { name: string; quantity?: string; unit?: string }[];
};

function ProductCell<T>({ row }: { row: Row<T & ProductCellProps> }) {
  return (
    <div className="flex flex-col gap-1">
      {row.original.productsList.map((product) => (
        <span className="w-[150px]" key={product.name}>
          {!product.unit ? (
            <>
              {!!product.quantity && `${product.quantity}x `}
              <strong>{product.name}</strong>
            </>
          ) : (
            <>
              <strong>{product.name}</strong> {product.quantity} {product.unit}
            </>
          )}
        </span>
      ))}
    </div>
  );
}

type OrderIdCellProps = {
  id: string;
  shippingEmail: Date | null;
  invoiceEmail: Date | null;
};
function OrderIdCell({ id, shippingEmail, invoiceEmail }: OrderIdCellProps) {
  return (
    <Button asChild variant={"link"} className="px-0 font-bold flex flex-col justify-start h-auto">
      <Link href={`/admin/orders/${id}`}>
        <p className="whitespace-nowrap">Éditer le bon de livraison</p>
        {shippingEmail && (
          <p className="text-sm font-normal text-green-500 whitespace-nowrap">
            BL envoyé le {shippingEmail.toDateString().split(" ")[2]}{" "}
            {new Date(2022, shippingEmail.getMonth(), 1).toLocaleString("fr", {
              month: "long",
            })}
          </p>
        )}
        {invoiceEmail && (
          <p className="text-sm font-normal text-green-500 whitespace-nowrap">
            Facture envoyé le {invoiceEmail.getDay()}{" "}
            {new Date(2022, invoiceEmail.getMonth(), 1).toLocaleString("fr", {
              month: "long",
            })}
          </p>
        )}
      </Link>
    </Button>
  );
}

type AdminShopNameCellProps = {
  shopName: string;
  shopId: string;
};
function AdminShopNameCell({ shopName, shopId }: AdminShopNameCellProps) {
  return shopName !== "Livraison à domicile" ? (
    <NameCell name={shopName} url={`/admin/shops/${shopId}`} />
  ) : (
    <Button variant={"ghost"} className="cursor-default px-0">
      {shopName}
    </Button>
  );
}

type ShopNameCellProps = {
  shopName: string;
  shop?: Shop;
};
function ShopNameCell({ shopName, shop }: ShopNameCellProps) {
  return shop ? (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"linkHover2"}
          className="justify-left flex flex-row items-center gap-2 whitespace-nowrap px-0 after:w-full hover:text-primary"
        >
          <Search className="h-4 w-4 flex-shrink-0" />

          {shopName}
        </Button>
      </PopoverTrigger>
      <PopoverContent asChild align="center" side="top">
        <ShopCard
          className="min-w-[500px]"
          display="profile"
          shop={shop}
          coordinates={{ lat: undefined, long: undefined }}
        />
      </PopoverContent>
    </Popover>
  ) : (
    <Button variant={"ghost"} className="cursor-default px-0">
      {"Livraison à domicile"}
    </Button>
  );
}

function createProductList(order: OrderWithItemsAndShop) {
  return order.orderItems.map((item) => {
    const name = item.name;
    if (item.quantity !== 1) {
      return {
        name,
        quantity: `${item.quantity}`,
        unit: item.unit || undefined,
      };
    }
    return { name, quantity: "", unit: undefined };
  });
}

function createProduct(order: OrderWithItemsAndShop) {
  return order.orderItems
    .map((item) => {
      let name = item.name;
      if (item.quantity > 0 && item.quantity !== 1) {
        name += ` x${item.quantity}`;
      }
      return name;
    })
    .join(", ");
}

export type Status = "En cours de validation" | "Commande valide" | "En cours de paiement" | "Payé";

function createStatus(order: OrderWithItemsAndShop): Status {
  return !order.dateOfEdition
    ? "En cours de validation"
    : !order.dateOfShipping
      ? "Commande valide"
      : !order.dateOfPayment
        ? "En cours de paiement"
        : "Payé";
}

function createDatePickUp({ dateOfShipping, datePickUp }: { datePickUp: Date; dateOfShipping: Date | null }) {
  return dateOfShipping ? dateOfShipping : datePickUp;
}
export {
  ProductCell,
  createProduct,
  createProductList,
  createStatus,
  createDatePickUp,
  OrderIdCell,
  AdminShopNameCell,
  ShopNameCell,
};
