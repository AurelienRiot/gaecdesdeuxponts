"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import getDailyOrders from "../_actions/get-daily-orders";

async function fetchOrders(dateArray: string[]) {
  const from = new Date(dateArray[0]);
  const to = new Date(dateArray[dateArray.length - 1]);
  const responce = await getDailyOrders({ from, to });
  // const responce = (await ky.post("/api/get-day-orders", { json: { from, to } }).json()) as Awaited<
  //   ReturnType<typeof getDailyOrders>
  // >;
  if (!responce.success) {
    throw new Error(responce.message);
  }
  if (!responce.data) {
    throw new Error("Impossible de charger les commandes");
  }
  for (const order of responce.data) {
    order.createdAt = new Date(order.createdAt);
    order.shippingDate = new Date(order.shippingDate);
  }
  return responce.data;
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

  // const mutateUser = (fn: (user?: GetUserReturnType | null) => GetUserReturnType | null | undefined) => {
  //   queryClient.setQueryData(["userProfile"], fn);
  // };

  const refectOrders = () => queryClient.invalidateQueries({ queryKey: ["fetchOrders"] });
  return { refectOrders };
}
