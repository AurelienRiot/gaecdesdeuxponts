import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Calendar, type CalendarProps } from "@/components/ui/calendar";
import { FormItem, FormLabel } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { dateFormatter, getDaysBetweenDates } from "@/lib/date-utils";
import { cn } from "@/lib/utils";
import { fr } from "date-fns/locale";
import { forwardRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import type { AMAPFormValues } from "./amap-schema";

type FormDatePickerProps = Omit<CalendarProps, "disabled"> & {
  title: "Date de fin" | "Date de début";
  className?: string;
  date: Date | undefined;
  disabled?: boolean;
  setDate: (date: Date | undefined) => void;
};

const FormDatePicker = forwardRef<HTMLButtonElement, FormDatePickerProps>(
  ({ title, className, date, disabled, setDate, ...props }: FormDatePickerProps, ref) => {
    const form = useFormContext<AMAPFormValues>();
    const [open, setOpen] = useState(false);
    const startDate = form.watch("startDate");
    const endDate = form.watch("endDate");
    const day = form.watch("day");

    function onSelectDate(selectedDate: Date | undefined) {
      if (!selectedDate) {
        return;
      }

      setDate(selectedDate);
      setOpen(false);

      if (!startDate && !endDate) {
        return;
      }
      form.setValue("daysOfAbsence", []);
      const start = title === "Date de fin" ? new Date(startDate) : selectedDate;
      const end = title === "Date de fin" ? selectedDate : new Date(endDate);
      const shippingDays = getDaysBetweenDates({ from: start, to: end, day });

      shippingDays && form.setValue("shippingDays", shippingDays);
    }

    return (
      <FormItem className={cn("w-64", className)}>
        <FormLabel className="flex items-center justify-between gap-2">
          <span>{title}</span>
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
              onSelect={onSelectDate}
              disabled={(d) => d < new Date()}
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
