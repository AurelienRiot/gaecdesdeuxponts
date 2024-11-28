"use client";

import { roleSchema } from "@/components/zod-schema";
import { addressSchema } from "@/components/zod-schema/address-schema";
import { billingAddressSchema } from "@/components/zod-schema/billing-address-schema";
import { statusSchema } from "@/components/zod-schema/status";
import customKy from "@/lib/custom-ky";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

export const orderProfileSchema = z.object({
  id: z.string(),
  productsList: z.array(z.object({ name: z.string(), quantity: z.string(), unit: z.string().optional() })),
  products: z.string(),
  totalPrice: z.string(),
  status: statusSchema,
  datePickUp: z.coerce.date(),
  orderEmail: z.coerce.date().nullable(),
  shopName: z.string(),
  delivered: z.boolean(),
  createdAt: z.coerce.date(),
});

const notificationsSchema = z.object({
  sendShippingEmail: z.boolean(),
  sendInvoiceEmail: z.boolean(),
});

const invoiceSchema = z.object({
  id: z.string(),
  totalOrders: z.number(),
  totalPrice: z.string(),
  status: statusSchema,
  emailSend: z.boolean(),
  date: z.string(),
});

const userProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string().nullable(),
  company: z.string().nullable(),
  raisonSocial: z.string().nullable(),
  image: z.string().nullable(),
  role: roleSchema,
  address: addressSchema.nullable(),
  billingAddress: billingAddressSchema.nullable(),
  notifications: notificationsSchema,
  orders: z.array(orderProfileSchema),
  invoices: z.array(invoiceSchema),
});

export type ProfileUserType = z.infer<typeof userProfileSchema>;

export function useUserQuery() {
  return useQuery({
    queryFn: async () => await customKy("/api/user", userProfileSchema, { method: "GET" }),
    queryKey: ["userProfile"],
    staleTime: 10 * 60 * 1000,
  });
}

export function useUserQueryClient() {
  const queryClient = useQueryClient();

  const mutateUser = (fn: (orduserers: ProfileUserType) => ProfileUserType) => {
    setTimeout(() => {
      queryClient.setQueryData(["userProfile"], (user?: ProfileUserType | null) => {
        if (user) return fn(user);
      });
    }, 0);
  };

  const refectUser = () => queryClient.invalidateQueries({ queryKey: ["userProfile"] });
  return { mutateUser, refectUser };
}
