"use client";

import { fr } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import type * as React from "react";
import type { DateRange, DayPicker } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { dateFormatter } from "@/lib/date-utils";
import { cn } from "@/lib/utils";

type DatePickerWithRangeProps = Omit<React.ComponentProps<typeof DayPicker>, "selected" | "onSelect" | "mode"> & {
  date: DateRange | undefined;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  popoverClassName?: string;
};
export function DatePickerWithRange({
  popoverClassName,
  date,
  setDate,
  captionLayout = "dropdown",
  numberOfMonths = 2,
  startMonth,
  endMonth,
  ...props
}: DatePickerWithRangeProps) {
  return (
    <div className={cn("grid gap-2", popoverClassName)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn("max-w-[300px] justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {dateFormatter(date.from)} - {dateFormatter(date.to)}
                </>
              ) : (
                dateFormatter(date.from)
              )
            ) : (
              <span>Choisir une date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            // initialFocus
            captionLayout={captionLayout}
            locale={fr}
            mode={"range"}
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={numberOfMonths}
            startMonth={startMonth}
            endMonth={endMonth}
            {...props}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
