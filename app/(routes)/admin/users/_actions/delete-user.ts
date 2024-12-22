"use server";

import { ADMIN } from "@/components/auth";
import prismadb from "@/lib/prismadb";
import { revalidateUsers } from "@/lib/revalidate-path";
import safeServerAction from "@/lib/server-action";
import { z } from "zod";

const schema = z.object({
  email: z.string().email().nullable(),
});

async function deleteUser(data: z.infer<typeof schema>) {
  return await safeServerAction({
    data,
    schema,
    roles: ADMIN,
    serverAction: async ({ email }) => {
      if (!email) {
        return {
          success: false,
          message: "Une erreur est survenue",
        };
      }
      const user = await prismadb.user.update({
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
        select: {
          id: true,
        },
      });

      revalidateUsers(user.id);

      return {
        success: true,
        message: "Utilisateur supprimé",
      };
    },
  });
}

export default deleteUser;
