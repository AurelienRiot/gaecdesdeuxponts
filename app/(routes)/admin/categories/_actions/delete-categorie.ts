"use server";

import { ADMIN } from "@/components/auth";
import prismadb from "@/lib/prismadb";
import { revalidateCategories } from "@/lib/revalidate-path";
import safeServerAction from "@/lib/server-action";
import { z } from "zod";

const deleteSchema = z.object({
  id: z.string(),
});

async function deleteCategorie(data: z.infer<typeof deleteSchema>) {
  return await safeServerAction({
    data,
    roles: ADMIN,
    schema: deleteSchema,
    serverAction: async ({ id }) => {
      const products = await prismadb.mainProduct.findMany({
        where: {
          id,
        },
      });

      if (products.length > 0) {
        return {
          success: false,
          message: "Des produits sont associés à  cette categorie, vous devez les supprimer",
        };
      }
      const category = await prismadb.category.deleteMany({
        where: {
          id,
        },
      });

      if (category.count === 0) {
        return {
          success: false,
          message: "Une erreur est survenue",
        };
      }

      revalidateCategories();
      return {
        success: true,
        message: "Categorie supprimé",
      };
    },
  });
}

export default deleteCategorie;
