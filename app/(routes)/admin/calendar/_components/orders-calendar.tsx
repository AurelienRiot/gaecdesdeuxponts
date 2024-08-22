"use client";
import { Calendar } from "@/components/ui/calendar";
import { useRouter } from "next/navigation";
import { useState } from "react";

function OrdersCalendar({ month }: { month: Date }) {
  const [date, setDate] = useState(new Date());
  const router = useRouter();
  return (
    <div className="max-w-64">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        month={month}
        onMonthChange={(e) => router.push(`/admin/calendar?date=${e.toISOString()}`)}
        required
      />
    </div>
  );
}

export default OrdersCalendar;
