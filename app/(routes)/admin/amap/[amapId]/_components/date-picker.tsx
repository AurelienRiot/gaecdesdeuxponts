import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Calendar, type CalendarProps } from "@/components/ui/calendar";
import { FormItem, FormLabel } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Toggle } from "@/components/ui/toggle";
import { dateFormatter, getDaysBetweenDates } from "@/lib/date-utils";
import { cn } from "@/lib/utils";
import { fr } from "date-fns/locale";
import { type Dispatch, type SetStateAction, forwardRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import type { AMAPFormValues } from "./amap-schema";

type FormDatePickerProps = Omit<CalendarProps, "disabled"> & {
  title: "Date de fin" | "Date de début";
  className?: string;
  date: Date | undefined;
  disabled?: boolean;
  setDate: (date: Date | undefined) => void;
  everyTwoWeek: boolean;
  setEveryTwoWeek: Dispatch<SetStateAction<boolean>>;
};

const FormDatePicker = forwardRef<HTMLButtonElement, FormDatePickerProps>(
  (
    { title, className, date, disabled, setDate, everyTwoWeek, setEveryTwoWeek, ...props }: FormDatePickerProps,
    ref,
  ) => {
    const form = useFormContext<AMAPFormValues>();
    const [open, setOpen] = useState(false);
    const startDate = form.watch("startDate");
    const endDate = form.watch("endDate");
    const day = form.watch("day");

    function onSelectDate(selectedDate: Date | undefined, isEveryTwoWeek: boolean) {
      if (!selectedDate) {
        return;
      }

      if (!startDate && !endDate) {
        return;
      }
      const start = title === "Date de fin" ? new Date(startDate) : selectedDate;
      const end = title === "Date de fin" ? selectedDate : new Date(endDate);
      const shippingDays = getDaysBetweenDates({ from: start, to: end, day });

      if (shippingDays) {
        if (isEveryTwoWeek) {
          const daysOfAbsence = shippingDays.filter((_, index) => index % 2 === 1);
          const remainingShippingDays = shippingDays.filter((_, index) => index % 2 !== 1);

          form.setValue("daysOfAbsence", daysOfAbsence);
          form.setValue("shippingDays", remainingShippingDays);
        } else {
          form.setValue("daysOfAbsence", []);
          form.setValue("shippingDays", shippingDays);
        }
      }
      setDate(selectedDate);
      setOpen(false);
    }

    return (
      <FormItem className={cn("w-64", className)}>
        <FormLabel
          className="flex items-center justify-between gap-2 relative
        "
        >
          <span>{title}</span>
          {title === "Date de début" && (
            <Toggle
              aria-label="every two weeks"
              className="text-xs  p-1 absolute right-0 h-auto -top-2 "
              variant={"outline"}
              pressed={everyTwoWeek}
              onPressedChange={(p) => {
                setEveryTwoWeek(p);
                onSelectDate(date, p);
              }}
            >
              Toutes les deux semaines
            </Toggle>
          )}
        </FormLabel>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              disabled={disabled}
              variant={"outline"}
              className={cn("relative w-full pl-3 text-left font-normal", !date && "text-muted-foreground")}
              ref={ref}
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
              {...props}
              mode="single"
              captionLayout="dropdown"
              selected={date}
              // month={month}
              defaultMonth={date}
              locale={fr}
              onSelect={(date) => onSelectDate(date, everyTwoWeek)}
              startMonth={new Date()}
              endMonth={new Date(new Date().setFullYear(new Date().getFullYear() + 1, 11))}
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
              // footer={GetFooterMessage(isDayAvailable)}
              // onMonthChange={setMonth}
            />
          </PopoverContent>
        </Popover>
      </FormItem>
    );
  },
);

FormDatePicker.displayName = "FormDatePicker";

export default FormDatePicker;
