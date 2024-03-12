"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange, DayPicker } from "react-day-picker";
import { fr } from "date-fns/locale";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type DatePickerWithRangeProps = Omit<
  React.ComponentProps<typeof DayPicker>,
  "selected" | "onSelect" | "mode"
> & {
  date: DateRange | undefined;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  popoverClassName?: string;
};
export function DatePickerWithRange({
  popoverClassName,
  date,
  setDate,
  captionLayout = "dropdown-buttons",
  numberOfMonths = 2,
  fromYear = 1930,
  toYear = 2030,
  ...props
}: DatePickerWithRangeProps) {
  return (
    <div className={cn("grid gap-2", popoverClassName)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "d MMMM yyyy", { locale: fr })} -{" "}
                  {format(date.to, "d MMMM yyyy", { locale: fr })}
                </>
              ) : (
                format(date.from, "d MMMM yyyy", { locale: fr })
              )
            ) : (
              <span>Choisir une date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            captionLayout={captionLayout}
            locale={fr}
            mode={"range"}
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={numberOfMonths}
            fromYear={fromYear}
            toYear={toYear}
            {...props}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
