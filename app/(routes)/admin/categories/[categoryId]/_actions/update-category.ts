"use server";

import { checkAdmin } from "@/components/auth/checkAuth";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { schema } from "../_components/category-schema";

const schemaWithId = schema.extend({ id: z.string() });

async function updateCategory(data: z.infer<typeof schemaWithId>) {
  return await safeServerAction({
    data,
    schema: schemaWithId,
    getUser: checkAdmin,
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

      return {
        success: true,
        message: "Catégorie mise a jour",
      };
    },
  });
}

export default updateCategory;
