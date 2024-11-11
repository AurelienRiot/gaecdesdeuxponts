"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import ky, { type HTTPError } from "ky";
import type { UsersForOrderType } from "../../app/(routes)/admin/orders/[orderId]/_functions/get-users-for-orders";

async function fetchUsers() {
  const responce = await ky
    .get("/api/users")
    .then(async (res) => {
      const result = (await res.json()) as UsersForOrderType[];
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

  return responce;
}

export function useUsersQuery() {
  return useQuery({
    queryFn: async () => await fetchUsers(),
    queryKey: ["fetchUsers"],
    staleTime: 24 * 60 * 60 * 1000,
  });
}

export function useUsersQueryClient() {
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
