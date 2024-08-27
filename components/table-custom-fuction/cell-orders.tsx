import { formDateDayMonth } from "@/lib/date-utils";
import type { OrderWithItemsAndShop } from "@/types";
import type { AMAPItem, OrderItem, Shop } from "@prisma/client";
import type { Row } from "@tanstack/react-table";
import { Search } from "lucide-react";
import Link from "next/link";
import { FaCheckCircle, FaFileInvoiceDollar, FaShippingFast } from "react-icons/fa";
import { PiHourglassLowFill } from "react-icons/pi";
import { ShopCard } from "../display-shops/shop-card";
import { Icons } from "../icons";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { NameCell } from "./common-cell";

type ProductCellProps = {
  products: string;
  productsList: { name: string; quantity?: string; unit?: string }[];
};

function ProductCell<T>({ row }: { row: Row<T & ProductCellProps> }) {
  return (
    <div className="flex flex-col gap-1">
      {row.original.productsList.map((product, index) => (
        <span className="w-[150px]  xl:w-auto" key={`${product.name}-${index}`}>
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
        <p className="whitespace-nowrap mr-auto">Éditer la commande</p>
        <div className="flex gap-2 justify-left items-center mr-auto">
          {shippingEmail && (
            <div className="relative">
              <p className="text-xs  text-green-500 whitespace-nowrap absolute font-bold left-[10px] top-6">
                {formDateDayMonth(shippingEmail)}
              </p>
              <Icons.Delivery className="size-16" />
            </div>
          )}
          {invoiceEmail && (
            <div className="relative">
              <p className="text-xs  text-green-500 whitespace-nowrap absolute font-bold left-[6px] top-[19px]">
                {formDateDayMonth(invoiceEmail)}
              </p>
              <Icons.Invoice className="size-12 rotate-90" />
            </div>
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

function createProductList(items: OrderItem[] | AMAPItem[]) {
  return items.map((item) => {
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

function createProduct(items: OrderItem[] | AMAPItem[]) {
  return items
    .map((item) => {
      let name = item.name;
      if (item.quantity > 0 && item.quantity !== 1) {
        name += ` x${item.quantity}`;
      }
      return name;
    })
    .join(", ");
}

// export type Status = "En cours de validation" | "Commande validée" | "Commande livrée" | "Commande Payée";

const statuses = ["En cours de validation", "Commande validée", "Commande livrée", "Commande Payée"] as const;

type Status = (typeof statuses)[number];

function createStatus(order: OrderWithItemsAndShop): Status {
  if (!order.dateOfEdition) return "En cours de validation";
  if (!order.dateOfShipping) return "Commande validée";
  if (!order.dateOfPayment) return "Commande livrée";
  return "Commande Payée";
}

const createStatusArray = (statuses: Status[]): { label: string; value: Status }[] => {
  return statuses.map((status) => ({
    label: status,
    value: status,
  }));
};

const statusArray = createStatusArray([...statuses]);

type StatusCellProps = {
  status: Status;
};

function StatusCell<T>({ row }: { row: Row<T & StatusCellProps> }) {
  const { status } = row.original;
  const getStatusIcon = (status: Status) => {
    switch (status) {
      case "En cours de validation":
        return (
          <Tooltip>
            <TooltipTrigger>
              <PiHourglassLowFill className="text-orange-500 size-6" />
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={4} align="start">
              <p>En cours de validation</p>
            </TooltipContent>
          </Tooltip>
        );

      case "Commande validée":
        return (
          <Tooltip>
            <TooltipTrigger>
              <FaCheckCircle className="text-green-500 size-6" />
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={4} align="start">
              <p>Commande validée</p>
            </TooltipContent>
          </Tooltip>
        );
      case "Commande livrée":
        return (
          <>
            <Tooltip>
              <TooltipTrigger>
                <FaCheckCircle className="text-green-500 size-6" />
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={4} align="start">
                <p>Commande validée</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <FaShippingFast className="text-green-500 size-6" />
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={4} align="start">
                <p>Commande livrée</p>
              </TooltipContent>
            </Tooltip>
          </>
        );
      case "Commande Payée":
        return (
          <>
            <Tooltip>
              <TooltipTrigger>
                <FaCheckCircle className="text-green-500 size-6" />
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={4} align="start">
                <p>Commande validée</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <FaShippingFast className="text-green-500 size-6" />
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={4} align="start">
                <p>Commande livrée</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <FaFileInvoiceDollar className="text-green-500 size-6" />
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={4} align="start">
                <p>Commande Payée</p>
              </TooltipContent>
            </Tooltip>
          </>
        );
    }
  };
  return <div className="flex gap-2 sm:gap-4">{getStatusIcon(status)}</div>;
}

function createDatePickUp({ dateOfShipping, datePickUp }: { datePickUp: Date; dateOfShipping: Date | null }) {
  return dateOfShipping ? dateOfShipping : datePickUp;
}
export {
  AdminShopNameCell,
  OrderIdCell,
  ProductCell,
  ShopNameCell,
  StatusCell,
  createDatePickUp,
  createProduct,
  createProductList,
  createStatus,
  statusArray,
  type Status,
};
