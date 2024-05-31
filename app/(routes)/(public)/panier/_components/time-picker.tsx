import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MIN_DAYS, dateFormatter, isDateDisabled } from "@/lib/date-utils";
import { cn } from "@/lib/utils";
import { addMonths } from "date-fns";
import { fr } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { makeCartUrl } from "./summary";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import useIsComponentMounted from "@/hooks/use-mounted";

type HourPickerProps = {
  className?: string;
  date: Date;
  shopId: string | undefined;
};

const TimePicker = ({ className, date, shopId }: HourPickerProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const onSelectTime = (dateValue: string) => {
    const selectedDate = new Date(dateValue);

    router.push(makeCartUrl(shopId, selectedDate), {
      scroll: false,
    });
    console.log(selectedDate.toISOString());
  };

  const timeOptions = generateTimeOptions(date);
  return (
    <>
      <div
        className={cn(
          "relative  flex flex-wrap items-center justify-between gap-y-2",
          className,
        )}
      >
        <div className="text-base font-medium text-secondary-foreground">
          Heure de retrait
        </div>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[240px] justify-between"
            >
              {date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
              {/* <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" /> */}
              <Icons.Clock className="ml-auto h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              {/* <CommandInput placeholder="Choisir l'heure" /> */}
              <CommandList>
                {/* <CommandEmpty>Heure introuvable</CommandEmpty> */}
                <CommandGroup>
                  {timeOptions.map((time) => {
                    const dateValue = time.toISOString();
                    const displayDate = time.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                    return (
                      <CommandItem
                        key={dateValue}
                        value={dateValue}
                        onSelect={(currentValue) => {
                          onSelectTime(currentValue);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            date.toISOString() === dateValue
                              ? "opacity-100"
                              : "opacity-0",
                          )}
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
      <p className="text-balance text-sm text-muted-foreground">
        Si vous voulez du lait frais, venir aux heures de traite entre 8h30-9h30
        et 18h-19h
      </p>
    </>
  );
};

export default TimePicker;

const generateTimeOptions = (date: Date) => {
  const times = [];
  let start = new Date(new Date(date).setHours(8, 30, 0, 0));

  const end = new Date(new Date(date).setHours(18, 30, 0, 0));

  while (start <= end) {
    times.push(start);
    start = new Date(start.getTime() + 30 * 60000); // add 30 minutes
  }

  return times;
};

//
