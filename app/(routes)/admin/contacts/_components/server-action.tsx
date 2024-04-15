"use server";

import { checkAdmin } from "@/components/auth/checkAuth";
import prismadb from "@/lib/prismadb";

async function deleteContact({
  id,
}: {
  id: string | undefined;
}): Promise<ReturnTypeContactObject> {
  const isAuth = await checkAdmin();

  if (!isAuth) {
    return {
      success: false,
      message: "Vous devez être authentifier",
    };
  }
  const contact = await prismadb.contact.deleteMany({
    where: {
      id,
    },
  });

  if (contact.count === 0) {
    return {
      success: false,
      message: "Une erreur est survenue",
    };
  }

  return {
    success: true,
  };
}

type ReturnTypeContactObject =
  | {
      success: true;
    }
  | {
      success: false;
      message: string;
    };

export { deleteContact };
