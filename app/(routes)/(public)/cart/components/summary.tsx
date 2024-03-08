"use client";

import { Button, LoadingButton } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";
import { cn, dateFormatter } from "@/lib/utils";
import { fr } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { Dispatch, useEffect, useState } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { checkOut } from "./server-action";
import Spinner from "@/components/animations/spinner";
import { Loader2 } from "lucide-react";

interface SummaryProps {
  userId: string | undefined;
}

const Summary: React.FC<SummaryProps> = ({ userId }) => {
  const [loading, setLoading] = useState(false);
  const cart = useCart();
  const router = useRouter();
  const [date, setDate] = useState<Date | undefined>();

  const [isMounted, setIsMounted] = useState(false);

  const tooltipText = !userId
    ? "Veuillez vous connecter pour valider votre commande"
    : cart.items.length === 0
      ? "Veuillez ajouter au moins un article"
      : !date
        ? "Veuillez sélectionner une date"
        : null;

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
    const result = await checkOut({
      itemsWithQuantities,
      date,
      totalPrice,
    });
    if (result.success) {
      toast.success("Commande effectuée avec succès");
      cart.removeAll();
      router.push("/dashboard-user");
    } else {
      toast.error(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="mt-16 rounded-lg border-2 bg-gray-100 px-4 py-6 dark:bg-black sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
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

      <DatePicker date={date} setDate={setDate} className="mt-6" />
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
    </div>
  );
};
export default Summary;

type DatePickerProps = {
  className?: string;
  date: Date | undefined;
  setDate: Dispatch<React.SetStateAction<Date | undefined>>;
};

const DatePicker = ({ className, date, setDate }: DatePickerProps) => {
  const [open, setOpen] = useState(false);

  const onSelect = (date: Date | undefined) => {
    setDate(date);
    setOpen(false);
  };

  return (
    <div className={cn("relative", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[240px] pl-3 text-left font-normal",
              !date && "text-muted-foreground",
            )}
          >
            {date ? dateFormatter(date) : <span>Choisir une date</span>}
            <svg
              width="800px"
              height="800px"
              viewBox="0 0 1024 1024"
              className="ml-auto h-4 w-4 opacity-50"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M106.666667 810.666667V298.666667h810.666666v512c0 46.933333-38.4 85.333333-85.333333 85.333333H192c-46.933333 0-85.333333-38.4-85.333333-85.333333z"
                fill="#CFD8DC"
              />
              <path
                d="M917.333333 213.333333v128H106.666667v-128c0-46.933333 38.4-85.333333 85.333333-85.333333h640c46.933333 0 85.333333 38.4 85.333333 85.333333z"
                fill="#F44336"
              />
              <path
                d="M704 213.333333m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z"
                fill="#B71C1C"
              />
              <path
                d="M320 213.333333m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z"
                fill="#B71C1C"
              />
              <path
                d="M704 64c-23.466667 0-42.666667 19.2-42.666667 42.666667v106.666666c0 23.466667 19.2 42.666667 42.666667 42.666667s42.666667-19.2 42.666667-42.666667V106.666667c0-23.466667-19.2-42.666667-42.666667-42.666667zM320 64c-23.466667 0-42.666667 19.2-42.666667 42.666667v106.666666c0 23.466667 19.2 42.666667 42.666667 42.666667s42.666667-19.2 42.666667-42.666667V106.666667c0-23.466667-19.2-42.666667-42.666667-42.666667z"
                fill="#B0BEC5"
              />
              <path
                d="M277.333333 426.666667h85.333334v85.333333h-85.333334zM405.333333 426.666667h85.333334v85.333333h-85.333334zM533.333333 426.666667h85.333334v85.333333h-85.333334zM661.333333 426.666667h85.333334v85.333333h-85.333334zM277.333333 554.666667h85.333334v85.333333h-85.333334zM405.333333 554.666667h85.333334v85.333333h-85.333334zM533.333333 554.666667h85.333334v85.333333h-85.333334zM661.333333 554.666667h85.333334v85.333333h-85.333334zM277.333333 682.666667h85.333334v85.333333h-85.333334zM405.333333 682.666667h85.333334v85.333333h-85.333334zM533.333333 682.666667h85.333334v85.333333h-85.333334zM661.333333 682.666667h85.333334v85.333333h-85.333334z"
                fill="#90A4AE"
              />
            </svg>
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="absolute w-auto p-0">
          <Calendar
            mode="single"
            captionLayout="buttons"
            selected={date}
            // month={month}
            locale={fr}
            onSelect={onSelect}
            // disabled={disabledDays}
            // modifiers={{
            //   full: fullDays,
            //   partiallyFull: partiallyFullDays,
            //   free: freeDays,
            // }}
            // modifiersStyles={{
            //   full: fullDaysStyle,
            //   partiallyFull: partiallyFullDaysStyle,
            //   free: freeDaysStyle,
            // }}
            // onDayClick={handleDayClick}
            // footer={GetFooterMessage(isDayAvailable)}
            // onMonthChange={setMonth}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
