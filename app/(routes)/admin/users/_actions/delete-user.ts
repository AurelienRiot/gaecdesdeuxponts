"use server";

import { checkAdmin } from "@/components/auth/checkAuth";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { z } from "zod";

const schema = z.object({
  email: z.string().email().nullable(),
});

async function deleteUser(data: z.infer<typeof schema>) {
  return await safeServerAction({
    data,
    schema,
    getUser: checkAdmin,
    serverAction: async (data) => {
      const { email } = data;
      if (!email) {
        return {
          success: false,
          message: "Une erreur est survenue",
        };
      }
      await prismadb.user.update({
        where: {
          email,
        },
        data: {
          email: `${email}-deleted-${new Date().toISOString()}`,
          role: "deleted",
          accounts: {
            deleteMany: {},
          },
          sessions: {
            deleteMany: {},
          },
        },
      });

      return {
        success: true,
        message: "Utilisateur supprimé",
      };
    },
  });
}

export default deleteUser;
