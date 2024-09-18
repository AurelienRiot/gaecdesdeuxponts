"use client";

import DateModal from "@/components/date-modal";
import { ONE_DAY, getLocalIsoString } from "@/lib/date-utils";
import { addDays } from "date-fns";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";

const from = new Date(new Date().getTime() - 14 * ONE_DAY);
const to = addDays(new Date(), 30);

const isDateDisabled = (date: Date) => {
  return date < from || date > to;
};

function TodayFocus({ className }: { className?: string }) {
  const router = useRouter();
  return (
    <DateModal
      trigger={"Date"}
      triggerClassName="text-primary border-dashed w-fit"
      onDayClick={(date) => {
        router.replace(`?day=${getLocalIsoString(date)}&refresh=${nanoid(3)}`);
      }}
      modifiers={{
        disabled: (date) => isDateDisabled(date),
      }}
    />
  );
}

export default TodayFocus;
