"use server";
import { checkAdmin } from "@/components/auth/checkAuth";
import { defaultAddress } from "@/components/zod-schema/address-schema";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { schema, type UserFormValues } from "../_components/user-schema";

async function createUser(data: UserFormValues) {
  return await safeServerAction({
    data,
    schema,
    getUser: checkAdmin,
    serverAction: async (data) => {
      const { email, name, company, phone, isPro, address, billingAddress, image, id, completed } = data;
      const user = await prismadb.user.findUnique({
        where: { email },
      });

      if (user) {
        return {
          success: false,
          message: "L'utilisateur existe déja",
        };
      }
      await prismadb.user.create({
        data: {
          id,
          name: name.trim(),
          email,
          company: isPro ? company?.trim() : undefined,
          phone,
          image,
          completed,
          role: isPro ? "pro" : "user",
          address: {
            create: address ?? defaultAddress,
          },

          billingAddress: billingAddress ? { create: billingAddress } : undefined,
        },
      });
      return {
        success: true,
        message: "Utilisateur creé",
      };
    },
  });
}

export default createUser;
