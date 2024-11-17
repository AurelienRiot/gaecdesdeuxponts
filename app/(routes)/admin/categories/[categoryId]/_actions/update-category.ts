"use server";

import { SHIPPING_ONLY } from "@/components/auth";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { revalidatePath, revalidateTag } from "next/cache";
import { type CategoryFormValues, schema } from "../_components/category-schema";

async function updateCategory(data: CategoryFormValues) {
  return await safeServerAction({
    data,
    schema,
    roles: SHIPPING_ONLY,
    serverAction: async (data) => {
      const { imageUrl, name, description, id } = data;
      const sameCategory = await prismadb.category.findUnique({
        where: {
          name,
          NOT: { id },
        },
      });
      if (sameCategory) {
        return {
          success: false,
          message: "Une catégorie avec ce nom existe déja",
        };
      }

      await prismadb.category.update({
        where: {
          id,
        },
        data: {
          name,
          imageUrl,
          description,
        },
      });

      revalidateTag("categories");
      revalidatePath("/category", "layout");

      return {
        success: true,
        message: "Catégorie mise a jour",
      };
    },
  });
}

export default updateCategory;
