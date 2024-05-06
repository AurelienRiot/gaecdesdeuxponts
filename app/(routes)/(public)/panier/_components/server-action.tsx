"use server";

import { checkUser } from "@/components/auth/checkAuth";
import prismadb from "@/lib/prismadb";
import { ReturnTypeServerAction } from "@/types";

type CheckOutProps = {
  totalPrice: number;

  itemsWithQuantities: {
    id: string;
    quantity: number;
  }[];
  date: Date;
  shopId: string;
};

export const checkOut = async ({
  itemsWithQuantities,
  date,
  totalPrice,
  shopId,
}: CheckOutProps): Promise<ReturnTypeServerAction<null>> => {
  const isAuth = await checkUser();

  if (!isAuth) {
    return {
      success: false,
      message:
        "Erreur lors de la connexion, essaye de vous connecter à nouveau",
    };
  }

  const user = await prismadb.user.findUnique({
    where: {
      id: isAuth.id,
    },
  });

  if (!user) {
    return {
      success: false,
      message:
        "Erreur lors de la connexion, essaye de vous connecter à nouveau",
    };
  }

  const productIds = itemsWithQuantities.map((item) => item.id);
  const products = await prismadb.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
    include: {
      product: true,
    },
  });

  const productsWithQuantity = products.map((product) => {
    return {
      item: product,
      quantity: itemsWithQuantities.find((item) => item.id === product.id)
        ?.quantity,
    };
  });

  const trueTotalPrice = productsWithQuantity.reduce(
    (acc, { item, quantity }) => {
      return acc + (item.price || 0) * (quantity || 1);
    },
    0,
  );

  if (trueTotalPrice !== totalPrice) {
    return {
      success: false,
      message:
        "Des prix ont changé et votre panier n'est pas valide, vider le panier et recharger la page",
    };
  }

  const order = await prismadb.order.create({
    data: {
      totalPrice,
      pdfUrl: "",
      orderItems: {
        create: productsWithQuantity.map((product) => ({
          name: product.item.name,
          description: product.item.description,
          categoryName: product.item.product.categoryName,
          price: product.item.price,
          quantity: product.quantity,
        })),
      },
      userId: isAuth.id,
      shopId,
      name: user.name || user.email || "",
      datePickUp: date,
    },
  });
  return {
    success: true,
    data: null,
  };
};
