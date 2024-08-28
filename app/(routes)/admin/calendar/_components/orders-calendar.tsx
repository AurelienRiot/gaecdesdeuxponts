"use client";
import { Calendar } from "@/components/ui/calendar";
import { fr } from "date-fns/locale";
import { useRouter } from "next/navigation";

function OrdersCalendar({ month }: { month: Date }) {
  const router = useRouter();
  return (
    <div className="max-w-64 mx-auto">
      <Calendar
        locale={fr}
        onDayClick={(date) => router.push(`/admin/calendar/${date.toISOString()}`)}
        month={month}
        onMonthChange={(e) => router.replace(`/admin/calendar?date=${encodeURIComponent(e.toISOString())}`)}
      />
    </div>
  );
}

export default OrdersCalendar;
