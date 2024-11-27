"use client";

import { userForOrderSchema, type UserForOrderType } from "@/components/zod-schema/user-for-orders-schema";
import customKy from "@/lib/custom-ky";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

export function useUsersQuery() {
  return useQuery({
    queryFn: async () => await customKy("/api/users", z.array(userForOrderSchema), { method: "GET" }),
    queryKey: ["fetchUsers"],
    staleTime: 24 * 60 * 60 * 1000,
  });
}

export function useUsersQueryClient() {
  const queryClient = useQueryClient();

  const mutateUsers = (fn: (users: UserForOrderType[]) => UserForOrderType[]) => {
    setTimeout(() => {
      queryClient.setQueryData(["fetchUsers"], (users?: UserForOrderType[] | null) => {
        if (users)
          return fn(users).sort((a, b) => {
            return a.formattedName.localeCompare(b.formattedName, "fr", {
              sensitivity: "base",
            });
          });
      });
    }, 0);
  };

  const refectUsers = () => {
    setTimeout(() => queryClient.invalidateQueries({ queryKey: ["fetchUsers"] }), 0);
  };
  return { refectUsers, mutateUsers };
}
