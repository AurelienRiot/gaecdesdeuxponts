import { getRelativeDate } from "@/lib/date-utils";
import { cn } from "@/lib/utils";
import type { FullShop } from "@/types";
import type { AMAPItem, OrderItem, PaymentMethod } from "@prisma/client";
import type { Row } from "@tanstack/react-table";
import { Banknote, Check, CheckCircle, Coins, CreditCard, Hourglass, Landmark, Search, Truck } from "lucide-react";
import Link from "next/link";
import { ShopCard } from "../display-shops/shop-card";
import { getUnitLabel } from "../product/product-function";
import { FaFileInvoiceDollar } from "../react-icons";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { type Status, status } from "../zod-schema/status";
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
              <strong>{product.name}</strong> {product.quantity}
              {product.unit}
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
  datePickUp: Date;
  status: Status;
};
function OrderIdCell({ id, shippingEmail, invoiceEmail, datePickUp, status }: OrderIdCellProps) {
  return (
    <Button asChild variant={"link"} className="px-0 font-bold flex flex-col items-center gap-2  h-auto ">
      <Link href={`/admin/orders/${id}`}>
        <p className="whitespace-nowrap mr-auto"> {getRelativeDate(datePickUp)}</p>
        {/* <div className="flex gap-2 justify-left items-center mr-auto">
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
        </div> */}
        <div className="mr-auto">
          <StatusCell status={status} />
        </div>
      </Link>
    </Button>
  );
}

type AdminShopNameCellProps = {
  shopName: string;
  shopId: string;
  shopImage?: string | null;
};
function AdminShopNameCell({ shopName, shopId, shopImage }: AdminShopNameCellProps) {
  return shopName !== "Livraison à domicile" ? (
    <NameCell name={shopName} url={`/admin/shops/${shopId}`} image={shopImage} imageSize={14} />
  ) : (
    <Button variant={"ghost"} className="cursor-default px-0">
      {shopName}
    </Button>
  );
}

type ShopNameCellProps = {
  shopName: string;
  shop?: FullShop;
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
        unit: getUnitLabel(item.unit).quantity || undefined,
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

type OrderForStatus = {
  dateOfEdition?: Date | null;
  shippingEmail?: Date | null;
  invoiceOrder: { invoice: { id?: string | null; dateOfPayment?: Date | null } }[];
};

function createStatus({ dateOfEdition, invoiceOrder, shippingEmail }: OrderForStatus): Status {
  if (invoiceOrder[0]?.invoice.dateOfPayment) return "Payé";
  if (invoiceOrder[0]?.invoice.id) return "En attente de paiement";
  if (shippingEmail) return "Commande livrée";
  if (dateOfEdition) return "Commande validée";
  return "À confirmer";
}

const createStatusArray = (statuses: Status[]): { label: string; value: Status }[] => {
  return statuses.map((status) => ({
    label: status,
    value: status,
  }));
};

const statusArray = createStatusArray([...status]);

type StatusCellProps = {
  status: Status;
  className?: string;
  displayName?: boolean;
};

const statusConfig: Record<
  Status,
  {
    Icon: React.ElementType;
    color: string;
    hoverColor: string;
  }
> = {
  ["À confirmer"]: {
    Icon: Hourglass,
    color: "bg-orange-500",
    hoverColor: "hover:bg-orange-500/90",
  },
  ["Commande validée"]: {
    Icon: CheckCircle,
    color: "bg-teal-500",
    hoverColor: "hover:bg-teal-500/90",
  },
  ["Commande livrée"]: {
    Icon: Truck,
    color: "bg-blue-500",
    hoverColor: "hover:bg-blue-500/90",
  },
  ["En attente de paiement"]: {
    Icon: CreditCard,
    color: "bg-yellow-500",
    hoverColor: "hover:bg-yellow-500/90",
  },
  ["Payé"]: {
    Icon: FaFileInvoiceDollar,
    color: "bg-green-500",
    hoverColor: "hover:bg-green-500/90",
  },
};

function StatusCell({ status, className, displayName = true }: StatusCellProps) {
  const { Icon, color, hoverColor } = statusConfig[status];
  return (
    <div className={cn("flex gap-2 sm:gap-4", className)}>
      <Badge
        variant="secondary"
        className={cn(color, hoverColor, "text-white text-xs px-2 py-0.5 flex items-center space-x-1")}
      >
        <Icon className="size-3" />
        {displayName && <span className="text-[10px]">{status}</span>}
      </Badge>
    </div>
  );
}

function PaymentMethodCell({ paymentMethod }: { paymentMethod: PaymentMethod }) {
  const { Icon, color, hoverColor, label } = paymentMethodConfig[paymentMethod];
  return (
    <div className="flex gap-2 sm:gap-4">
      <Badge
        variant="secondary"
        className={cn(color, hoverColor, "text-white text-xs px-2 py-0.5 flex items-center space-x-1")}
      >
        <Icon className="size-3" />
        <span className="text-[10px]">{label}</span>
      </Badge>
    </div>
  );
}

const paymentMethodConfig: Record<
  PaymentMethod,
  { Icon: React.ElementType; color: string; hoverColor: string; label: string }
> = {
  CASH: {
    Icon: Coins,
    color: "bg-blue-500",
    hoverColor: "hover:bg-blue-500/90",
    label: "Espece",
  },
  CHECK: {
    Icon: Banknote,
    color: "bg-blue-500",
    hoverColor: "hover:bg-blue-500/90",
    label: "Cheque",
  },
  TRANSFER: {
    Icon: Landmark,
    color: "bg-blue-500",
    hoverColor: "hover:bg-blue-500/90",
    label: "Virement",
  },
  CARD: {
    Icon: CreditCard,
    color: "bg-blue-500",
    hoverColor: "hover:bg-blue-500/90",
    label: "Carte bancaire",
  },
};

function createDatePickUp({ dateOfShipping, datePickUp }: { datePickUp: Date; dateOfShipping: Date | null }) {
  return dateOfShipping ? dateOfShipping : datePickUp;
}
export {
  AdminShopNameCell,
  createDatePickUp,
  createProduct,
  createProductList,
  createStatus,
  OrderIdCell,
  ProductCell,
  ShopNameCell,
  statusArray,
  PaymentMethodCell,
  StatusCell,
  type Status,
};
