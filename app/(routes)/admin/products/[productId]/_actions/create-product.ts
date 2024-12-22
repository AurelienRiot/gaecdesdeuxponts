"use server";

import { ADMIN } from "@/components/auth";
import prismadb from "@/lib/prismadb";
import { revalidateProducts } from "@/lib/revalidate-path";
import safeServerAction from "@/lib/server-action";
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

      revalidateProducts();
      return {
        success: true,
        message: "Produit creé",
      };
    },
  });
}
