"use server";

import { checkAdmin } from "@/components/auth/checkAuth";
import prismadb from "@/lib/prismadb";
import { Product } from "@prisma/client";
import { ProductFormValues } from "./product-form";

export type ProductReturnType =
  | {
      success: true;
      data: Product;
    }
  | {
      success: false;
      message: string;
    };

async function createProduct({
  categoryId,
  name,
  images,
  price,
  description,
  productSpecs,
  isFeatured,
  isArchived,
}: ProductFormValues): Promise<ProductReturnType> {
  const isAuth = await checkAdmin();

  if (!isAuth) {
    return {
      success: false,
      message: "Vous devez être authentifier",
    };
  }

  const product = await prismadb.product.create({
    data: {
      name,
      price,
      categoryId,
      description,
      productSpecs,
      isFeatured,
      isArchived,
    },
  });

  for (const image of images) {
    await prismadb.image.create({
      data: {
        url: image.url,
        productId: product.id,
      },
    });
  }

  return {
    success: true,
    data: product,
  };
}

async function updateProduct(
  {
    categoryId,
    name,
    images,
    price,
    description,
    productSpecs,
    isFeatured,
    isArchived,
  }: ProductFormValues,
  id: string,
): Promise<ProductReturnType> {
  const isAuth = await checkAdmin();

  if (!isAuth) {
    return {
      success: false,
      message: "Vous devez être authentifier",
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
      images: {
        deleteMany: {},
      },
      isFeatured,
      isArchived,
    },
  });

  for (const image of images) {
    await prismadb.image.create({
      data: {
        url: image.url,
        productId: product.id,
      },
    });
  }

  return {
    success: true,
    data: product,
  };
}

export { createProduct, updateProduct };
