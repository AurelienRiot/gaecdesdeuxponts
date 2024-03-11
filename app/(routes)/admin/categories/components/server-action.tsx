"use server";

import { checkAdmin } from "@/components/auth/checkAuth";
import prismadb from "@/lib/prismadb";

async function deleteCategorie({
  id,
}: {
  id: string | undefined;
}): Promise<ReturnTypeDeleteObject> {
  const isAuth = await checkAdmin();

  if (!isAuth) {
    return {
      success: false,
      message: "Vous devez être authentifier",
    };
  }

  const products = await prismadb.product.findMany({
    where: {
      categoryId: id,
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
      id,
    },
  });

  if (category.count === 0) {
    return {
      success: false,
      message: "Une erreur est survenue",
    };
  }

  return {
    success: true,
  };
}

type ReturnTypeDeleteObject =
  | {
      success: true;
    }
  | {
      success: false;
      message: string;
    };

export { deleteCategorie };
