import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Calendar, CalendarProps } from "@/components/ui/calendar";
import { FormItem, FormLabel } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, dateFormatter } from "@/lib/utils";
import { fr } from "date-fns/locale";
import { useState } from "react";

type FormDatePickerProps = CalendarProps & {
  title: string;
  className?: string;
  reset?: boolean;
  date: Date | undefined | null;
  onSelectDate: (date: Date | undefined | null) => void;
};

const FormDatePicker = ({
  title,
  className,
  date,
  reset = true,
  onSelectDate,
  ...props
}: FormDatePickerProps) => {
  const [open, setOpen] = useState(false);

  return (
    <FormItem className={cn("w-64", className)}>
      <FormLabel className="flex items-center justify-between gap-2">
        <span>{title}</span>
        {reset && (
          <Button
            variant={"outline"}
            onClick={() => {
              console.log("date");
              onSelectDate(null);
            }}
            type="button"
            size={"xs"}
            className="border-dashed  text-xs"
          >
            Réninitialiser
          </Button>
        )}
      </FormLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "relative w-full pl-3 text-left font-normal",
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
            {...props}
            mode="single"
            captionLayout="buttons"
            selected={date ?? undefined}
            // month={month}
            locale={fr}
            onSelect={(d) => {
              onSelectDate(d);
              setOpen(false);
            }}
            // disabledDays={(date) => date.getDay() === 0 || date.getDay() === 6}
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
    </FormItem>
  );
};

export default FormDatePicker;
