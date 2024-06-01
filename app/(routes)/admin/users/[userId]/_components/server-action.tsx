"use server";

import { checkAdmin } from "@/components/auth/checkAuth";
import prismadb from "@/lib/prismadb";
import { User } from "@prisma/client";
import { UserFormValues } from "./user-form";
import { defaultAddress } from "@/components/address-form";

export type UserReturnType =
  | {
      success: true;
      data: User;
    }
  | {
      success: false;
      message: string;
    };

async function updateUser(
  { name, phone, address, company }: UserFormValues,
  id: string,
): Promise<UserReturnType> {
  const isAuth = await checkAdmin();

  if (!isAuth) {
    return {
      success: false,
      message: "Vous devez être authentifier",
    };
  }

  const user = await prismadb.user.update({
    where: {
      id,
    },
    data: {
      name,
      company,
      phone,

      address: {
        upsert: {
          create: address ?? defaultAddress,
          update: address ?? defaultAddress,
        },
      },
    },
  });

  return {
    success: true,
    data: user,
  };
}

export { updateUser };
