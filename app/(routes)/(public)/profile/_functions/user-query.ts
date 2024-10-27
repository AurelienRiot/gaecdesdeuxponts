"use client";

import type { GetUserReturnType } from "@/actions/get-user";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchUser } from "../_actions/user-fetch";

export function useUserQuery() {
  return useQuery({
    queryFn: async () => await fetchUser(),
    queryKey: ["userProfile"],
    staleTime: 10 * 60 * 1000,
  });
}

export function useUserQueryClient() {
  const queryClient = useQueryClient();

  const mutateUser = (fn: (user?: GetUserReturnType | null) => GetUserReturnType | null | undefined) => {
    queryClient.setQueryData(["userProfile"], fn);
  };

  const refectUser = () => queryClient.invalidateQueries({ queryKey: ["userProfile"] });
  return { mutateUser, refectUser };
}
