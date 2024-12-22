"use server";

import { SHIPPING_ONLY } from "@/components/auth";
import prismadb from "@/lib/prismadb";
import { revalidateCategories } from "@/lib/revalidate-path";
import safeServerAction from "@/lib/server-action";
import { type CategoryFormValues, schema } from "../_components/category-schema";

async function createCategory(data: CategoryFormValues) {
  return await safeServerAction({
    data,
    schema,
    roles: SHIPPING_ONLY,
    serverAction: async ({ imageUrl, name, description, id }) => {
      const sameCategory = await prismadb.category.findUnique({
        where: {
          name,
        },
      });
      if (sameCategory) {
        return {
          success: false,
          message: "Une catégorie avec ce nom existe déja",
        };
      }

      await prismadb.category.create({
        data: {
          name,
          imageUrl,
          description,
        },
      });
      revalidateCategories(id);

      return {
        success: true,
        message: "Catégorie crée",
      };
    },
  });
}

export default createCategory;
