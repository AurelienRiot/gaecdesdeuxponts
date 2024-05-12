"use client";

import { Button } from "@/components/ui/button";
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";
import { addDelay, cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { EmailButton, GoogleButton } from "@/components/auth/auth-button";
import { Icons } from "@/components/icons";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Shop } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import DatePicker from "./date-picker";
import PlaceModal from "./place-modal";
import { checkOut } from "./server-action";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  getUnitLabel,
  hasOptionWithValue,
} from "@/components/product/product-function";

const baseUrl = process.env.NEXT_PUBLIC_URL;
const farmShopId = "ac771e24-2fd8-4827-af71-8d3c566f62bb";

const getDateFromSearchParam = (param: string | null): Date | undefined => {
  if (param === null) return undefined;
  const date = new Date(decodeURIComponent(param));
  return isNaN(date.getTime()) ? undefined : date;
};

interface SummaryProps {
  role: string | undefined;
  shops: Shop[];
}

const Summary: React.FC<SummaryProps> = ({ role, shops }) => {
  const [loading, setLoading] = useState(false);
  const cart = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [date, setDate] = useState<Date | undefined>();
  const [shopId, setShopId] = useState<string | undefined>();
  const [open, setOpen] = useState(false);

  const [isMounted, setIsMounted] = useState(false);

  const tooltipText = !role
    ? "Veuillez vous connecter pour valider votre commande"
    : cart.items.length === 0
      ? "Veuillez ajouter au moins un article"
      : !date
        ? "Veuillez sélectionner une date"
        : !shopId
          ? "Veuillez sélectionner un lieu de retrait"
          : null;

  useEffect(() => {
    setDate(getDateFromSearchParam(searchParams.get("date")));
    const shopId = searchParams.get("shopId");
    setShopId(shopId ? decodeURIComponent(shopId) : undefined);
  }, [searchParams]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const totalPrice =
    cart.items.length > 0
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
        quantity: cart.quantities[item.id],
      };
    });

    const result = await checkOut({
      itemsWithQuantities,
      date,
      totalPrice,
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

  const onSelectPlace = (shopId: string | undefined) => {
    if (!shopId) {
      router.refresh();
      toast.error("Erreur veuillez réssayer");
      return;
    }

    router.push(makeCartUrl(shopId, date), {
      scroll: false,
    });
  };

  return (
    <>
      <PlaceModal
        isOpen={open}
        setIsOpen={setOpen}
        shops={shops}
        onSelect={onSelectPlace}
      />
      <div className="relative mb-[450px] mt-16 space-y-6 rounded-lg border-2 bg-gray-100 px-4 py-6 dark:bg-black sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
        <h2 className="text-xl font-medium text-secondary-foreground">
          Votre Commmande
        </h2>
        <ul className="pt-4">
          {cart.items.map((item) => (
            <li key={item.id} className="flex justify-between tabular-nums	">
              {hasOptionWithValue(item.options, "Vrac") ? (
                <div>
                  {`${cart.quantities[item.id]}${getUnitLabel(item.unit).quantity} `}
                  <strong>{item.name} </strong>{" "}
                </div>
              ) : (
                <div>
                  {cart.quantities[item.id] > 0 &&
                    cart.quantities[item.id] !== 1 && (
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
          ))}
        </ul>
        <div className=" space-y-4">
          <div className="flex items-center justify-between border-t border-gray-200 pt-4">
            <div className="text-base font-medium text-secondary-foreground">
              Total
            </div>
            <Currency value={totalPrice} />
          </div>
        </div>
        <DatePicker date={date} shopId={shopId} />

        <PickUpPlace
          date={date}
          shopId={shopId}
          setOpen={setOpen}
          shops={shops}
          role={role}
        />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              disabled={loading || !!tooltipText}
              onClick={onCheckout}
              variant="rounded"
              className=" w-full "
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
            className="absolute left-1/2 top-full -translate-x-1/2  "
          />
        )}
      </div>
    </>
  );
};
export default Summary;

const PickUpPlace = ({
  date,
  shopId,
  setOpen,
  shops,
  className,
  role,
}: {
  date: Date | undefined;
  shopId: string | undefined;
  setOpen: Dispatch<SetStateAction<boolean>>;
  shops: Shop[];
  className?: string;
  role: string | undefined;
}) => {
  const router = useRouter();
  return (
    <>
      {role === "pro" || role === "admin" ? (
        <div className="flex items-center justify-between space-x-2">
          <Label
            htmlFor="domicile"
            className="text-base font-medium text-secondary-foreground"
          >
            Livraison à domicile
          </Label>
          <Switch
            id="domicile"
            checked={shopId === "domicile"}
            onCheckedChange={(check) =>
              router.push(makeCartUrl(check ? "domicile" : undefined, date), {
                scroll: false,
              })
            }
          />
        </div>
      ) : null}
      <div className="flex items-center justify-between space-x-2">
        <Label
          htmlFor="farm-pickup"
          className="text-base font-medium text-secondary-foreground"
        >
          Venir chercher à la ferme
        </Label>
        <Switch
          id="farm-pickup"
          checked={shopId === farmShopId}
          onCheckedChange={(check) =>
            router.push(makeCartUrl(check ? farmShopId : undefined, date), {
              scroll: false,
            })
          }
        />
      </div>
      {shopId !== "domicile" && shopId !== farmShopId ? (
        <div
          className={cn(
            "relative   flex items-center justify-between ",
            className,
          )}
        >
          <div className="text-base font-medium text-secondary-foreground">
            Lieu de retrait
          </div>
          <Button
            variant={"outline"}
            className={cn(
              "w-[240px] pl-3 text-left font-normal",
              !date && "text-muted-foreground",
            )}
            onClick={() => setOpen((open) => !open)}
          >
            {shopId ? (
              shops.find((shop) => shop.id === shopId)?.name
            ) : (
              <span>Choisir un lieu</span>
            )}
            <Icons.pinMap
              data-state={!!shopId}
              className="ml-auto h-4 w-4 opacity-100 data-[state=false]:opacity-50"
            />
          </Button>
        </div>
      ) : null}
    </>
  );
};

const LoginCard = ({
  className,
  date,
  shopId,
}: {
  className?: string;
  date: Date | undefined;
  shopId: string | undefined;
}) => {
  let callbackUrl = baseUrl + "/panier";

  if (shopId) {
    callbackUrl += `?shopId=${encodeURIComponent(shopId)}`;
    if (date) {
      const dateString = encodeURIComponent(date.toISOString());
      callbackUrl += `&date=${dateString}`;
    }
  } else {
    if (date) {
      const dateString = encodeURIComponent(date.toISOString());
      callbackUrl += `?date=${dateString}`;
    }
  }

  return (
    <Card
      className={cn(
        "mt-6 flex h-[450px] max-w-[500px] flex-col justify-between",
        className,
      )}
    >
      <CardHeader className="text-center text-2xl font-semibold ">
        Connecté vous pour valider votre commande
      </CardHeader>
      <CardContent className="flex  flex-col items-center justify-center">
        <GoogleButton callbackUrl={callbackUrl} />
      </CardContent>
      <CardContent className="flex  flex-col items-center justify-center">
        <div
          className={`my-4 flex h-4 flex-row  items-center gap-4 self-stretch whitespace-nowrap
before:h-0.5 before:w-full 
before:flex-grow before:bg-primary/30  after:h-0.5  after:w-full 
after:flex-grow  after:bg-primary/30  `}
        >
          ou
        </div>
      </CardContent>
      <CardContent className="flex  flex-col items-center justify-center">
        <EmailButton callbackUrl={callbackUrl} />
      </CardContent>
    </Card>
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
