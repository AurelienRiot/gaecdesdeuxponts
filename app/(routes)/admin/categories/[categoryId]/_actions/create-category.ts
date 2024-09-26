"use server";

import { checkAdmin } from "@/components/auth/checkAuth";
import { type CategoryFormValues, schema } from "../_components/category-schema";
import safeServerAction from "@/lib/server-action";
import prismadb from "@/lib/prismadb";
import { revalidateTag } from "next/cache";

async function createCategory(data: CategoryFormValues) {
  return await safeServerAction({
    data,
    schema,
    roles: ["admin"],
    serverAction: async (data) => {
      const { imageUrl, name, description } = data;
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
      revalidateTag("categories");

      return {
        success: true,
        message: "Catégorie crée",
      };
    },
  });
}

export default createCategory;
