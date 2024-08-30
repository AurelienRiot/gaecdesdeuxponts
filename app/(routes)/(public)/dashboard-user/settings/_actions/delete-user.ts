"use server";

import { getSessionUser } from "@/actions/get-user";
import prismadb from "@/lib/prismadb";
import type { ReturnTypeServerAction } from "@/lib/server-action";
import { revalidateTag } from "next/cache";

async function deleteUser(): Promise<ReturnTypeServerAction> {
  const user = await getSessionUser();

  if (!user) {
    return {
      success: false,
      message: "Erreur d'authentification, déconnectez-vous et reconnectez-vous.",
    };
  }
  await prismadb.user.update({
    where: {
      id: user.id,
    },
    data: {
      email: `${user.email}-deleted-${new Date().toISOString()}`,
      role: "deleted",
      accounts: {
        deleteMany: {},
      },
      sessions: {
        deleteMany: {},
      },
    },
  });

  // if (user.count === 0) {
  //   return {
  //     success: false,
  //     message: "Une erreur est survenue",
  //   };
  // }

  revalidateTag("users");

  return {
    success: true,
    message: "",
  };
}

export default deleteUser;
