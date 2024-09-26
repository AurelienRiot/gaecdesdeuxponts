"use server";

import safeServerAction from "@/lib/server-action";
import { type UserFormValues, formSchema } from "../_components/form-schema";
import { getSessionUser } from "@/actions/get-user";
import prismadb from "@/lib/prismadb";
import { defaultAddress } from "@/components/zod-schema/address-schema";
import { revalidateTag } from "next/cache";

async function getUser(id: string) {
  return await prismadb.user.findUnique({
    where: { id },
    select: { billingAddress: true, id: true },
  });
}

async function updateUser(data: UserFormValues) {
  return await safeServerAction({
    data,
    schema: formSchema,
    serverAction: async ({ address, billingAddress, company, name, phone }, { id }) => {
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
          company,
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
        message: "Profil mise à jour",
      };
    },
  });
}

export default updateUser;
