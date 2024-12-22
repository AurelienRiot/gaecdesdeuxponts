"use client";

import { makeDateArrayForOrders } from "@/app/(routes)/admin/calendar/_functions/date-array";
import { calendarOrderSchema, type CalendarOrderType } from "@/components/zod-schema/calendar-orders";
import customKy from "@/lib/custom-ky";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

async function fetchOrders() {
  const { from, to } = makeDateArrayForOrders(new Date());
  const searchParams = new URLSearchParams({
    from: from.toISOString(),
    to: to.toISOString(),
  });
  return await customKy("/api/orders", z.array(calendarOrderSchema), { method: "GET", searchParams });
}

export function useOrdersQuery() {
  return useQuery({
    queryFn: async () => await fetchOrders(),
    queryKey: ["fetchOrders"],
    staleTime: 60 * 60 * 1000,
  });
}

export function useOrdersQueryClient() {
  const queryClient = useQueryClient();

  const mutateOrders = (fn: (orders: CalendarOrderType[]) => CalendarOrderType[]) => {
    setTimeout(() => {
      queryClient.setQueryData(["fetchOrders"], (orders?: CalendarOrderType[] | null) => {
        if (orders) return fn(orders);
      });
    }, 0);
  };

  const refecthOrders = () => {
    setTimeout(() => queryClient.invalidateQueries({ queryKey: ["fetchOrders"] }), 0);
  };
  return { refecthOrders, mutateOrders };
}
