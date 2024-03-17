"use server";

import { checkAdmin } from "@/components/auth/checkAuth";
import prismadb from "@/lib/prismadb";

async function deleteUser({
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
  const user = await prismadb.user.deleteMany({
    where: {
      id,
    },
  });

  if (user.count === 0) {
    return {
      success: false,
      message: "Une erreur est survenue",
    };
  }

  return {
    success: true,
  };
}

const updateProUser = async ({
  id,
  check,
}: {
  id: string;
  check: boolean | "indeterminate";
}): Promise<ReturnType> => {
  const isAuth = await checkAdmin();

  if (!isAuth) {
    return {
      success: false,
      message: "Vous devez être authentifier",
    };
  }

  if (check === "indeterminate") {
    return {
      success: false,
      message: "Une erreur est survenue",
    };
  }

  const user = await prismadb.user.update({
    where: {
      id,
    },
    data: {
      role: check ? "pro" : "user",
    },
  });
  return {
    success: true,
  };
};

type ReturnType =
  | {
      success: true;
    }
  | {
      success: false;
      message: string;
    };

export { deleteUser, updateProUser };
