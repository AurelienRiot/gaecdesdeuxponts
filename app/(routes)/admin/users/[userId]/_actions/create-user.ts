"use server";
import { defaultAddress } from "@/components/zod-schema/address-schema";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { revalidateTag } from "next/cache";
import { schema, type UserFormValues } from "../_components/user-schema";

async function createUser(data: UserFormValues) {
  return await safeServerAction({
    data,
    schema,
    roles: ["admin"],
    serverAction: async (data) => {
      const { email, name, company, phone, role, address, billingAddress, image, id, completed, notes } = data;
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
          company: role === "pro" ? company?.trim() : undefined,
          phone,
          image,
          notes,
          completed,
          role,
          address: {
            create: address ?? defaultAddress,
          },

          billingAddress: billingAddress ? { create: billingAddress } : undefined,
        },
      });
      revalidateTag("users");

      return {
        success: true,
        message: "Utilisateur creé",
      };
    },
  });
}

export default createUser;
