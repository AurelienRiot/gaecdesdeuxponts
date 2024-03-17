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

  try {
    await prismadb.$transaction(async (prisma) => {
      await prisma.product.update({
        where: { id: id },
        data: {
          linkedProducts: {
            set: [], // Disconnect all linked products
          },
          linkedBy: {
            set: [], // Disconnect all linked by products
          },
        },
      });

      await prisma.product.delete({
        where: { id: id },
      });
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

const changePro = async ({
  id,
  isPro,
}: {
  id: string;
  isPro: boolean | "indeterminate";
}): Promise<ReturnType> => {
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
    const product = await prismadb.product.update({
      where: {
        id,
      },
      data: {
        isPro,
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

export { deleteProduct, changeArchived, changeFeatured, changePro };
