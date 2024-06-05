"use server";

import { checkUser } from "@/components/auth/checkAuth";
import { defaultAddress } from "@/components/billing-address-form";
import prismadb from "@/lib/prismadb";
import { ReturnTypeServerAction } from "@/types";
import { UserFormValues } from "./user-form";

async function updateUser({
  name,
  phone,
  address,
  billingAddress,
  company,
}: UserFormValues): Promise<ReturnTypeServerAction<null>> {
  const isAuth = await checkUser();

  if (!isAuth) {
    return {
      success: false,
      message:
        "Erreur d'authentification, déconnectez-vous et reconnectez-vous.",
    };
  }

  const user = await prismadb.user.findUnique({
    where: { id: isAuth.id },
    select: { billingAddress: true },
  });

  await prismadb.user.update({
    where: {
      id: isAuth.id,
    },
    data: {
      name,
      phone,
      company,
      address: {
        upsert: {
          create: address ?? defaultAddress,
          update: address ?? defaultAddress,
        },
      },
      billingAddress: billingAddress
        ? {
            upsert: {
              create: billingAddress,
              update: billingAddress,
            },
          }
        : user?.billingAddress
          ? { delete: true }
          : undefined,
    },
  });

  return {
    success: true,
    data: null,
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
