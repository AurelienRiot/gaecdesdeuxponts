"use server";
import { SHIPPING_ONLY } from "@/components/auth";
import { defaultAddress } from "@/components/zod-schema/address-schema";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { revalidateTag } from "next/cache";
import { schema, type UserFormValues } from "../_components/user-schema";
import { formatUser } from "../../../orders/[orderId]/_functions/get-users-for-orders";

async function updateUser(data: UserFormValues) {
  return await safeServerAction({
    data,
    schema,
    roles: SHIPPING_ONLY,
    serverAction: async ({
      id,
      name,
      company,
      raisonSocial,
      phone,
      role,
      address,
      billingAddress,
      image,
      completed,
      notes,
      ccInvoice,
    }) => {
      const user = await prismadb.user.findUnique({
        where: { id },
        select: { billingAddress: true },
      });

      if (!user) {
        return {
          success: false,
          message: "Utilisateur introuvable",
        };
      }

      const updateUser = await prismadb.user.update({
        where: {
          id,
        },
        data: {
          name: name.trim(),
          company: role === "pro" ? company?.trim() : undefined,
          raisonSocial: role === "pro" ? raisonSocial?.trim() : undefined,
          phone,
          image,
          completed,
          role,
          ccInvoice: role === "pro" ? ccInvoice : [],
          notes,

          address: {
            upsert: {
              create: address ?? defaultAddress,
              update: address ?? defaultAddress,
            },
          },
          billingAddress: billingAddress
            ? {
                upsert: {
                  create: billingAddress,
                  update: billingAddress,
                },
              }
            : user?.billingAddress
              ? { delete: true }
              : undefined,
        },
        include: {
          address: true,
          billingAddress: true,
          shop: { include: { links: true, shopHours: { orderBy: { day: "asc" } } } },
          defaultOrders: { select: { day: true } },
        },
      });
      revalidateTag("users");

      const data = formatUser(updateUser);

      return {
        success: true,
        message: "Utilisateur mis à jour",
        data,
      };
    },
  });
}

export default updateUser;
