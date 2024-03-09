"use server";

import { checkAdmin } from "@/components/auth/checkAuth";
import prismadb from "@/lib/prismadb";

async function deleteProduct({
  id,
}: {
  id: string | undefined;
}): Promise<ReturnType> {
  const isAuth = await checkAdmin();

  if (!isAuth) {
    return {
      success: false,
      message: "Vous devez être authentifier",
    };
  }
  const product = await prismadb.product.deleteMany({
    where: {
      id,
    },
  });

  if (product.count === 0) {
    return {
      success: false,
      message: "Une erreur est survenue",
    };
  }

  return {
    success: true,
  };
}

const changeArchived = async ({
  id,
  isArchived,
}: {
  id: string;
  isArchived: boolean | "indeterminate";
}): Promise<ReturnType> => {
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
    const product = await prismadb.product.update({
      where: {
        id,
      },
      data: {
        isArchived,
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

const changeFeatured = async ({
  id,
  isFeatured,
}: {
  id: string;
  isFeatured: boolean | "indeterminate";
}): Promise<ReturnType> => {
  const isAuth = await checkAdmin();

  if (!isAuth) {
    return {
      success: false,
      message: "Vous devez être authentifier",
    };
  }

  if (isFeatured === "indeterminate") {
    return {
      success: false,
      message: "Une erreur est survenue, veuillez reessayer",
    };
  }
  try {
    const product = await prismadb.product.update({
      where: {
        id,
      },
      data: {
        isFeatured,
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

type ReturnType =
  | {
      success: true;
    }
  | {
      success: false;
      message: string;
    };

export { deleteProduct, changeArchived, changeFeatured };
