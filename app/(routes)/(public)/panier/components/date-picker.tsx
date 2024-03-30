import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, dateFormatter } from "@/lib/utils";
import { fr } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type DatePickerProps = {
  className?: string;
  date: Date | undefined;
  shopId: string | undefined;
};

const DatePicker = ({ className, date, shopId }: DatePickerProps) => {
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const onSelectDate = (date: Date | undefined) => {
    if (!date) {
      router.refresh();
      toast.error("Erreur veuillez réssayer");
      return;
    }

    if (shopId) {
      const queryParams = new URLSearchParams({
        date: date.toISOString(),
        shopId,
      }).toString();
      router.push(`/panier?${queryParams}`, {
        scroll: false,
      });
    } else {
      const queryParams = new URLSearchParams({
        date: date.toISOString(),
      }).toString();
      router.push(`/panier?${queryParams}`, {
        scroll: false,
      });
    }

    setOpen(false);
  };

  return (
    <div
      className={cn("relative  flex items-center justify-between ", className)}
    >
      <div className="text-base font-medium text-gray-500">Date de retrait</div>
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

            <Icons.coloredCalendar
              className="ml-auto h-4 w-4 opacity-100 data-[state=false]:opacity-50"
              data-state={!!date}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="absolute w-auto p-0">
          <Calendar
            mode="single"
            captionLayout="buttons"
            selected={date}
            // month={month}
            locale={fr}
            onSelect={onSelectDate}
            // disabledDays={(date) => date.getDay() === 0 || date.getDay() === 6}
            modifiers={{
              disabled: (date) =>
                date.getDay() === 0 || date.getDay() === 6 || date < new Date(),
            }} // modifiers={{
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

export default DatePicker;
