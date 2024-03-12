"use server";

import { checkAdmin } from "@/components/auth/checkAuth";
import prismadb from "@/lib/prismadb";

async function deleteProduct({
  id,
}: {
  id: string | undefined;
}): Promise<ReturnType> {
  const isAuth = await checkAdmin();

  if (!isAuth) {
    return {
      success: false,
      message: "Vous devez être authentifier",
    };
  }

  try {
    await prismadb.$transaction(async (prisma) => {
      await prisma.product.update({
        where: { id: id },
        data: {
          linkedProducts: {
            set: [], // Disconnect all linked products
          },
          linkedBy: {
            set: [], // Disconnect all linked by products
          },
        },
      });

      await prisma.product.delete({
        where: { id: id },
      });
    });
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: "Une erreur est survenue",
    };
  }

  return {
    success: true,
  };
}

type ReturnType =
  | {
      success: true;
    }
  | {
      success: false;
      message: string;
    };

export { deleteProduct };
