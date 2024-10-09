import AddressAutocomplete from "@/actions/adress-autocompleteFR";
import { Icons } from "@/components/icons";
import { IconButton } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import useServerAction from "@/hooks/use-server-action";
import { addHours } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import getUsersForDate from "../_functions/get-users-for-date";
import type { UserAndShop } from "./direction-form";
import type { DirectionFormValues, Point } from "./direction-schema";

const DatePicker = ({ usersAndShops }: { usersAndShops: UserAndShop[] }) => {
  const [open, setOpen] = useState(false);
  const { loading, serverAction } = useServerAction(getUsersForDate);
  const form = useFormContext<DirectionFormValues>();

  async function onDaySelected(date: Date) {
    setOpen(false);
    async function onSuccess(result?: Point[]) {
      if (!result) return;
      const addresses: Point[] = await Promise.all(
        result.map(async (order) => {
          if (!order.label) {
            return { label: "" };
          }

          const user = usersAndShops.find((user) => user.address && order.label === user.address);
          let latitude = user?.latitude || order.latitude;
          let longitude = user?.longitude || order.longitude;
          if (!latitude || !longitude) {
            const suggestions = await AddressAutocomplete(order.label);
            if (suggestions.length > 0) {
              latitude = suggestions[0].latitude;
              longitude = suggestions[0].longitude;
            }
          }
          if (user) {
            return { label: user.address, latitude, longitude };
          }
          return { label: order.label, latitude, longitude };
        }),
      );
      form.setValue(
        "waypoints",
        addresses.filter((address) => address.label),
      );
    }
    const from = date;
    const to = addHours(date, 24);
    serverAction({ data: { from, to }, onError: () => setOpen(true), onSuccess });
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
