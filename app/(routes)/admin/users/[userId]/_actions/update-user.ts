"use server";
import { checkAdmin } from "@/components/auth/checkAuth";
import type { UserFormValues } from "../_components/user-form";
import prismadb from "@/lib/prismadb";
import type { ReturnTypeServerAction } from "@/lib/server-action";
import { defaultAddress } from "@/components/zod-schema/address-schema";

export async function updateUser(
  { name, phone, address, billingAddress, company, isPro }: UserFormValues,
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
      company: isPro ? company : undefined,
      phone,
      role: isPro ? "pro" : "user",
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
