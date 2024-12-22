"use server";

import { SHIPPING_ONLY } from "@/components/auth";
import { emailSchema } from "@/components/zod-schema";
import prismadb from "@/lib/prismadb";
import { revalidateUsers } from "@/lib/revalidate-path";
import safeServerAction from "@/lib/server-action";
import * as z from "zod";

const schema = z.object({
  id: z.string(),
  email: emailSchema,
});

async function changeEmail(data: z.infer<typeof schema>) {
  return await safeServerAction({
    data,
    schema,
    roles: SHIPPING_ONLY,
    serverAction: async ({ email, id }) => {
      const user = await prismadb.user.findUnique({
        where: {
          id,
        },
      });

      if (!user?.email) {
        return {
          success: false,
          message: "Utilisateur introuvable",
        };
      }

      if (user.email === email) {
        return {
          success: false,
          message: "Le nouvel email est le même que l'ancien",
        };
      }

      const existingUser = await prismadb.user.findUnique({
        where: {
          email,
        },
      });

      if (existingUser) {
        return {
          success: false,
          message: "Un compte avec cet email existe déja",
        };
      }

      try {
        await prismadb.user.update({
          where: {
            id,
          },
          data: {
            email,
            accounts: {
              deleteMany: {},
            },
            sessions: {
              deleteMany: {},
            },
          },
        });
      } catch (error) {
        return {
          success: false,
          message: "Une erreur est survenue",
        };
      }
      revalidateUsers(user.id);

      return {
        success: true,
        message: "Email mis à jour",
      };
    },
  });
}

export default changeEmail;
