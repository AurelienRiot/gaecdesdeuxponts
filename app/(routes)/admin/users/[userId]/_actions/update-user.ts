"use server";
import { checkAdmin } from "@/components/auth/checkAuth";
import { defaultAddress } from "@/components/zod-schema/address-schema";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { schema, type UserFormValues } from "../_components/user-schema";

async function updateUser(data: UserFormValues) {
  return await safeServerAction({
    data,
    schema,
    getUser: checkAdmin,
    serverAction: async (data) => {
      const { id, name, company, phone, isPro, address, billingAddress, image, completed } = data;
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
          company: isPro ? company?.trim() : undefined,
          phone,
          image,
          completed,
          role: isPro ? "pro" : "user",
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
      return {
        success: true,
        message: "Utilisateur mise à jour",
      };
    },
  });
}

export default updateUser;
