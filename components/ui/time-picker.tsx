"use client";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useState } from "react";
import { ScrollArea } from "./scroll-area";

type TimePickerProps = {
  className?: string;
  popoverClassName?: string;
  value?: Date | null;
  onChange: (value?: Date) => void;
  timeOptions: Date[];
};

const TimePicker = ({ className, popoverClassName, value, onChange, timeOptions }: TimePickerProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[240px] justify-between", className)}
        >
          {value?.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
          <Icons.Clock className="ml-auto h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("w-[200px] p-0 z-[1300]", popoverClassName)}>
        <ScrollArea className="h-[240px] overflow-y-scroll">
          {timeOptions.map((time) => {
            const dateValue = time.toISOString();
            const displayDate = time.toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            });
            return (
              <button
                type="button"
                key={dateValue}
                className="relative flex cursor-pointer  items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground w-full"
                onClick={() => {
                  onChange(time);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn("mr-2 h-4 w-4", value?.toISOString() === dateValue ? "opacity-100" : "opacity-0")}
                />
                {displayDate}
              </button>
            );
          })}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default TimePicker;

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
