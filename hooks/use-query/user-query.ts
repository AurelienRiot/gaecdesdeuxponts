"use client";

import type { GetUserType } from "@/actions/get-user";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ky, { type HTTPError } from "ky";

async function fetchUser() {
  const responce = await ky
    .get("/api/user")
    .then(async (res) => {
      const result = (await res.json()) as NonNullable<GetUserType>;
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
  responce.createdAt = new Date(responce.createdAt);
  responce.updatedAt = new Date(responce.updatedAt);
  responce.emailVerified = responce.emailVerified ? new Date(responce.emailVerified) : null;
  for (const order of responce.orders) {
    order.createdAt = new Date(order.createdAt);
    order.dateOfEdition = order.dateOfEdition ? new Date(order.dateOfEdition) : null;
    order.dateOfShipping = order.dateOfShipping ? new Date(order.dateOfShipping) : null;
    order.datePickUp = new Date(order.datePickUp);
  }

  return responce;
}

export function useUserQuery() {
  return useQuery({
    queryFn: async () => await fetchUser(),
    queryKey: ["userProfile"],
    staleTime: 10 * 60 * 1000,
  });
}

export function useUserQueryClient() {
  const queryClient = useQueryClient();

  const mutateUser = (fn: (user?: GetUserType | null) => GetUserType | null | undefined) => {
    queryClient.setQueryData(["userProfile"], fn);
  };

  const refectUser = () => queryClient.invalidateQueries({ queryKey: ["userProfile"] });
  return { mutateUser, refectUser };
}
