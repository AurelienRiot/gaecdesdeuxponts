"use client";

import { calendarOrderSchema, type CalendarOrderType } from "@/components/zod-schema/calendar-orders";
import customKy from "@/lib/custom-ky";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

async function fetchOrders(dateArray: string[]) {
  const from = new Date(dateArray[0]);
  const to = new Date(dateArray[dateArray.length - 1]);
  const searchParams = new URLSearchParams({
    from: from.toISOString(),
    to: to.toISOString(),
  });
  return await customKy("/api/orders", "GET", z.array(calendarOrderSchema), { searchParams });
}

export function useOrdersQuery(dateArray: string[]) {
  return useQuery({
    queryFn: async () => await fetchOrders(dateArray),
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

  const refectOrders = () => {
    setTimeout(() => queryClient.invalidateQueries({ queryKey: ["fetchOrders"] }), 0);
  };
  return { refectOrders, mutateOrders };
}
