"use server";

import { checkAdmin } from "@/components/auth/checkAuth";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { z } from "zod";

const schema = z.object({
  id: z.string(),
});

async function deleteContact(data: z.infer<typeof schema>) {
  return await safeServerAction({
    data,
    schema,
    getUser: checkAdmin,
    serverAction: async (data) => {
      const { id } = data;
      const contact = await prismadb.contact.deleteMany({
        where: {
          id,
        },
      });

      if (contact.count === 0) {
        return {
          success: false,
          message: "Une erreur est survenue",
        };
      }

      return {
        success: true,
        message: "Contact supprimé",
      };
    },
  });
}

export default deleteContact;
