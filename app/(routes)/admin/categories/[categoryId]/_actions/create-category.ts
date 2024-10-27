"use server";

import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { revalidateTag } from "next/cache";
import { type CategoryFormValues, schema } from "../_components/category-schema";
import { ADMIN } from "@/components/auth";

async function createCategory(data: CategoryFormValues) {
  return await safeServerAction({
    data,
    schema,
    roles: ADMIN,
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
