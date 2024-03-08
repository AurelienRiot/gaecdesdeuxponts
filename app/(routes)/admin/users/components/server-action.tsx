"use server";

import { checkAdmin } from "@/components/auth/checkAuth";
import prismadb from "@/lib/prismadb";

async function deleteUser({
  id,
}: {
  id: string | undefined;
}): Promise<ReturnTypeUserObject> {
  const isAuth = await checkAdmin();

  if (!isAuth) {
    return {
      success: false,
      message: "Vous devez être authentifier",
    };
  }
  const user = await prismadb.user.deleteMany({
    where: {
      id,
    },
  });

  if (user.count === 0) {
    return {
      success: false,
      message: "Une erreur est survenue",
    };
  }

  return {
    success: true,
  };
}

type ReturnTypeUserObject =
  | {
      success: true;
    }
  | {
      success: false;
      message: string;
    };

export { deleteUser };
