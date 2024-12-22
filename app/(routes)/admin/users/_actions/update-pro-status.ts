"use server";

import { ADMIN } from "@/components/auth";
import prismadb from "@/lib/prismadb";
import { revalidateUsers } from "@/lib/revalidate-path";
import safeServerAction from "@/lib/server-action";
import { z } from "zod";

const schema = z.object({
  id: z.string(),
  check: z.union([z.boolean(), z.literal("indeterminate")]),
});

async function updateProStatus(data: z.infer<typeof schema>) {
  return await safeServerAction({
    data,
    schema,
    roles: ADMIN,
    serverAction: async ({ id, check }) => {
      if (check === "indeterminate") {
        return {
          success: false,
          message: "Une erreur est survenue",
        };
      }

      await prismadb.user.update({
        where: {
          id,
        },
        data: {
          role: check ? "pro" : "user",
        },
      });
      revalidateUsers(id);

      return {
        success: true,
        message: "Utilisateur mis à jour",
      };
    },
  });
}

export default updateProStatus;
