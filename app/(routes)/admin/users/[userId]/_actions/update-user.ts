"use server";
import { defaultAddress } from "@/components/zod-schema/address-schema";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { revalidateTag } from "next/cache";
import { schema, type UserFormValues } from "../_components/user-schema";

async function updateUser(data: UserFormValues) {
  return await safeServerAction({
    data,
    schema,
    roles: ["admin"],
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

      await prismadb.user.update({
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
          ccInvoice,
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
      });
      revalidateTag("users");

      return {
        success: true,
        message: "Utilisateur mis à jour",
      };
    },
  });
}

export default updateUser;
