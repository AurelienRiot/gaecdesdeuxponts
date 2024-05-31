"use server";

import { checkUser } from "@/components/auth/checkAuth";
import prismadb from "@/lib/prismadb";
import { UserFormValues } from "./user-form";

async function updateUser({
  name,
  phone,
  adress,
  company,
}: UserFormValues): Promise<ReturnTypeUserObject> {
  const isAuth = await checkUser();

  if (!isAuth) {
    return {
      success: false,
      message:
        "Erreur d'authentification, déconnectez-vous et reconnectez-vous.",
    };
  }

  await prismadb.user.update({
    where: {
      id: isAuth.id,
    },
    data: {
      name,
      phone,
      company,
      address: {
        delete: true,
        create: adress,
      },
    },
  });

  // const user = await prismadb.user.update({
  //   where: {
  //     id: isAuth.id,
  //   },
  //   data: {
  //     address: {
  //       create: adress,
  //     },
  //   },
  // });

  return {
    success: true,
  };
}

async function deleteUser(): Promise<ReturnTypeUserObject> {
  const isAuth = await checkUser();

  if (!isAuth) {
    return {
      success: false,
      message: "Vous devez être authentifier",
    };
  }
  const user = await prismadb.user.deleteMany({
    where: {
      id: isAuth.id,
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

type ReturnTypeUserObject =
  | {
      success: true;
    }
  | {
      success: false;
      message: string;
    };

export { deleteUser, updateUser };
