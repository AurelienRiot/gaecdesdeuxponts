"use client";
import { Calendar } from "@/components/ui/calendar";
import { useRouter } from "next/navigation";

function OrdersCalendar({ month, date, setDate }: { month: Date; date: Date; setDate: (date: Date) => void }) {
  const router = useRouter();
  return (
    <div className="max-w-64">
      <Calendar
        mode="single"
        selected={date}
        onSelect={(e) => {
          console.log(e.toISOString());
          setDate(e);
        }}
        month={month}
        onMonthChange={(e) => {
          router.push(`/admin/calendar?date=${e.toISOString()}`);
        }}
        required
      />
    </div>
  );
}

export default OrdersCalendar;
