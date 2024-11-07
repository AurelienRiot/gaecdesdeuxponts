"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { UsersForOrderType } from "../../orders/[orderId]/_functions/get-users-for-orders";
import getUsersForOrdersAction from "../_actions/get-users-for-orders";

async function fetchUsers() {
  const responce = await getUsersForOrdersAction({});
  // const responce = (await ky.post("/api/get-day-orders", { json: { from, to } }).json()) as Awaited<
  //   ReturnType<typeof getDailyOrders>
  // >;
  if (!responce.success) {
    throw new Error(responce.message);
  }
  if (!responce.data) {
    throw new Error("Impossible de charger les commandes");
  }

  return responce.data;
}

export function useUsersQuery() {
  return useQuery({
    queryFn: async () => await fetchUsers(),
    queryKey: ["fetchUsers"],
    staleTime: 60 * 60 * 1000,
  });
}

export function useOrdersQueryClient() {
  const queryClient = useQueryClient();

  const mutateUsers = (fn: (users: UsersForOrderType[]) => UsersForOrderType[]) => {
    setTimeout(() => {
      queryClient.setQueryData(["fetchUsers"], (users?: UsersForOrderType[] | null) => {
        if (users) return fn(users);
      });
    }, 0);
  };

  const refectUsers = () => {
    setTimeout(() => queryClient.invalidateQueries({ queryKey: ["fetchUsers"] }), 0);
  };
  return { refectUsers, mutateUsers };
}
