"use client";
import { dateFormatter } from "@/lib/date-utils";
import { cn } from "@/lib/utils";
import { fr } from "date-fns/locale";
import * as React from "react";
import { Icons } from "./icons";
import { Button } from "./ui/button";
import { Calendar, type CalendarProps } from "./ui/calendar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";

type DateModalProps = Omit<CalendarProps, "mode"> & {
  value?: Date;
  onValueChange: (value?: Date) => void;
  triggerClassName?: string;
  trigger?: React.ReactNode;
};

const DateModal = React.forwardRef<HTMLButtonElement, DateModalProps>(
  ({ className, triggerClassName, onValueChange, value, defaultMonth, trigger, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
      <Sheet modal open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            ref={ref}
            variant={"outline"}
            className={cn("w-[240px] pl-3 text-left font-normal", !value && "text-muted-foreground", triggerClassName)}
          >
            {trigger ? (
              trigger
            ) : (
              <>
                {value ? dateFormatter(value, { days: true }) : <span>Choisir une date</span>}

                <Icons.coloredCalendar
                  className="ml-auto h-4 w-4 opacity-100 data-[state=false]:opacity-50"
                  data-state={!!value}
                />
              </>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent
          side={"bottom"}
          className={cn("pb-8 max-h-[90dvh] gap-14 flex flex-col justify-between ", className)}
        >
          <SheetHeader className="mx-auto w-full max-w-sm ">
            <SheetTitle className="text-center">{"Selectionner une date"}</SheetTitle>
          </SheetHeader>
          <Calendar
            mode="single"
            className="p-3 mx-auto w-full max-w-[275px] scale-125 "
            captionLayout="label"
            selected={value}
            defaultMonth={value ? value : defaultMonth}
            locale={fr}
            onSelect={async (date) => {
              await onValueChange(date);
              setIsOpen(false);
            }}
            startMonth={new Date(new Date().getFullYear(), new Date().getMonth())}
            endMonth={new Date(new Date().getFullYear() + 2, 11)}
            classNames={{
              today: "bg-green-300 ",
            }}
            {...props}
          />
          <QuickButtons onValueChange={onValueChange} setOpen={setIsOpen} />
        </SheetContent>
      </Sheet>
    );
  },
);

DateModal.displayName = "DateModal";

export default DateModal;

function QuickButtons({
  onValueChange,
  setOpen,
}: { onValueChange: (value?: Date) => void; setOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
  const nextMonday = new Date();
  nextMonday.setDate(nextMonday.getDate() + ((1 - nextMonday.getDay() + 7) % 7 || 7));
  const nextTuesday = new Date();
  nextTuesday.setDate(nextTuesday.getDate() + ((2 - nextTuesday.getDay() + 7) % 7 || 7));
  const nextThursday = new Date();
  nextThursday.setDate(nextThursday.getDate() + ((4 - nextThursday.getDay() + 7) % 7 || 7));
  const nextFriday = new Date();
  nextFriday.setDate(nextFriday.getDate() + ((5 - nextFriday.getDay() + 7) % 7 || 7));

  return (
    <div className="flex justify-center gap-4 items-center">
      <Button
        variant="secondary"
        className="text-xs sm:text-sm"
        onClick={() => {
          onValueChange?.(nextMonday);
          setOpen(false);
        }}
      >
        Lundi
      </Button>
      <Button
        variant="secondary"
        className="text-xs sm:text-sm"
        onClick={() => {
          onValueChange?.(nextTuesday);
          setOpen(false);
        }}
      >
        Mardi
      </Button>
      <Button
        variant="secondary"
        className="text-xs sm:text-sm"
        onClick={() => {
          onValueChange?.(nextThursday);
          setOpen(false);
        }}
      >
        Jeudi
      </Button>
      <Button
        variant="secondary"
        className="text-xs sm:text-sm"
        onClick={() => {
          onValueChange?.(nextFriday);
          setOpen(false);
        }}
      >
        Vendredi
      </Button>
    </div>
  );
}
