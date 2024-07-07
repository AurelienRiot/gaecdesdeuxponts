"use server";

import { checkAdmin } from "@/components/auth/checkAuth";
import prismadb from "@/lib/prismadb";
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
    getUser: checkAdmin,
    serverAction: async (data) => {
      const { id, check } = data;
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

      return {
        success: true,
        message: "Utilisateur mise à jour",
      };
    },
  });
}

export default updateProStatus;