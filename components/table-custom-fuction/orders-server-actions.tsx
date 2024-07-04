"use server";
import { checkAdmin } from "@/components/auth/checkAuth";
import prismadb from "@/lib/prismadb";
import type { ReturnTypeServerAction } from "@/lib/server-action";

async function deleteOrders({
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

  try {
    await prismadb.order.delete({
      where: { id: id },
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
    data: null,
  };
}
export { deleteOrders };
