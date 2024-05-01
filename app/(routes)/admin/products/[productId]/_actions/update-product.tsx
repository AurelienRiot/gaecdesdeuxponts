"use server";

import { ReturnTypeServerAction } from "@/types";
import { ProductFormValues } from "../_components/product-form";
import { checkAdmin } from "@/components/auth/checkAuth";
import prismadb from "@/lib/prismadb";

export async function updateProduct(
  {
    categoryId,
    name,
    imagesUrl,
    price,
    description,
    productSpecs,
    isFeatured,
    isArchived,
    isPro,
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

  const sameProduct = await prismadb.product.findUnique({
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

  const product = await prismadb.product.update({
    where: {
      id,
    },
    data: {
      name,
      price,
      categoryId,
      description,
      productSpecs,
      imagesUrl,
      isFeatured,
      isArchived,
      isPro,
    },
  });

  return {
    success: true,
    data: null,
  };
}
