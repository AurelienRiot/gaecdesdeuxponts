"use server";
import { checkAdmin } from "@/components/auth/checkAuth";
import { defaultAddress } from "@/components/billing-address-form";
import prismadb from "@/lib/prismadb";
import type { CreateUserFormValues } from "../_components/create-user-form";
import type { ReturnTypeServerAction } from "@/types";

export async function createUser({
  name,
  phone,
  address,
  billingAddress,
  company,
  email,
  isPro,
}: CreateUserFormValues): Promise<ReturnTypeServerAction<null>> {
  const isAuth = await checkAdmin();

  if (!isAuth) {
    return {
      success: false,
      message: "Vous devez être authentifier",
    };
  }

  const user = await prismadb.user.findUnique({
    where: { email: email },
  });

  if (user) {
    return {
      success: false,
      message: "L'utilisateur existe déja",
    };
  }

  await prismadb.user.create({
    data: {
      name,
      email,
      company: isPro ? company : undefined,
      phone,
      role: isPro ? "pro" : "user",
      address: {
        create: address ?? defaultAddress,
      },

      billingAddress: billingAddress ? { create: billingAddress } : undefined,
    },
  });

  return {
    success: true,
    data: null,
  };
}
