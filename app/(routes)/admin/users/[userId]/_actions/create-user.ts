"use server";
import { SHIPPING_ONLY } from "@/components/auth";
import { defaultAddress } from "@/components/zod-schema/address-schema";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { revalidateTag } from "next/cache";
import { schema, type UserFormValues } from "../_components/user-schema";
import { formatUser } from "../../../orders/[orderId]/_functions/get-users-for-orders";

async function createUser(data: UserFormValues) {
  return await safeServerAction({
    data,
    schema,
    roles: SHIPPING_ONLY,
    serverAction: async ({
      email,
      name,
      company,
      raisonSocial,
      phone,
      role,
      address,
      billingAddress,
      image,
      id,
      completed,
      notes,
      ccInvoice,
    }) => {
      const user = await prismadb.user.findUnique({
        where: { email },
      });

      if (user) {
        return {
          success: false,
          message: "L'utilisateur existe déja",
        };
      }
      const newUser = await prismadb.user.create({
        data: {
          id,
          name: name,
          email,
          company: role === "pro" ? company : undefined,
          raisonSocial: role === "pro" ? raisonSocial : undefined,
          phone,
          image,
          notes,
          completed,
          role,
          ccInvoice: role === "pro" ? ccInvoice : [],
          address: {
            create: address ?? defaultAddress,
          },

          billingAddress: billingAddress ? { create: billingAddress } : undefined,
        },
        include: {
          address: true,
          billingAddress: true,
          shop: { include: { links: true, shopHours: { orderBy: { day: "asc" } } } },
          defaultOrders: { select: { day: true } },
        },
      });
      revalidateTag("users");

      const data = formatUser(newUser);

      return {
        success: true,
        message: "Utilisateur creé",
        data,
      };
    },
  });
}

export default createUser;
