"use server";
import { checkAdmin } from "@/components/auth/checkAuth";
import { ShopFormValues } from "./shop-form";
import prismadb from "@/lib/prismadb";

export type ReturnType =
  | {
      success: true;
    }
  | {
      success: false;
      message: string;
    };

async function createShop(data: ShopFormValues): Promise<ReturnType> {
  const isAuth = await checkAdmin();

  if (!isAuth) {
    return {
      success: false,
      message: "Vous devez être authentifier",
    };
  }

  const shop = await prismadb.shop.create({
    data,
  });

  return {
    success: true,
  };
}

async function updateShop({
  data,
  id,
}: {
  data: ShopFormValues;
  id: string;
}): Promise<ReturnType> {
  const isAuth = await checkAdmin();

  if (!isAuth) {
    return {
      success: false,
      message: "Vous devez être authentifier",
    };
  }

  const shop = await prismadb.shop.update({
    where: {
      id,
    },
    data,
  });

  return {
    success: true,
  };
}

export { createShop, updateShop };
