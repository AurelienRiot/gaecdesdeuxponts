import { ONE_DAY } from "@/lib/date-utils";
import { addDays } from "date-fns";

export const from = addDays(new Date(), -20);
export const to = addDays(new Date(), 30);

function makeDateArrayForOrders() {
  const arrayLength = Math.round((to.getTime() - from.getTime()) / ONE_DAY);
  return new Array(arrayLength).fill(0).map((_, index) => {
    return new Date(from.getTime() + index * ONE_DAY).toISOString().split("T")[0];
  });
}

export const dateArray = makeDateArrayForOrders();
