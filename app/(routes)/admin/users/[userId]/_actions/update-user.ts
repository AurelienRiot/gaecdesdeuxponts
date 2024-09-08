"use server";
import { checkAdmin } from "@/components/auth/checkAuth";
import { defaultAddress } from "@/components/zod-schema/address-schema";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { schema, type UserFormValues } from "../_components/user-schema";
import { revalidateTag } from "next/cache";

async function updateUser(data: UserFormValues) {
  return await safeServerAction({
    data,
    schema,
    getUser: checkAdmin,
    serverAction: async ({ id, name, company, phone, role, address, billingAddress, image, completed, notes }) => {
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
          phone,
          image,
          completed,
          role,
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
        message: "Utilisateur mise à jour",
      };
    },
  });
}

export default updateUser;
