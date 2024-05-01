"use server";

import { ReturnTypeServerAction } from "@/types";
import { ProductFormValues } from "../_components/product-form";
import { checkAdmin } from "@/components/auth/checkAuth";
import prismadb from "@/lib/prismadb";

export async function createProduct({
  categoryId,
  name,
  imagesUrl,
  price,
  description,
  productSpecs,
  isFeatured,
  isArchived,
  isPro,
  option,
}: ProductFormValues): Promise<ReturnTypeServerAction<null>> {
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
    },
  });
  if (sameProduct) {
    return {
      success: false,
      message: "Un produit avec ce nom existe déja",
    };
  }

  await prismadb.product.create({
    data: {
      name,
      price,
      imagesUrl,
      categoryId,
      description,
      productSpecs,
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
