"use server";
import { checkAdmin } from "@/components/auth/checkAuth";
import { UserFormValues } from "../_components/user-form";
import prismadb from "@/lib/prismadb";
import { defaultAddress } from "@/components/billing-address-form";

export async function updateUser(
  { name, phone, address, billingAddress, company }: UserFormValues,
  id: string,
): Promise<void> {
  const isAuth = await checkAdmin();

  if (!isAuth) {
    throw new Error("Vous devez être authentifier");
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
}
