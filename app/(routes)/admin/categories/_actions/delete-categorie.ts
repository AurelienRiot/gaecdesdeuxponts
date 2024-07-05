"use server";

import { checkAdmin } from "@/components/auth/checkAuth";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { revalidateTag } from "next/cache";
import { z } from "zod";

const deleteSchema = z.object({
  name: z.string(),
});

async function deleteCategorie(data: z.infer<typeof deleteSchema>) {
  return await safeServerAction({
    data,
    getUser: checkAdmin,
    schema: deleteSchema,
    serverAction: async (data) => {
      const { name } = data;
      const products = await prismadb.mainProduct.findMany({
        where: {
          categoryName: name,
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
          name,
        },
      });

      if (category.count === 0) {
        return {
          success: false,
          message: "Une erreur est survenue",
        };
      }

      revalidateTag("categories");
      return {
        success: true,
        message: "Categorie supprimé",
      };
    },
  });
}

export default deleteCategorie;
