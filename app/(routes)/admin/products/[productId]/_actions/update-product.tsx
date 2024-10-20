"use server";

import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { revalidateTag } from "next/cache";
import { mainProductSchema, type ProductFormValues } from "../_components/product-schema";

export async function updateProduct(data: ProductFormValues) {
  return await safeServerAction({
    data,
    schema: mainProductSchema,
    roles: ["admin"],
    serverAction: async (data) => {
      const { id, name, imagesUrl, categoryName, productSpecs, isArchived, isPro, products } = data;
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

      await prismadb.product.deleteMany({
        where: {
          product: {
            id,
          },
        },
      });

      const product = await prismadb.mainProduct.update({
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
              };
            }),
          },
        },
      });
      revalidateTag("products");
      revalidateTag("products");
      revalidateTag("categories");

      return {
        success: true,
        message: "Produit mis à jour",
      };
    },
  });
}
