import TimePicker from "@/components/ui/time-picker";
import { cn } from "@/lib/utils";
import { setHours, setMinutes } from "date-fns";
import { useRouter } from "next/navigation";
import { makeCartUrl } from "./summary";

type HourPickerProps = {
  className?: string;
  date: Date;
  shopId: string | undefined;
};

const CartTimePicker = ({ className, date, shopId }: HourPickerProps) => {
  const router = useRouter();

  if (
    date.getHours() < 8 ||
    (date.getHours() === 8 && date.getMinutes() < 30) ||
    date.getHours() > 18 ||
    (date.getHours() === 18 && date.getMinutes() > 30)
  ) {
    router.replace(makeCartUrl(shopId, setMinutes(setHours(date, 8), 30)), {
      scroll: false,
    });
    return null;
  }

  const onSelectTime = (selectedDate?: Date) => {
    if (!selectedDate) {
      return;
    }

    router.replace(makeCartUrl(shopId, selectedDate), {
      scroll: false,
    });
  };

  const timeOptions = generateTimeOptions(date);
  return (
    <>
      <div className={cn("relative flex flex-wrap items-center justify-between gap-y-2", className)}>
        <div className="text-base font-medium text-secondary-foreground">Heure de retrait</div>
        <TimePicker value={date} onChange={onSelectTime} timeOptions={timeOptions} />
      </div>
      <p className="pr-4 text-sm text-muted-foreground">
        Venez aux heures de la traite entre 8h30-9h30 et 18h-19h pour avoir du lait frais.
      </p>
    </>
  );
};

export default CartTimePicker;

export const generateTimeOptions = (date: Date, startHour = 8, endHour = 19) => {
  const times = [];
  let start = new Date(new Date(date).setHours(startHour, 0, 0, 0));

  const end = new Date(new Date(date).setHours(endHour, 0, 0, 0));

  while (start <= end) {
    times.push(start);
    start = new Date(start.getTime() + 30 * 60000); // add 30 minutes
  }

  return times;
};

//
