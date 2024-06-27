"use server";

import { checkAdmin } from "@/components/auth/checkAuth";
import prismadb from "@/lib/prismadb";
import { revalidateTag } from "next/cache";
import type { ProductFormValues } from "../_components/product-form";
import type { ReturnTypeServerAction } from "@/types";

export async function createProduct({
  categoryName,
  name,
  imagesUrl,
  productSpecs,
  isArchived,
  isPro,
  products,
}: ProductFormValues): Promise<ReturnTypeServerAction<null>> {
  const isAuth = await checkAdmin();

  if (!isAuth) {
    return {
      success: false,
      message: "Vous devez être authentifier",
    };
  }

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
    data: null,
  };
}
