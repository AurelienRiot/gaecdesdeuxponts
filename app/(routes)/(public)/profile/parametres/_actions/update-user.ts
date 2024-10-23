"use server";

import { defaultAddress } from "@/components/zod-schema/address-schema";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { revalidateTag } from "next/cache";
import { type UserFormValues, formSchema } from "../_components/form-schema";

async function getUser(id: string) {
  return await prismadb.user.findUnique({
    where: { id },
    select: { billingAddress: true, id: true, role: true },
  });
}

async function updateUser(data: UserFormValues) {
  return await safeServerAction({
    data,
    schema: formSchema,
    serverAction: async ({ address, billingAddress, company, name, phone, raisonSocial }, { id }) => {
      const user = await getUser(id);
      if (!user) {
        return {
          success: false,
          message: "Utilisateur introuvable",
        };
      }
      await prismadb.user.update({
        where: {
          id: user.id,
        },
        data: {
          name,
          phone,
          company: user.role === "pro" ? company : undefined,
          raisonSocial: user.role === "pro" ? raisonSocial : undefined,
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
            : user.billingAddress
              ? { delete: true }
              : undefined,
        },
      });
      revalidateTag("users");

      return {
        success: true,
        message: "Profile mis à jour",
      };
    },
  });
}

export default updateUser;
