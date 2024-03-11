"use server";

import { checkUser } from "@/components/auth/checkAuth";
import prismadb from "@/lib/prismadb";

type CheckOutProps = {
  totalPrice: number;

  itemsWithQuantities: {
    id: string;
    quantity: number;
  }[];
  date: Date;
  shopId: string;
};

type CheckOutReturnType =
  | {
      success: true;
    }
  | {
      success: false;
      message: string;
    };
export const checkOut = async ({
  itemsWithQuantities,
  date,
  totalPrice,
  shopId,
}: CheckOutProps): Promise<CheckOutReturnType> => {
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
  });

  const productsWithQuantity = products.map((product) => {
    return {
      item: product,
      quantity: itemsWithQuantities.find((item) => item.id === product.id)
        ?.quantity,
    };
  });

  const order = await prismadb.order.create({
    data: {
      totalPrice,
      pdfUrl: "",
      orderItems: {
        create: productsWithQuantity.map((product) => ({
          product: {
            connect: {
              id: product.item.id,
            },
          },
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
  };
};
