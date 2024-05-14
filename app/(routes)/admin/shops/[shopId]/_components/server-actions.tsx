"use server";
import { checkAdmin } from "@/components/auth/checkAuth";
import { ShopFormValues } from "./shop-form";
import prismadb from "@/lib/prismadb";
import { revalidateTag } from "next/cache";

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

  revalidateTag("shops");

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
  revalidateTag("shops");

  return {
    success: true,
  };
}

async function deleteShop({
  id,
}: {
  id: string | undefined;
}): Promise<ReturnType> {
  const isAuth = await checkAdmin();

  if (!isAuth) {
    return {
      success: false,
      message: "Vous devez être authentifier",
    };
  }
  const orders = await prismadb.order.findMany({
    where: {
      shopId: id,
    },
  });

  if (orders.length > 0) {
    return {
      success: false,
      message:
        "Des commandes sont associés à  ce magasin, supprimer les commandes où archiver ce magasin",
    };
  }

  const shop = await prismadb.shop.deleteMany({
    where: {
      id,
    },
  });

  if (shop.count === 0) {
    return {
      success: false,
      message: "Une erreur est survenue",
    };
  }

  revalidateTag("shops");

  return {
    success: true,
  };
}

export { createShop, updateShop, deleteShop };
