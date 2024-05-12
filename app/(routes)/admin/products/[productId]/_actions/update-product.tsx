"use server";

import { ReturnTypeServerAction } from "@/types";
import { ProductFormValues } from "../_components/product-form";
import { checkAdmin } from "@/components/auth/checkAuth";
import prismadb from "@/lib/prismadb";
import { revalidateTag } from "next/cache";

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
): Promise<ReturnTypeServerAction<null>> {
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

  return {
    success: true,
    data: null,
  };
}
