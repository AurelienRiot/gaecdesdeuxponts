"use server";

import { getSessionUser } from "@/actions/get-user";
import prismadb from "@/lib/prismadb";
import { revalidateUsers } from "@/lib/revalidate-path";
import type { ReturnTypeServerAction } from "@/lib/server-action";

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

  revalidateUsers(user.id);

  return {
    success: true,
    message: "",
  };
}

export default deleteUser;
