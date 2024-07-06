"use server";

import { checkAdmin } from "@/components/auth/checkAuth";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import * as z from "zod";

const schema = z.object({
  email: z.string().email(),
  id: z.string(),
});

async function changeEmail(data: z.infer<typeof schema>) {
  return await safeServerAction({
    data,
    schema,
    getUser: checkAdmin,
    serverAction: async (data) => {
      const user = await prismadb.user.findUnique({
        where: {
          id: data.id,
        },
      });

      if (!user?.email) {
        return {
          success: false,
          message: "Utilisateur introuvable",
        };
      }

      if (user.email === data.email) {
        return {
          success: false,
          message: "Le nouvel email est le même que l'ancien",
        };
      }

      const existingUser = await prismadb.user.findUnique({
        where: {
          email: data.email,
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
            id: user.id,
          },
          data: {
            email: data.email,
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

      return {
        success: true,
        message: "Email mise à jour",
      };
    },
  });
}

export default changeEmail;
