"use server";

import { checkAdmin } from "@/components/auth/checkAuth";
import prismadb from "@/lib/prismadb";
import { Product } from "@prisma/client";
import { ProductFormValues } from "./product-form";

export type ProductReturnType =
  | {
      success: true;
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
  linkProducts,
}: ProductFormValues): Promise<ProductReturnType> {
  const isAuth = await checkAdmin();

  if (!isAuth) {
    return {
      success: false,
      message: "Vous devez être authentifier",
    };
  }
  let product: Product;
  if (linkProducts && linkProducts.length > 0) {
    product = await prismadb.product.create({
      data: {
        name,
        price,
        categoryId,
        description,
        productSpecs,
        linkedProducts: {
          connect: linkProducts.map((product) => ({ id: product.value })),
        },
        isFeatured,
        isArchived,
      },
    });
  } else {
    product = await prismadb.product.create({
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
  }

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
    linkProducts,
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

  const existingProduct = await prismadb.product.findUnique({
    where: { id },
    include: {
      linkedProducts: true,
      linkedBy: true,
    },
  });

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
      linkedProducts: {
        set: [],
      },
      linkedBy: {
        set: [],
      },
      isFeatured,
      isArchived,
    },
  });

  if (linkProducts && linkProducts.length > 0) {
    await prismadb.product.update({
      where: { id },
      data: {
        linkedProducts: {
          connect: linkProducts.map((product) => ({ id: product.value })),
        },
        linkedBy: {
          connect: linkProducts.map((product) => ({ id: product.value })),
        },
      },
    });
  }

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
  };
}

export { createProduct, updateProduct };
