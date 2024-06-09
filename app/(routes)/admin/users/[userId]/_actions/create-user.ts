"use server";
import { checkAdmin } from "@/components/auth/checkAuth";
import { defaultAddress } from "@/components/billing-address-form";
import prismadb from "@/lib/prismadb";
import { CreateUserFormValues } from "../_components/create-user-form";

export async function createUser({
  name,
  phone,
  address,
  billingAddress,
  company,
  email,
  isPro,
}: CreateUserFormValues): Promise<void> {
  const isAuth = await checkAdmin();

  if (!isAuth) {
    throw new Error("Vous devez être authentifier");
  }

  const user = await prismadb.user.findUnique({
    where: { email: email },
  });

  if (user) {
    throw new Error("L'utilisateur existe déja");
  }

  await prismadb.user.create({
    data: {
      name,
      email,
      company,
      phone,
      role: isPro ? "pro" : "user",
      address: {
        create: address ?? defaultAddress,
      },

      billingAddress: billingAddress ? { create: billingAddress } : undefined,
    },
  });
}
