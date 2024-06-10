"use server";

import { checkAdmin } from "@/components/auth/checkAuth";
import prismadb from "@/lib/prismadb";
import { revalidateTag } from "next/cache";
import { ProductFormValues } from "../_components/product-form";

export async function updateProduct(
  {
    categoryName,
    name,
    imagesUrl,
    productSpecs,
    isArchived,
    isPro,
    products,
  }: ProductFormValues,
  id: string,
): Promise<void> {
  const isAuth = await checkAdmin();

  if (!isAuth) {
    throw new Error("Vous devez être authentifier");
  }

  const sameProduct = await prismadb.mainProduct.findUnique({
    where: {
      name,
      NOT: { id },
    },
  });
  if (sameProduct) {
    throw new Error("Un produit avec ce nom existe déja");
  }

  await prismadb.product.deleteMany({
    where: {
      product: {
        id: id,
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
            price: product.price || 0,
            isFeatured: product.isFeatured,
            isArchived: product.isArchived,
            imagesUrl: product.imagesUrl,
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
  revalidateTag("productfetch");
  revalidateTag("categories");
}
