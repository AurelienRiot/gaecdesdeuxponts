"use server";

import { ADMIN } from "@/components/auth";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";

const schema = z.object({
  id: z.string(),
  checkState: z.literal("indeterminate").or(z.boolean()),
});

const changeArchived = async (data: z.infer<typeof schema>) => {
  return await safeServerAction({
    data,
    schema,
    roles: ADMIN,
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
      revalidateTag("products");
      revalidateTag("categories");
      revalidatePath("/category", "layout");

      return {
        success: true,
        message: checkState ? "Produit archive" : "Produit desarchive",
      };
    },
  });
};

export default changeArchived;
