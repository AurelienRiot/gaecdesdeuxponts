"use server";

import { ADMIN } from "@/components/auth";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { revalidatePath, revalidateTag } from "next/cache";
import { mainProductSchema, type ProductFormValues } from "../_components/product-schema";

export async function updateProduct(data: ProductFormValues) {
  return await safeServerAction({
    data,
    schema: mainProductSchema,
    roles: ADMIN,
    serverAction: async ({ id, name, imagesUrl, categoryName, productSpecs, isArchived, isPro, products }) => {
      const sameProduct = await prismadb.mainProduct.findUnique({
        where: {
          name,
          NOT: { id },
        },
      });
      if (sameProduct) {
        return {
          success: false,
          message: "Un produit avec ce nom existe déja",
        };
      }
      const [deleted, defaultOrderProducts] = await Promise.all([
        prismadb.product.deleteMany({
          where: {
            product: {
              id,
            },
          },
        }),
        prismadb.defaultOrderProduct.findMany({
          where: {
            productId: id,
          },
        }),
      ]);

      await prismadb.mainProduct.update({
        where: {
          id,
        },
        data: {
          name,
          imagesUrl,
          categoryName,
          productSpecs,
          isArchived,
          isPro,
          products: {
            create: products.map((product) => {
              return {
                id: product.id,
                index: product.index,
                name: product.name,
                unit: product.unit,
                description: product.description,
                price: product.price,
                tax: product.tax,
                isFeatured: product.isFeatured,
                isArchived: product.isArchived,
                imagesUrl: product.imagesUrl,
                icon: product.icon,
                stocks: {
                  create: product.stocks.map((stockId) => {
                    return {
                      stockId,
                    };
                  }),
                },
                options: {
                  create: product.options.map((option) => {
                    return {
                      index: option.index,
                      name: option.name,
                      value: option.value,
                    };
                  }),
                },
                defaultOrderProducts: {
                  create: defaultOrderProducts,
                },
              };
            }),
          },
        },
      });
      revalidateTag("products");
      revalidateTag("categories");
      revalidatePath("/category", "layout");

      return {
        success: true,
        message: "Produit mis à jour",
      };
    },
  });
}
