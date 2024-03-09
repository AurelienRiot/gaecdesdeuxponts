"use server";

import { checkAdmin } from "@/components/auth/checkAuth";
import prismadb from "@/lib/prismadb";

async function deleteOrders({
  id,
}: {
  id: string | undefined;
}): Promise<ReturnTypeOrdersObject> {
  const isAuth = await checkAdmin();

  if (!isAuth) {
    return {
      success: false,
      message: "Vous devez être authentifier",
    };
  }
  const order = await prismadb.order.deleteMany({
    where: {
      id,
    },
  });

  if (order.count === 0) {
    return {
      success: false,
      message: "Une erreur est survenue",
    };
  }

  return {
    success: true,
  };
}

type ReturnTypeOrdersObject =
  | {
      success: true;
    }
  | {
      success: false;
      message: string;
    };

const changeStatus = async ({
  id,
  isPaid,
}: {
  id: string;
  isPaid: boolean | "indeterminate";
}): Promise<ReturnTypeOrdersObject> => {
  const isAuth = await checkAdmin();

  if (!isAuth) {
    return {
      success: false,
      message: "Vous devez être authentifier",
    };
  }

  if (isPaid === "indeterminate") {
    return {
      success: false,
      message: "Une erreur est survenue, veuillez reessayer",
    };
  }
  try {
    const order = await prismadb.order.update({
      where: {
        id,
      },
      data: {
        isPaid,
      },
    });
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      message: "Une erreur est survenue, veuillez reessayer",
    };
  }
};

export { deleteOrders, changeStatus };
