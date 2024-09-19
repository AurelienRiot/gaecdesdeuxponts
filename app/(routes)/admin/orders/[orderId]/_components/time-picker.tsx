"use client";
import { generateTimeOptions } from "@/app/(routes)/(public)/panier/_components/time-picker";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useState } from "react";

type HourPickerProps = {
  className?: string;
  date: Date;
  setDate: (time: Date) => void;
};

const TimePicker = ({ className, date, setDate }: HourPickerProps) => {
  const [open, setOpen] = useState(false);
  const timeOptions = generateTimeOptions(date);
  return (
    <div className={cn("space-y-2", className)}>
      <Label>Heure de retrait/livraison</Label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="flex w-[200px] justify-between">
            <span>
              {date.toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <Icons.Clock className="ml-auto h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0  z-[1300]">
          <Command>
            <CommandList>
              <CommandGroup>
                {timeOptions.map((time) => {
                  const dateValue = time.toISOString();
                  const displayDate = time.toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  return (
                    <CommandItem
                      key={dateValue}
                      value={dateValue}
                      onSelect={(currentValue) => {
                        const selectedDate = new Date(currentValue);
                        setDate(selectedDate);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn("mr-2 h-4 w-4", date.toISOString() === dateValue ? "opacity-100" : "opacity-0")}
                      />
                      {displayDate}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TimePicker;
