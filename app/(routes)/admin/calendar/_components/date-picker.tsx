import { Icons } from "@/components/icons";
import { IconButton } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import useServerAction from "@/hooks/use-server-action";
import { fr } from "date-fns/locale";
import { useState } from "react";
import getDailyOrders from "../_actions/get-daily-orders";
import { useFormContext } from "react-hook-form";
import type { DirectionFormValues } from "./direction-schema";
import type { UserAndShop } from "./direction-form";

const DatePicker = ({ usersAndShops }: { usersAndShops: UserAndShop[] }) => {
  const [open, setOpen] = useState(false);
  const { loading, serverAction } = useServerAction(getDailyOrders);
  const form = useFormContext<DirectionFormValues>();

  async function onDaySelected(date: Date) {
    setOpen(false);
    function onSuccess(
      result?: {
        customer: { shippingAddress: string } | null;
      }[],
    ) {
      if (!result) return;
      const addresses = result.map((order) => {
        if (!order.customer?.shippingAddress) {
          return "";
        }

        const user = usersAndShops.find(
          (user) =>
            order.customer?.shippingAddress.includes(user.address) ||
            user.address.includes(order.customer?.shippingAddress || "zzzz"),
        );
        if (user) {
          return user.address;
        }
        return order.customer?.shippingAddress;
      });
      form.setValue("waypoints", addresses);
    }
    serverAction({ data: { date }, onError: () => setOpen(true), onSuccess });
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <IconButton
          Icon={Icons.coloredCalendar}
          iconClassName="size-5"
          disabled={loading}
          className="border-0 bg-transparent shadow-none inline justify-self-end p-0 mr-2"
          // className={cn("relative w-full pl-3 text-left font-normal", !date && "text-muted-foreground")}
        />
      </PopoverTrigger>
      <PopoverContent align="start" className="absolute w-auto p-0">
        <Calendar
          captionLayout="label"
          defaultMonth={new Date()}
          locale={fr}
          onDayClick={onDaySelected}

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
  );
};

export default DatePicker;
