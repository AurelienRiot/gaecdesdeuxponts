import type { OrderWithItemsAndShop } from "@/types";
import type { Row } from "@tanstack/react-table";
import { Button } from "../ui/button";
import Link from "next/link";
import { NameCell } from "./common-cell";
import type { Shop } from "@prisma/client";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Search } from "lucide-react";
import { ShopCard } from "../display-shops/shop-card";
import { PiHourglassLowFill } from "react-icons/pi";
import type { IconType } from "react-icons/lib";
import { FaCheckCircle, FaFileInvoiceDollar, FaShippingFast } from "react-icons/fa";
import { Icons } from "../icons";
import { formDateDayMonth } from "@/lib/date-utils";

type ProductCellProps = {
  products: string;
  productsList: { name: string; quantity?: string; unit?: string }[];
};

function ProductCell<T>({ row }: { row: Row<T & ProductCellProps> }) {
  return (
    <div className="flex flex-col gap-1">
      {row.original.productsList.map((product, index) => (
        <span className="w-[150px]" key={`${product.name}-${index}`}>
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
        <p className="whitespace-nowrap mr-auto">Éditer le bon de livraison</p>
        <div className="flex gap-2 justify-left items-center mr-auto">
          {shippingEmail && (
            <div className="relative">
              <p className="text-sm  text-green-500 whitespace-nowrap absolute font-bold left-3 top-5">
                {formDateDayMonth(shippingEmail)}
              </p>
              <Icons.Delivery className="size-16" />
            </div>
          )}
          {invoiceEmail && (
            <div className="relative">
              <p className="text-sm  text-green-500 whitespace-nowrap absolute font-bold left-2 top-[18px]">
                {formDateDayMonth(invoiceEmail)}
              </p>
              <Icons.Invoice className="size-12 rotate-90" />
            </div>
            // <p className="text-sm font-normal text-green-500 whitespace-nowrap">
            //   Facture envoyé le {invoiceEmail.getDay()}{" "}
            //   {new Date(2022, invoiceEmail.getMonth(), 1).toLocaleString("fr", {
            //     month: "long",
            //   })}
            // </p>
          )}
        </div>
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

type StatusCellProps = {
  status: Status;
};

function StatusCell<T>({ row }: { row: Row<T & StatusCellProps> }) {
  const icons: IconType[] = [];
  if (row.original.status === "En cours de validation") {
    return <PiHourglassLowFill className="text-orange-500 size-6" />;
  }
  icons.push(FaCheckCircle);
  if (row.original.status === "Commande valide") {
    return (
      <div className="flex  gap-2">
        {icons.map((Icon, index) => (
          <Icon key={index} className="text-green-500 size-6" />
        ))}
      </div>
    );
  }
  icons.push(FaShippingFast);
  if (row.original.status === "En cours de paiement") {
    return (
      <div className="flex  gap-2">
        {icons.map((Icon, index) => (
          <Icon key={index} className="text-green-500 size-6" />
        ))}
      </div>
    );
  }
  icons.push(FaFileInvoiceDollar);
  return (
    <div className="flex  gap-2">
      {icons.map((Icon, index) => (
        <Icon key={index} className="text-green-500 size-6" />
      ))}
    </div>
  );
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
  StatusCell,
};
