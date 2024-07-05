"use server";

import safeServerAction from "@/lib/server-action";
import { type UserFormValues, formSchema } from "../_components/form-schema";
import { getSessionUser } from "@/actions/get-user";
import prismadb from "@/lib/prismadb";
import { defaultAddress } from "@/components/zod-schema/address-schema";

async function getUser() {
  const user = await getSessionUser();
  if (!user) return null;
  return await prismadb.user.findUnique({
    where: { id: user.id },
    select: { billingAddress: true, id: true },
  });
}

async function updateUser(data: UserFormValues) {
  return await safeServerAction({
    data,
    getUser,
    schema: formSchema,
    serverAction: async (data, user) => {
      const { address, billingAddress, company, name, phone } = data;
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

      return {
        success: true,
        message: "Profil mis à jour",
      };
    },
  });
}

export default updateUser;
