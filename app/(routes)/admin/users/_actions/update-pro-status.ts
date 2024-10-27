"use server";

import { ADMIN } from "@/components/auth";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { revalidateTag } from "next/cache";
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
      revalidateTag("users");

      return {
        success: true,
        message: "Utilisateur mis à jour",
      };
    },
  });
}

export default updateProStatus;
