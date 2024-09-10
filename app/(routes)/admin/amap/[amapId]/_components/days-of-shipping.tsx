"use client";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { groupedDatesByMonth } from "@/lib/date-utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import type { AMAPFormValues } from "./amap-schema";

function DaysOfShipping() {
  const form = useFormContext<AMAPFormValues>();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");
  const shippingDays = form.watch("shippingDays");
  const daysOfAbsence = form.watch("daysOfAbsence");
  const day = form.watch("day");

  if (!startDate || !endDate) return null;

  function handleDayClick(selectedDate: Date) {
    if (shippingDays.some((d) => d.getTime() === selectedDate.getTime())) {
      form.setValue(
        "shippingDays",
        shippingDays.filter((d) => d.getTime() !== selectedDate.getTime()),
      );
      form.setValue("daysOfAbsence", [...daysOfAbsence, selectedDate]);
    } else {
      form.setValue(
        "daysOfAbsence",
        daysOfAbsence.filter((d) => d.getTime() !== selectedDate.getTime()),
      );
      form.setValue("shippingDays", [...shippingDays, selectedDate]);
    }
    setDate(selectedDate);
  }

  function disabledDay(d: Date) {
    const dayOfWeek = d.getDay();
    const isBeforeStartDate = d < new Date(startDate);
    const isAfterEndDate = d > new Date(endDate);
    const isNotDay = dayOfWeek !== day;

    return isBeforeStartDate || isAfterEndDate || isNotDay;
  }

  return (
    <Calendar
      className="p-3 w-72"
      captionLayout="label"
      locale={fr}
      month={date || new Date()}
      startMonth={startDate}
      endMonth={new Date(endDate.getFullYear(), endDate.getMonth() + 1, endDate.getDate())}
      disabled={disabledDay}
      modifiers={{
        shipping: shippingDays,
        removed: daysOfAbsence,
      }}
      classNames={{
        selected: "",
        day: "p-0 size-8 text-sm flex-1 flex items-center justify-center rounded-md ",
      }}
      modifiersClassNames={{
        shipping: "bg-green-500 text-green-100 hover:bg-green-500/90",
        removed: "bg-destructive text-destructive-100 hover:bg-destructive/90",
      }}
      onDayClick={handleDayClick}
    />
  );
}

export default DaysOfShipping;

export function DisplayShippingDays() {
  const form = useFormContext<AMAPFormValues>();
  const shippingDays = form.watch("shippingDays");
  const groupedDates = groupedDatesByMonth(shippingDays);
  const months = Object.keys(groupedDates);
  return (
    <div>
      {months.map((month, index) => (
        <p key={month} className=" flex gap-1">
          <span className="capitalize font-bold">{month}</span>
          {" : "}
          {groupedDates[month].map((date, index) => (
            <span key={index}>
              {groupedDates[month].length === 1
                ? `le ${format(date, "d")}.`
                : index === groupedDates[month].length - 1
                  ? `et le ${format(date, "d")}.`
                  : `le ${format(date, "d")},`}
            </span>
          ))}
        </p>
      ))}
    </div>
  );
}
