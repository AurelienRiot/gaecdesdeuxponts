"use server";

import { checkAdmin } from "@/components/auth/checkAuth";
import prismadb from "@/lib/prismadb";

async function deleteProduct({
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
  const product = await prismadb.product.deleteMany({
    where: {
      id,
    },
  });

  if (product.count === 0) {
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

export { deleteProduct };
