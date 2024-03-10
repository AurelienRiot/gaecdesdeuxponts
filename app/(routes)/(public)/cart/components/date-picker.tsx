import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, dateFormatter } from "@/lib/utils";
import { fr } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { useState } from "react";

type DatePickerProps = {
  className?: string;
  date: Date | undefined;
};

const DatePicker = ({ className, date }: DatePickerProps) => {
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const onSelect = (date: Date | undefined) => {
    if (!date) return;
    router.push(`/cart?date=${encodeURIComponent(date.toISOString())}`, {
      scroll: false,
    });
    setOpen(false);
  };

  return (
    <div
      className={cn("relative  flex items-center justify-between ", className)}
    >
      <div className="text-base font-medium text-gray-500">Date de retrait</div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[240px] pl-3 text-left font-normal",
              !date && "text-muted-foreground",
            )}
          >
            {date ? dateFormatter(date) : <span>Choisir une date</span>}
            <svg
              width="800px"
              height="800px"
              viewBox="0 0 1024 1024"
              className="ml-auto h-4 w-4 opacity-50"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M106.666667 810.666667V298.666667h810.666666v512c0 46.933333-38.4 85.333333-85.333333 85.333333H192c-46.933333 0-85.333333-38.4-85.333333-85.333333z"
                fill="#CFD8DC"
              />
              <path
                d="M917.333333 213.333333v128H106.666667v-128c0-46.933333 38.4-85.333333 85.333333-85.333333h640c46.933333 0 85.333333 38.4 85.333333 85.333333z"
                fill="#F44336"
              />
              <path
                d="M704 213.333333m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z"
                fill="#B71C1C"
              />
              <path
                d="M320 213.333333m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z"
                fill="#B71C1C"
              />
              <path
                d="M704 64c-23.466667 0-42.666667 19.2-42.666667 42.666667v106.666666c0 23.466667 19.2 42.666667 42.666667 42.666667s42.666667-19.2 42.666667-42.666667V106.666667c0-23.466667-19.2-42.666667-42.666667-42.666667zM320 64c-23.466667 0-42.666667 19.2-42.666667 42.666667v106.666666c0 23.466667 19.2 42.666667 42.666667 42.666667s42.666667-19.2 42.666667-42.666667V106.666667c0-23.466667-19.2-42.666667-42.666667-42.666667z"
                fill="#B0BEC5"
              />
              <path
                d="M277.333333 426.666667h85.333334v85.333333h-85.333334zM405.333333 426.666667h85.333334v85.333333h-85.333334zM533.333333 426.666667h85.333334v85.333333h-85.333334zM661.333333 426.666667h85.333334v85.333333h-85.333334zM277.333333 554.666667h85.333334v85.333333h-85.333334zM405.333333 554.666667h85.333334v85.333333h-85.333334zM533.333333 554.666667h85.333334v85.333333h-85.333334zM661.333333 554.666667h85.333334v85.333333h-85.333334zM277.333333 682.666667h85.333334v85.333333h-85.333334zM405.333333 682.666667h85.333334v85.333333h-85.333334zM533.333333 682.666667h85.333334v85.333333h-85.333334zM661.333333 682.666667h85.333334v85.333333h-85.333334z"
                fill="#90A4AE"
              />
            </svg>
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="absolute w-auto p-0">
          <Calendar
            mode="single"
            captionLayout="buttons"
            selected={date}
            // month={month}
            locale={fr}
            onSelect={onSelect}
            // disabledDays={(date) => date.getDay() === 0 || date.getDay() === 6}
            modifiers={{
              disabled: (date) =>
                date.getDay() === 0 || date.getDay() === 6 || date < new Date(),
            }} // modifiers={{
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
    </div>
  );
};

export default DatePicker;
