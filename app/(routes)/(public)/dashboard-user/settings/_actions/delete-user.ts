"use server";

import { getSessionUser } from "@/actions/get-user";
import prismadb from "@/lib/prismadb";
import type { ReturnTypeServerAction2 } from "@/lib/server-action";

async function deleteUser(): Promise<ReturnTypeServerAction2> {
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

  return {
    success: true,
    message: "",
  };
}

export default deleteUser;
