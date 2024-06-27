"use server";

import { checkUser } from "@/components/auth/checkAuth";
import { defaultAddress } from "@/components/billing-address-form";
import prismadb from "@/lib/prismadb";
import type { ReturnTypeServerAction } from "@/types";
import type { UserFormValues } from "./user-form";
import { formatDate } from "date-fns";
import { dateFormatter } from "@/lib/date-utils";

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
      message: "Erreur d'authentification, déconnectez-vous et reconnectez-vous.",
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

async function deleteUser(): Promise<void> {
  const isAuth = await checkUser();

  if (!isAuth) {
    throw new Error(`Vous devez être authentifier`);
  }
  await prismadb.user.update({
    where: {
      id: isAuth.id,
    },
    data: {
      email: `${isAuth.email}-deleted-${new Date().toISOString()}`,
      role: "deleted",
      accounts: {
        deleteMany: {},
      },
      sessions: {
        deleteMany: {},
      },
    },
  });

  // if (user.count === 0) {
  //   return {
  //     success: false,
  //     message: "Une erreur est survenue",
  //   };
  // }
}

export { deleteUser, updateUser };
