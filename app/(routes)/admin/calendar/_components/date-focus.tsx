"use client";

import DateModal from "@/components/date-modal";
import { getLocalIsoString } from "@/lib/date-utils";
import { cn } from "@/lib/utils";

function TodayFocus({
  className,
  startMonth,
  endMonth,
  scrollToElement,
}: {
  className?: string;
  startMonth: Date;
  endMonth: Date;
  scrollToElement: (id: string, behavior: "smooth" | "auto") => void;
}) {
  return (
    <DateModal
      trigger={"Date"}
      triggerClassName={cn("text-primary border-dashed w-fit", className)}
      onValueChange={(date) => {
        if (!date) return;
        scrollToElement(getLocalIsoString(date), "auto");
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
