"use server";

import { ADMIN } from "@/components/auth";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { revalidatePath, revalidateTag } from "next/cache";
import { type MainProductFormValues, mainProductSchema } from "../_components/product-schema";

export async function createMainProduct(data: MainProductFormValues) {
  return await safeServerAction({
    data,
    schema: mainProductSchema,
    roles: ADMIN,
    serverAction: async (data) => {
      const sameProduct = await prismadb.mainProduct.findUnique({
        where: {
          name: data.name,
        },
      });
      if (sameProduct) {
        return {
          success: false,
          message: "Un produit avec ce nom existe déja",
        };
      }

      await prismadb.mainProduct.create({
        data,
      });

      revalidateTag("categories");
      revalidateTag("products");
      revalidatePath("/category", "layout");
      return {
        success: true,
        message: "Produit creé",
      };
    },
  });
}
