"use server";

import { checkAdmin } from "@/components/auth/checkAuth";
import prismadb from "@/lib/prismadb";
import { ReturnTypeServerAction } from "@/types";
import { revalidateTag } from "next/cache";

async function deleteCategorie({
  name,
}: {
  name: string | undefined;
}): Promise<ReturnTypeServerAction<null>> {
  const isAuth = await checkAdmin();

  if (!isAuth) {
    return {
      success: false,
      message: "Vous devez être authentifier",
    };
  }

  const products = await prismadb.mainProduct.findMany({
    where: {
      categoryName: name,
    },
  });

  if (products.length > 0) {
    return {
      success: false,
      message:
        "Des produits sont associés à  cette categorie, vous devez les supprimer",
    };
  }

  const category = await prismadb.category.deleteMany({
    where: {
      name,
    },
  });

  if (category.count === 0) {
    return {
      success: false,
      message: "Une erreur est survenue",
    };
  }

  revalidateTag("categories");
  return {
    success: true,
    data: null,
  };
}

export { deleteCategorie };
