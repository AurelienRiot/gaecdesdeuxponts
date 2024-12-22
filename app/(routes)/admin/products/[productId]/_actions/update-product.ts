"use server";

import { ADMIN } from "@/components/auth";
import prismadb from "@/lib/prismadb";
import { revalidateProducts } from "@/lib/revalidate-path";
import safeServerAction from "@/lib/server-action";
import { type ProductFormValues, productSchema } from "../_components/product-schema";

export async function updateProduct(data: ProductFormValues) {
  return await safeServerAction({
    data,
    schema: productSchema,
    roles: ADMIN,
    serverAction: async ({ mainProductId, options, stocks, id, ...data }) => {
      await Promise.all([
        prismadb.option.deleteMany({
          where: {
            productId: id,
          },
        }),
        prismadb.productStock.deleteMany({
          where: {
            productId: id,
          },
        }),
      ]);
      await prismadb.product.update({
        where: {
          id,
        },
        data: {
          ...data,
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
        message: "",
      };
    },
  });
}
