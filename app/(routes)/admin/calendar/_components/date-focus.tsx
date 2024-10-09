"use client";

import DateModal from "@/components/date-modal";
import { ONE_DAY, getLocalIsoString } from "@/lib/date-utils";
import { cn } from "@/lib/utils";
import { addDays } from "date-fns";
import { useRouter } from "next/navigation";

const from = new Date(new Date().getTime() - 10 * ONE_DAY);
const to = addDays(new Date(), 30);

const isDateDisabled = (date: Date) => {
  return date < from || date > to;
};

function TodayFocus({ className }: { className?: string }) {
  const router = useRouter();
  return (
    <DateModal
      trigger={"Date"}
      triggerClassName={cn("text-primary border-dashed w-fit", className)}
      onValueChange={(date) => {
        if (!date) return;
        router.replace(`?day=${getLocalIsoString(date)}&refresh=true`);
      }}
      modifiers={{
        disabled: (date) => isDateDisabled(date),
      }}
      startMonth={new Date(new Date().getFullYear(), new Date().getMonth() - 1)}
      endMonth={new Date(new Date().getFullYear(), new Date().getMonth() + 1)}
    />
  );
}

export default TodayFocus;
