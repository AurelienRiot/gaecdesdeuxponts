"use server";

import { checkAdmin } from "@/components/auth/checkAuth";
import prismadb from "@/lib/prismadb";
import type { ReturnTypeServerAction } from "@/lib/server-action";

async function deleteContact({
  id,
}: {
  id: string | undefined;
}): Promise<ReturnTypeServerAction<null>> {
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
    data: null,
  };
}

export { deleteContact };
