"use server";

import { checkAdmin } from "@/components/auth/checkAuth";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { addDelay } from "@/lib/utils";
import { revalidateTag } from "next/cache";
import * as z from "zod";

const schema = z.object({
  id: z.string(),
  email: z.string().email(),
});

async function changeEmail(data: z.infer<typeof schema>) {
  return await safeServerAction({
    data,
    schema,
    getUser: checkAdmin,
    serverAction: async ({ email, id }) => {
      await addDelay(2000);
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
      revalidateTag("users");

      return {
        success: true,
        message: "Email mise à jour",
      };
    },
  });
}

export default changeEmail;
