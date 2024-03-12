"use server";
import prismadb from "@/lib/prismadb";
import { checkAdmin } from "../auth/checkAuth";
import { addDelay } from "@/lib/utils";

type ReturnType =
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
}): Promise<ReturnType> => {
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

export { changeStatus };
