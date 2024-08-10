import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Calendar, type CalendarProps } from "@/components/ui/calendar";
import { FormItem, FormLabel } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { dateFormatter } from "@/lib/date-utils";
import { cn } from "@/lib/utils";
import { fr } from "date-fns/locale";
import { forwardRef, useState } from "react";

type FormDatePickerProps = Omit<CalendarProps, "disabled"> & {
  title: string;
  className?: string;
  button?: "reset" | "uptade" | "none";
  date: Date | undefined | null;
  disabled?: boolean;
  onSelectDate: (date: Date | undefined | null) => void;
};

const FormDatePicker = forwardRef<HTMLButtonElement, FormDatePickerProps>(
  ({ title, className, date, button = "reset", disabled, onSelectDate, ...props }: FormDatePickerProps, ref) => {
    const [open, setOpen] = useState(false);

    return (
      <FormItem className={cn("w-64", className)}>
        <FormLabel className="flex items-center justify-between gap-2">
          <span>{title}</span>
          {button === "reset" && (
            <Button
              variant={"outline"}
              onClick={() => {
                onSelectDate(null);
              }}
              type="button"
              size={"xs"}
              className="border-dashed text-xs"
            >
              Réninitialiser
            </Button>
          )}
          {button === "uptade" && (
            <Button
              variant={"outline"}
              onClick={() => {
                onSelectDate(new Date());
              }}
              type="button"
              size={"xs"}
              className="border-dashed text-xs"
            >
              Actualiser
            </Button>
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
              captionLayout="dropdown"
              selected={date ?? undefined}
              // month={month}
              locale={fr}
              onSelect={(d) => {
                if (d) {
                  const selectedDate = new Date(d);
                  if (date) {
                    selectedDate.setHours(date.getHours());
                    selectedDate.setMinutes(date.getMinutes());
                  } else {
                    selectedDate.setHours(8);
                    selectedDate.setMinutes(30);
                  }
                  onSelectDate(selectedDate);
                } else {
                  onSelectDate(undefined);
                }
                setOpen(false);
              }}

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
  },
);

FormDatePicker.displayName = "FormDatePicker";

export default FormDatePicker;
