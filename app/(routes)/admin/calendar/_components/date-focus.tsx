"use client";

import DateModal from "@/components/date-modal";
import { ONE_DAY, getLocalIsoString } from "@/lib/date-utils";
import { cn } from "@/lib/utils";
import { addDays } from "date-fns";

const from = new Date(new Date().getTime() - 10 * ONE_DAY);
const to = addDays(new Date(), 30);

const isDateDisabled = (date: Date) => {
  return date < from || date > to;
};

function TodayFocus({
  className,
  startMonth,
  endMonth,
  onDayClick,
}: { className?: string; startMonth: Date; endMonth: Date; onDayClick: (id: string) => void }) {
  return (
    <DateModal
      trigger={"Date"}
      triggerClassName={cn("text-primary border-dashed w-fit", className)}
      onValueChange={(date) => {
        if (!date) return;
        onDayClick(getLocalIsoString(date));
      }}
      modifiers={{
        disabled: (date) => isDateDisabled(date),
      }}
      startMonth={startMonth}
      endMonth={endMonth}
    />
  );
}

export default TodayFocus;
