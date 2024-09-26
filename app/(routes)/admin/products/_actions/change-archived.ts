"use server";

import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { revalidateTag } from "next/cache";
import { z } from "zod";

const schema = z.object({
  id: z.string(),
  checkState: z.literal("indeterminate").or(z.boolean()),
});

const changeArchived = async (data: z.infer<typeof schema>) => {
  return await safeServerAction({
    data,
    schema,
    roles: ["admin"],
    serverAction: async (data) => {
      const { id, checkState } = data;
      if (checkState === "indeterminate") {
        return {
          success: false,
          message: "Une erreur est survenue, veuillez reessayer",
        };
      }
      const product = await prismadb.mainProduct.update({
        where: {
          id,
        },
        data: {
          isArchived: checkState,
        },
      });
      revalidateTag("productfetch");
      revalidateTag("categories");

      return {
        success: true,
        message: checkState ? "Produit archive" : "Produit desarchive",
      };
    },
  });
};

export default changeArchived;
