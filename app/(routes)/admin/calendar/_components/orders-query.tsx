"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import ky, { type HTTPError } from "ky";
import type { CalendarOrdersType } from "../_functions/get-orders";

async function fetchOrders(dateArray: string[]) {
  const from = new Date(dateArray[0]);
  const to = new Date(dateArray[dateArray.length - 1]);
  const searchParams = new URLSearchParams({
    from: from.toISOString(),
    to: to.toISOString(),
  });
  const responce = await ky
    .get(`/api/calendar/orders?${searchParams.toString()}`)
    .then(async (res) => {
      const result = (await res.json()) as CalendarOrdersType[];
      return result;
    })
    .catch(async (kyError: HTTPError) => {
      if (kyError.response) {
        const errorData = await kyError.response.text();
        console.error(errorData);
        return errorData;
      }
      console.error("Erreur timeout");
      return "Erreur";
    });

  if (typeof responce === "string") {
    throw new Error("Impossible de charger les commandes");
  }
  for (const order of responce) {
    order.createdAt = new Date(order.createdAt);
    order.shippingDate = new Date(order.shippingDate);
  }
  return responce;
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

  const mutateOrders = (fn: (orders: CalendarOrdersType[]) => CalendarOrdersType[]) => {
    setTimeout(() => {
      queryClient.setQueryData(["fetchOrders"], (orders?: CalendarOrdersType[] | null) => {
        if (orders) return fn(orders);
      });
    }, 0);
  };

  const refectOrders = () => {
    setTimeout(() => queryClient.invalidateQueries({ queryKey: ["fetchOrders"] }), 0);
  };
  return { refectOrders, mutateOrders };
}
