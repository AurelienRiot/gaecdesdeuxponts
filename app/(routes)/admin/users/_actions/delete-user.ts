"use server";

import { ADMIN } from "@/components/auth";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { revalidateTag } from "next/cache";
import { z } from "zod";

const schema = z.object({
  email: z.string().email().nullable(),
});

async function deleteUser(data: z.infer<typeof schema>) {
  return await safeServerAction({
    data,
    schema,
    roles: ADMIN,
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

      revalidateTag("users");

      return {
        success: true,
        message: "Utilisateur supprimé",
      };
    },
  });
}

export default deleteUser;
