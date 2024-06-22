"use client";

import { Button } from "@/components/ui/button";
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";
import { addDelay } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import {
  getUnitLabel,
  hasOptionWithValue,
} from "@/components/product/product-function";
import { Skeleton } from "@/components/skeleton-ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useIsComponentMounted from "@/hooks/use-mounted";
import type { ProductWithOptionsAndMain } from "@/types";
import type { Shop } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { checkOut } from "../_actions/check-out";
import DatePicker from "./date-picker";
import LoginCard from "./login-card";
import TimePicker from "./time-picker";

const getDateFromSearchParam = (param: string | null): Date | undefined => {
  if (param === null) return undefined;
  const date = new Date(decodeURIComponent(param));
  return Number.isNaN(date.getTime()) ? undefined : date;
};

interface SummaryProps {
  shops: Shop[];
}

const Summary: React.FC<SummaryProps> = ({ shops }) => {
  const [loading, setLoading] = useState(false);
  const session = useSession();
  const role = session.data?.user?.role;
  const cart = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const date: Date | undefined = getDateFromSearchParam(
    searchParams.get("date"),
  );

  const shopId: string | undefined = process.env.NEXT_PUBLIC_FARM_ID;
  // searchParams.get("shopId")
  const isMounted = useIsComponentMounted();

  const tooltipText = !role
    ? "Veuillez vous connecter pour valider votre commande"
    : cart.items.length === 0
      ? "Veuillez ajouter au moins un article"
      : !date
        ? "Veuillez sélectionner une date"
        : // : !shopId
          //   ? "Veuillez sélectionner un lieu de retrait"
          null;

  // useEffect(() => {
  //   const searchDate = getDateFromSearchParam(searchParams.get("date"));
  //   setDate(searchDate);
  //   if (searchDate) {
  //     setTime({
  //       hours: searchDate.getHours(),
  //       minutes: searchDate.getMinutes(),
  //     });
  //   }
  //   // const shopId = searchParams.get("shopId");
  //   // setShopId(shopId ? decodeURIComponent(shopId) : undefined);
  // }, [searchParams]);
  const totalPrice =
    cart.items?.length > 0
      ? cart.items.reduce((total, item) => {
          return total + (item.price || 0) * cart.quantities[item.id];
        }, 0)
      : 0;
  const onCheckout = async () => {
    setLoading(true);
    if (!role) {
      toast.error("Veuillez vous connecter pour valider votre commande");
      return;
    }
    if (!date) {
      toast.error("Veuillez sélectionner une date");
      return;
    }
    if (!shopId) {
      toast.error("Veuillez sélectionner un lieu de retrait");
      return;
    }
    const itemsWithQuantities = cart.items.map((item) => {
      return {
        id: item.id,
        price: item.price,
        quantity: cart.quantities[item.id],
      };
    });

    const result = await checkOut({
      itemsWithQuantities,
      date,
      shopId,
    });

    if (result.success) {
      router.push("/dashboard-user/orders");
      await addDelay(500);
      toast.success("Commande effectuée avec succès");
      cart.removeAll();
    } else {
      if (result.ids) {
        const changedProducts = result.ids.map(
          (id) => cart.items.find((item) => item.id === id)?.name || "",
        );
        toast.error(
          `Les produits suivants ont été modifiés depuis votre dernière visite veuillez les réajouter : ${changedProducts.join(", ")}`,
          { position: "top-left", duration: 10000 },
        );
        result.ids.map((id) => cart.removeItem(id));
      } else {
        toast.error(result.message);
      }
    }

    setLoading(false);
  };

  return (
    <>
      {/* <PlaceModal isOpen={open} setIsOpen={setOpen} shops={shops} date={date} /> */}
      <div className="relative mb-[450px] mt-16 space-y-6 rounded-lg border-2 bg-gray-100 px-4 py-6 dark:bg-black sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
        <h2 className="text-xl font-medium text-secondary-foreground">
          Votre Commmande
        </h2>
        <ul className="pt-4">
          {isMounted
            ? cart.items.map((item) => <ItemsPrice key={item.id} item={item} />)
            : Array.from({ length: 4 }, (_, i) => (
                <ItemPriceSkeleton key={i} />
              ))}
        </ul>
        <div className="space-y-4">
          <div className="flex items-center justify-between border-t border-gray-200 pt-4">
            <div className="text-base font-medium text-secondary-foreground">
              Total
            </div>
            <Currency value={totalPrice} />
          </div>
        </div>
        <DatePicker date={date} shopId={shopId} />{" "}
        {isMounted && date && <TimePicker date={date} shopId={shopId} />}
        {/* 
        <PickUpPlace
          date={date}
          shopId={shopId}
          setOpen={setOpen}
          shops={shops}
          role={role}
        /> */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              disabled={loading || !!tooltipText}
              onClick={onCheckout}
              variant="rounded"
              className="w-full"
            >
              {loading && <Loader2 className={"mr-2 h-4 w-4 animate-spin"} />}
              Passer la commande
            </Button>
          </TooltipTrigger>
          <TooltipContent
            data-state={!!tooltipText}
            className="data-[state=false]:hidden"
          >
            <p>{tooltipText}</p>
          </TooltipContent>
        </Tooltip>
        {!role && (
          <LoginCard
            date={date}
            shopId={shopId}
            className="absolute left-1/2 top-full -translate-x-1/2"
          />
        )}
      </div>
    </>
  );
};
export default Summary;

const ItemsPrice = ({ item }: { item: ProductWithOptionsAndMain }) => {
  const cart = useCart();
  return (
    <li className="flex justify-between tabular-nums">
      {hasOptionWithValue(item.options, "Vrac") ? (
        <div>
          {`${cart.quantities[item.id]}${getUnitLabel(item.unit).quantity} `}
          <strong>{item.name} </strong>{" "}
        </div>
      ) : (
        <div>
          {cart.quantities[item.id] > 0 && cart.quantities[item.id] !== 1 && (
            <span> {cart.quantities[item.id]}x </span>
          )}
          <strong>{item.name} </strong>{" "}
        </div>
      )}
      <Currency
        value={Number(item.price) * cart.quantities[item.id]}
        className="justify-self-end"
      />
    </li>
  );
};

const ItemPriceSkeleton = () => {
  return (
    <li className="mb-2 flex justify-between tabular-nums">
      <Skeleton size={"lg"} className="h-4" />
      <Currency value={undefined} className="justify-self-end" />
    </li>
  );
};

export const makeCartUrl = (
  shopId: string | undefined,
  date: Date | undefined,
) => {
  let queryParams: string | undefined;
  if (date && shopId) {
    queryParams = new URLSearchParams({
      date: date.toISOString(),
      shopId,
    }).toString();
  } else if (shopId) {
    queryParams = new URLSearchParams({
      shopId,
    }).toString();
  } else if (date) {
    queryParams = new URLSearchParams({
      date: date.toISOString(),
    }).toString();
  }

  return queryParams ? `?${queryParams}` : "?";
};
