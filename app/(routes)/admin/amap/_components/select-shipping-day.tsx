"use client";

import SelectSheet from "@/components/select-sheet";
import { dateFormatter } from "@/lib/date-utils";
import { constructQueryString } from "@/lib/search-params";
import { useRouter, useSearchParams } from "next/navigation";

function SelectShippingDay({
  shippingDays,
  selectedShippingDay,
  nextDay,
}: { shippingDays: Date[]; selectedShippingDay: Date; nextDay: Date }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  return (
    <>
      <SelectSheet
        title="Selectionner la date"
        trigger={dateFormatter(selectedShippingDay, { days: true })}
        values={shippingDays.map((day) => ({
          label: dateFormatter(day, { days: true }),
          value: { key: day.toISOString() },
          highlight: day.toISOString() === nextDay.toISOString(),
        }))}
        selectedValue={selectedShippingDay.toISOString()}
        onSelected={(value) => {
          router.push(constructQueryString({ newParamKey: "shippingDay", newParamValue: value.key, searchParams }), {
            scroll: false,
          });
        }}
      />
    </>
  );
}

export default SelectShippingDay;
