import { ONE_DAY } from "@/lib/date-utils";
import { addDays } from "date-fns";

export function makeDateArrayForOrders(today: Date) {
  const from = addDays(today, -20);
  const to = addDays(today, 30);
  const arrayLength = Math.round((to.getTime() - from.getTime()) / ONE_DAY);
  const dateArray = new Array(arrayLength).fill(0).map((_, index) => {
    return new Date(from.getTime() + index * ONE_DAY).toISOString().split("T")[0];
  });
  return { dateArray, from, to };
}
