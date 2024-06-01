"use server";

import { checkAdmin } from "@/components/auth/checkAuth";
import prismadb from "@/lib/prismadb";
import { User } from "@prisma/client";
import { UserFormValues } from "./user-form";
import { defaultAddress } from "@/components/billing-address-form";
import { ReturnTypeServerAction } from "@/types";

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
  { name, phone, address, billingAddress, company }: UserFormValues,
  id: string,
): Promise<ReturnTypeServerAction<null>> {
  const isAuth = await checkAdmin();

  if (!isAuth) {
    return {
      success: false,
      message: "Vous devez être authentifier",
    };
  }

  const user = await prismadb.user.findUnique({
    where: { id: id },
    select: { billingAddress: true },
  });

  await prismadb.user.update({
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

export { updateUser };
