"use client";

import { Button } from "@/components/ui/button";
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { EmailButton, GoogleButton } from "@/components/auth/auth-button";
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

const baseUrl = process.env.NEXT_PUBLIC_URL;

const getDateFromSearchParam = (param: string | null): Date | undefined => {
  if (param === null) return undefined; // If param is null, return undefined
  const date = new Date(param);
  return isNaN(date.getTime()) ? undefined : date; // Check if date is valid
};

interface SummaryProps {
  userId: string | undefined;
}

const Summary: React.FC<SummaryProps> = ({ userId }) => {
  const [loading, setLoading] = useState(false);
  const cart = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [date, setDate] = useState<Date | undefined>();
  const [shop, setshop] = useState<Shop | undefined>();

  const [isMounted, setIsMounted] = useState(false);

  const tooltipText = !userId
    ? "Veuillez vous connecter pour valider votre commande"
    : cart.items.length === 0
      ? "Veuillez ajouter au moins un article"
      : !date
        ? "Veuillez sélectionner une date"
        : null;

  useEffect(() => {
    setDate(getDateFromSearchParam(searchParams.get("date")));
  }, [searchParams]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const totalPrice = cart.items.reduce((total, item) => {
    return total + item.price * cart.quantities[item.id];
  }, 0);

  const onCheckout = async () => {
    setLoading(true);
    if (!userId) {
      toast.error("Veuillez vous connecter pour valider votre commande");
      return;
    }
    if (!date) {
      toast.error("Veuillez sélectionner une date");
      return;
    }
    const itemsWithQuantities = cart.items.map((item) => {
      return {
        id: item.id,
        quantity: cart.quantities[item.id],
      };
    });

    console.log(itemsWithQuantities, date, totalPrice, shop);
    // const result = await checkOut({
    //   itemsWithQuantities,
    //   date,
    //   totalPrice,
    // });
    // if (result.success) {
    //   toast.success("Commande effectuée avec succès");
    //   cart.removeAll();
    //   router.push("/dashboard-user");
    // } else {
    //   toast.error(result.message);
    // }

    setLoading(false);
  };

  return (
    <div className="relative mb-[450px] mt-16 rounded-lg border-2 bg-gray-100 px-4 py-6 dark:bg-black sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
      <h2 className="text-xl font-medium text-gray-500">Votre Commmande</h2>
      <ul className="pt-4">
        {cart.items.map((item) => (
          <li key={item.id} className="flex justify-between tabular-nums	">
            <div>
              {cart.quantities[item.id] > 1 && (
                <span> {cart.quantities[item.id]}x </span>
              )}
              <strong>{item.name} </strong>{" "}
            </div>
            <Currency
              value={Number(item.price) * cart.quantities[item.id]}
              displayText={false}
              displayLogo={false}
              className="justify-self-end"
            />
          </li>
        ))}
      </ul>
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-base font-medium text-gray-500">Total</div>
          <Currency value={totalPrice} displayLogo={false} />
        </div>
      </div>
      <DatePicker date={date} className="mt-6" />
      {/* <PickLocation setShop={setshop} /> */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            disabled={cart.items.length === 0 || loading || !date || !userId}
            onClick={onCheckout}
            variant="rounded"
            className="mt-6 w-full "
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
      {!userId && (
        <LoginCard
          date={date}
          className="absolute left-1/2 top-full -translate-x-1/2  "
        />
      )}
    </div>
  );
};
export default Summary;

const LoginCard = ({
  className,
  date,
}: {
  className?: string;
  date: Date | undefined;
}) => {
  let callbackUrl = baseUrl + "/cart";

  if (date !== undefined) {
    const dateString = encodeURIComponent(date.toISOString());
    callbackUrl += `?date=${dateString}`;
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
