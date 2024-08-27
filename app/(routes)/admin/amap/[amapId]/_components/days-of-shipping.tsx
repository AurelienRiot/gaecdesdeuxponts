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

  console.log({ daysOfAbsence, shippingDays });

  if (!startDate || !endDate) return null;

  function handleDayClick(day: Date) {
    if (shippingDays.some((d) => d.getTime() === day.getTime())) {
      form.setValue(
        "shippingDays",
        shippingDays.filter((d) => d.getTime() !== day.getTime()),
      );
      form.setValue("daysOfAbsence", [...daysOfAbsence, day]);
    } else {
      form.setValue(
        "daysOfAbsence",
        daysOfAbsence.filter((d) => d.getTime() !== day.getTime()),
      );
      form.setValue("shippingDays", [...shippingDays, day]);
    }
    setDate(day);
  }

  function disabledDay(day: Date) {
    const dayOfWeek = day.getDay();
    const isBeforeStartDate = day < new Date(startDate);
    const isAfterEndDate = day > new Date(endDate);
    const isNotTuesday = dayOfWeek !== 2; // 2 represents Tuesday

    return isBeforeStartDate || isAfterEndDate || isNotTuesday;
  }

  return (
    <>
      <Label>Date de livraisons</Label>
      <Calendar
        mode="single"
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
          day: "p-0 size-8 text-sm flex-1 flex items-center justify-center rounded-md has-[button]",
        }}
        modifiersClassNames={{
          shipping: "bg-green-500 text-green-100 hover:bg-green-500/90",
          removed: "bg-destructive text-destructive-100 hover:bg-destructive/90",
        }}
        onDayClick={handleDayClick}
      />

      <DisplayShippingDays days={shippingDays} />
    </>
  );
}

export default DaysOfShipping;

function DisplayShippingDays({ days }: { days: Date[] }) {
  const groupedDates = groupedDatesByMonth(days);
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
