"use client";

import DateModal from "@/components/date-modal";
import { getLocalIsoString } from "@/lib/date-utils";
import { cn } from "@/lib/utils";
import { scrollToElement } from "./events-page";

function TodayFocus({ className, startMonth, endMonth }: { className?: string; startMonth: Date; endMonth: Date }) {
  return (
    <DateModal
      trigger={"Date"}
      triggerClassName={cn("text-primary border-dashed w-fit", className)}
      onValueChange={(date) => {
        if (!date) return;
        scrollToElement(getLocalIsoString(date));
      }}
      modifiers={{
        disabled: (date) => date < startMonth || date > endMonth,
      }}
      startMonth={startMonth}
      endMonth={endMonth}
    />
  );
}

export default TodayFocus;
