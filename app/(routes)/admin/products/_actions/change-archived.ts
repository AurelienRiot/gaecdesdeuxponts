"use server";

import { ADMIN } from "@/components/auth";
import prismadb from "@/lib/prismadb";
import { revalidateProducts } from "@/lib/revalidate-path";
import safeServerAction from "@/lib/server-action";
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
      await prismadb.mainProduct.update({
        where: {
          id,
        },
        data: {
          isArchived: checkState,
        },
      });
      revalidateProducts(id);

      return {
        success: true,
        message: checkState ? "Produit archive" : "Produit desarchive",
      };
    },
  });
};

export default changeArchived;
