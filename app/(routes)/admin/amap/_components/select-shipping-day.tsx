"use client";

import SelectSheet, { createDateValues } from "@/components/select-sheet";
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
  const values = createDateValues(shippingDays, nextDay);
  return (
    <>
      <SelectSheet
        title="Selectionner la date"
        trigger={dateFormatter(selectedShippingDay, { days: true })}
        values={values}
        selectedValue={selectedShippingDay.toISOString()}
        onSelected={(value) => {
          if (!value) {
            return;
          }
          router.push(constructQueryString({ newParamKey: "shippingDay", newParamValue: value.key, searchParams }), {
            scroll: false,
          });
        }}
      />
    </>
  );
}

export default SelectShippingDay;
