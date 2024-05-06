"use server";

import { checkAdmin } from "@/components/auth/checkAuth";
import prismadb from "@/lib/prismadb";
import { ReturnTypeServerAction } from "@/types";

async function deleteProduct({
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
    await prismadb.mainProduct.delete({
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

const changeArchived = async ({
  id,
  isArchived,
}: {
  id: string;
  isArchived: boolean | "indeterminate";
}): Promise<ReturnTypeServerAction<null>> => {
  const isAuth = await checkAdmin();

  if (!isAuth) {
    return {
      success: false,
      message: "Vous devez être authentifier",
    };
  }

  if (isArchived === "indeterminate") {
    return {
      success: false,
      message: "Une erreur est survenue, veuillez reessayer",
    };
  }
  try {
    const product = await prismadb.mainProduct.update({
      where: {
        id,
      },
      data: {
        isArchived,
      },
    });
    return {
      success: true,
      data: null,
    };
  } catch (error) {
    return {
      success: false,
      message: "Une erreur est survenue, veuillez reessayer",
    };
  }
};

const changePro = async ({
  id,
  isPro,
}: {
  id: string;
  isPro: boolean | "indeterminate";
}): Promise<ReturnTypeServerAction<null>> => {
  const isAuth = await checkAdmin();

  if (!isAuth) {
    return {
      success: false,
      message: "Vous devez être authentifier",
    };
  }

  if (isPro === "indeterminate") {
    return {
      success: false,
      message: "Une erreur est survenue, veuillez reessayer",
    };
  }
  try {
    const product = await prismadb.mainProduct.update({
      where: {
        id,
      },
      data: {
        isPro,
      },
    });
    return {
      success: true,
      data: null,
    };
  } catch (error) {
    return {
      success: false,
      message: "Une erreur est survenue, veuillez reessayer",
    };
  }
};

export { deleteProduct, changeArchived, changePro };
