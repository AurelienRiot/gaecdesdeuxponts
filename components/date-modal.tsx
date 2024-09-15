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
        <SheetContent side={"bottom"} className={cn("pb-6 h-[400px]", className)}>
          <SheetHeader className="mx-auto w-full max-w-sm ">
            <SheetTitle className="text-center">{"Selectionner une date"}</SheetTitle>
          </SheetHeader>
          <Calendar
            mode="single"
            className="p-3 mx-auto w-full max-w-[275px] "
            captionLayout="label"
            selected={value}
            defaultMonth={value ? value : defaultMonth}
            locale={fr}
            onSelect={(date) => {
              onValueChange(date);
              setIsOpen(false);
            }}
            startMonth={new Date(new Date().getFullYear(), new Date().getMonth())}
            endMonth={new Date(new Date().getFullYear() + 2, 11)}
            {...props}
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
          />
        </SheetContent>
      </Sheet>
    );
  },
);

DateModal.displayName = "DateModal";

export default DateModal;
