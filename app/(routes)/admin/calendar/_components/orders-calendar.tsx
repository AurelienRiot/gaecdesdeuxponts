"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { DayPicker, labelNext, labelPrevious, useDayPicker } from "react-day-picker";

function OrdersCalendar({ month, className, orderDates }: { month: Date; orderDates: Date[]; className?: string }) {
  const router = useRouter();

  return (
    <DayPicker
      locale={fr}
      month={month}
      modifiers={{
        order: (day) => orderDates.some((date) => date.toDateString() === day.toDateString()),
      }}
      modifiersClassNames={{
        order: "bg-green-500 text-white hover:bg-green-500/90",
      }}
      onMonthChange={(e) => router.replace(`/admin/calendar?date=${encodeURIComponent(e.toISOString())}`)}
      showOutsideDays={true}
      onDayClick={(date) => router.push(`/admin/calendar/${date.toISOString()}`)}
      className={cn("p-4 w-full max-w-96 mx-auto", className)}
      classNames={{
        months: "flex flex-col md:flex-row md:gap-4 relative justify-center",
        month_caption: "flex justify-center h-7 mx-10 relative items-center",
        weekdays: "flex flex-row",
        weekday: "text-muted-foreground w-12 font-normal text-[0.8rem]",
        month: "gap-y-4 w-full md:odd:mt-0 odd:mt-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium truncate",
        button_next: cn(
          buttonVariants({
            variant: "outline",
            className: "absolute right-0 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
          }),
        ),
        button_previous: cn(
          buttonVariants({
            variant: "outline",
            className: "absolute left-0 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
          }),
        ),
        nav: "flex items-start",
        month_grid: "mt-4",
        week: "flex w-full mt-2",
        day: "p-0 size-12 text-sm flex-1 flex items-center justify-center has-[button]:hover:!bg-accent rounded-md has-[button]:hover:aria-selected:!bg-primary has-[button]:hover:text-accent-foreground has-[button]:hover:aria-selected:text-primary-foreground",
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "size-8 p-0 font-normal transition-none hover:bg-transparent hover:text-inherit aria-selected:opacity-100",
        ),
        range_start: "day-range-start rounded-s-md",
        range_end: "day-range-end rounded-e-md",
        selected: "bg-green-500 text-white hover:!bg-green-500/90",
        today: "bg-accent text-accent-foreground",
        outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        disabled: "text-muted-foreground opacity-50",
        range_middle:
          "aria-selected:bg-accent hover:aria-selected:!bg-accent rounded-none aria-selected:text-accent-foreground hover:aria-selected:text-accent-foreground",
        hidden: "invisible",
        dropdowns: "flex justify-between items-center w-full",
      }}
      components={{
        Chevron: ({ orientation }) => {
          const Icon = orientation === "left" ? ChevronLeft : ChevronRight;
          return <Icon className="h-4 w-4" />;
        },
        Nav: ({ className, children, ...props }) => {
          const { nextMonth, previousMonth, goToMonth } = useDayPicker();

          const isPreviousDisabled = (() => {
            // if (navView === "years") {
            //   return (
            //     (startMonth && differenceInCalendarDays(new Date(displayYears.from - 1, 0, 1), startMonth) < 0) ||
            //     (endMonth && differenceInCalendarDays(new Date(displayYears.from - 1, 0, 1), endMonth) > 0)
            //   );
            // }
            return !previousMonth;
          })();

          const isNextDisabled = (() => {
            // if (navView === "years") {
            //   return (
            //     (startMonth && differenceInCalendarDays(new Date(displayYears.to + 1, 0, 1), startMonth) < 0) ||
            //     (endMonth && differenceInCalendarDays(new Date(displayYears.to + 1, 0, 1), endMonth) > 0)
            //   );
            // }
            return !nextMonth;
          })();

          const handlePreviousClick = React.useCallback(() => {
            if (!previousMonth) return;
            // if (navView === "years") {
            //   setDisplayYears((prev) => ({
            //     from: prev.from - (prev.to - prev.from + 1),
            //     to: prev.to - (prev.to - prev.from + 1),
            //   }));
            //   onPrevClick?.(new Date(displayYears.from - (displayYears.to - displayYears.from), 0, 1));
            //   return;
            // }
            goToMonth(previousMonth);
          }, [previousMonth, goToMonth]);

          const handleNextClick = React.useCallback(() => {
            if (!nextMonth) return;
            // if (navView === "years") {
            //   setDisplayYears((prev) => ({
            //     from: prev.from + (prev.to - prev.from + 1),
            //     to: prev.to + (prev.to - prev.from + 1),
            //   }));
            //   onNextClick?.(new Date(displayYears.from + (displayYears.to - displayYears.from), 0, 1));
            //   return;
            // }
            goToMonth(nextMonth);
          }, [goToMonth, nextMonth]);
          return (
            <nav className={cn("flex items-center", className)} {...props}>
              <Button
                variant="outline"
                className="absolute left-0 h-7 w-7 bg-transparent p-0 opacity-80 hover:opacity-100"
                type="button"
                tabIndex={isPreviousDisabled ? undefined : -1}
                disabled={isPreviousDisabled}
                aria-label={labelPrevious(previousMonth)}
                onClick={handlePreviousClick}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                className="absolute right-0 h-7 w-7 bg-transparent p-0 opacity-80 hover:opacity-100"
                type="button"
                tabIndex={isNextDisabled ? undefined : -1}
                disabled={isNextDisabled}
                aria-label={labelNext(nextMonth)}
                onClick={handleNextClick}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </nav>
          );
        },
        CaptionLabel: ({ children }) => (
          <Button className="h-7 w-full truncate text-sm font-medium" variant="ghost" size="sm">
            {children}
          </Button>
        ),
        MonthGrid: ({ className, children, ...props }) => {
          return (
            <table className={cn("mx-auto", className)} {...props}>
              {children}
            </table>
          );
        },
      }}
      formatters={{ formatWeekdayName: (weekday) => format(new Date(weekday), "EEEE", { locale: fr }) }}
    />
  );
}

export default OrdersCalendar;
