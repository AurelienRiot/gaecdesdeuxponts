"use server";

import { ReturnTypeServerAction } from "@/types";
import { ProductFormValues } from "../_components/product-form";
import { checkAdmin } from "@/components/auth/checkAuth";
import prismadb from "@/lib/prismadb";
import { revalidateTag } from "next/cache";

export async function createProduct({
  categoryName,
  name,
  imagesUrl,
  productSpecs,
  isArchived,
  isPro,
  products,
}: ProductFormValues): Promise<void> {
  const isAuth = await checkAdmin();

  if (!isAuth) {
    throw new Error("Vous devez être authentifier");
  }

  const sameProduct = await prismadb.mainProduct.findUnique({
    where: {
      name,
    },
  });
  if (sameProduct) {
    throw new Error("Un produit avec ce nom existe déja");
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
}
