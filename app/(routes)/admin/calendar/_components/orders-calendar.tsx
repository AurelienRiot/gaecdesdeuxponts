"use client";
import { Calendar } from "@/components/ui/calendar";
import { useRouter } from "next/navigation";
import { useState } from "react";

function OrdersCalendar({ month }: { month: Date }) {
  const router = useRouter();
  const [date, setDate] = useState(new Date());
  return (
    <div className="max-w-64">
      <Calendar
        mode="single"
        selected={date}
        onSelect={(e) => {
          setDate(e);
          router.push(`/admin/calendar/${e.toISOString()}`);
        }}
        month={month}
        onMonthChange={(e) => router.replace(`/admin/calendar?date=${encodeURIComponent(e.toISOString())}`)}
        required
      />
    </div>
  );
}

export default OrdersCalendar;
