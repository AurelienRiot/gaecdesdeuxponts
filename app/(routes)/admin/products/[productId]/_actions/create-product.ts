"use server";

import { ADMIN } from "@/components/auth";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { revalidatePath, revalidateTag } from "next/cache";
import { type ProductFormValues, productSchema } from "../_components/product-schema";

export async function createProduct(data: ProductFormValues) {
  return await safeServerAction({
    data,
    schema: productSchema,
    roles: ADMIN,
    serverAction: async ({ mainProductId, options, stocks, ...data }) => {
      await prismadb.product.create({
        data: {
          ...data,
          product: {
            connect: {
              id: mainProductId,
            },
          },
          options: {
            create: options,
          },
          stocks: {
            create: stocks.map((stockId) => ({ stockId })),
          },
        },
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
