"use server";

import { checkAdmin } from "@/components/auth/checkAuth";
import { CategoryFormValues } from "./category-form";
import prismadb from "@/lib/prismadb";
import { Category } from "@prisma/client";
import { ReturnTypeServerAction } from "@/types";
import { revalidateTag } from "next/cache";

async function createCategory({
  imageUrl,
  name,
  description,
}: CategoryFormValues): Promise<ReturnTypeServerAction<Category>> {
  const isAuth = await checkAdmin();

  if (!isAuth) {
    return {
      success: false,
      message: "Vous devez être authentifier",
    };
  }

  const sameCategory = await prismadb.category.findUnique({
    where: {
      name,
    },
  });
  if (sameCategory) {
    return {
      success: false,
      message: "Une catégorie avec ce nom existe déja",
    };
  }

  const category = await prismadb.category.create({
    data: {
      name,
      imageUrl,
      description,
    },
  });
  revalidateTag("categories");

  return {
    success: true,
    data: category,
  };
}

async function updateCategory(
  { imageUrl, name, description }: CategoryFormValues,
  id: string,
): Promise<ReturnTypeServerAction<Category>> {
  const isAuth = await checkAdmin();

  if (!isAuth) {
    return {
      success: false,
      message: "Vous devez être authentifier",
    };
  }
  const sameCategory = await prismadb.category.findUnique({
    where: {
      name,
      NOT: { id },
    },
  });
  if (sameCategory) {
    return {
      success: false,
      message: "Une catégorie avec ce nom existe déja",
    };
  }

  const category = await prismadb.category.update({
    where: {
      id,
    },
    data: {
      name,
      imageUrl,
      description,
    },
  });

  revalidateTag("categories");

  return {
    success: true,
    data: category,
  };
}

export { createCategory, updateCategory };