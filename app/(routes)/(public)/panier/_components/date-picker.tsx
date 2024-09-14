import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MIN_DAYS_FOR_PICK_UP, dateFormatter, isDateDisabled } from "@/lib/date-utils";
import { cn } from "@/lib/utils";
import { addMonths } from "date-fns";
import { fr } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { makeCartUrl } from "./summary";

type DatePickerProps = {
  className?: string;
  date: Date | undefined;
  shopId: string | undefined;
};

const DatePicker = ({ className, date, shopId }: DatePickerProps) => {
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const onSelectDate = (selectedDate: Date | undefined) => {
    if (!selectedDate) {
      router.refresh();
      toast.error("Erreur veuillez réssayer");
      return;
    }
    console.log(selectedDate.getTime());
    if (date) {
      selectedDate.setHours(date.getHours());
      selectedDate.setMinutes(date.getMinutes());
    } else {
      selectedDate.setHours(8);
      selectedDate.setMinutes(30);
    }

    router.replace(makeCartUrl(shopId, selectedDate), {
      scroll: false,
    });

    setOpen(false);
  };

  return (
    <div className={cn("relative flex flex-wrap items-center justify-between gap-y-2", className)}>
      <div className="text-base font-medium text-secondary-foreground">Date de retrait</div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn("w-[240px] pl-3 text-left font-normal", !date && "text-muted-foreground")}
          >
            {date ? dateFormatter(date, { days: true }) : <span>Choisir une date</span>}

            <Icons.coloredCalendar
              className="ml-auto h-4 w-4 opacity-100 data-[state=false]:opacity-50"
              data-state={!!date}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="absolute w-auto p-0">
          <Calendar
            mode="single"
            className="p-3"
            captionLayout="label"
            selected={date}
            defaultMonth={
              date
                ? date
                : new Date().getDate() + MIN_DAYS_FOR_PICK_UP >
                    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()
                  ? addMonths(new Date(), 1)
                  : new Date()
            }
            locale={fr}
            onSelect={onSelectDate}
            modifiers={{
              disabled: (date) => isDateDisabled(date),
            }}
            startMonth={new Date(new Date().getFullYear(), new Date().getMonth())}
            endMonth={new Date(new Date().getFullYear() + 2, 11)}

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
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePicker;
