"use server";

import { checkAdmin } from "@/components/auth/checkAuth";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { revalidateTag } from "next/cache";
import { mainProductSchema, type ProductFormValues } from "../_components/product-schema";

export async function createProduct(data: ProductFormValues) {
  return await safeServerAction({
    data,
    schema: mainProductSchema,
    getUser: checkAdmin,
    serverAction: async (data) => {
      const { id, name, imagesUrl, categoryName, productSpecs, isArchived, isPro, products } = data;
      const sameProduct = await prismadb.mainProduct.findUnique({
        where: {
          name,
        },
      });
      if (sameProduct) {
        return {
          success: false,
          message: "Un produit avec ce nom existe déja",
        };
      }

      await prismadb.mainProduct.create({
        data: {
          id,
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
                name: product.name,
                description: product.description,
                price: product.price || 0,
                unit: product.unit,
                isFeatured: product.isFeatured,
                isArchived: product.isArchived,
                imagesUrl: product.imagesUrl,
                options: {
                  create: product.options.map((option) => {
                    return {
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

      revalidateTag("categories");
      revalidateTag("productfetch");
      return {
        success: true,
        message: "Produit creé",
      };
    },
  });
}
