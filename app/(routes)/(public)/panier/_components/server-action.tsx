"use server";

import { checkUser } from "@/components/auth/checkAuth";
import OrderEmail from "@/components/email/order";
import { transporter } from "@/lib/nodemailer";
import prismadb from "@/lib/prismadb";
import { currencyFormatter, dateFormatter } from "@/lib/utils";
import { ReturnTypeServerAction } from "@/types";
import { render } from "@react-email/render";
import { nanoid } from "nanoid";

const baseUrl = process.env.NEXT_PUBLIC_URL as string;

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
        "Des prix ont changé depuis votre dernière visite et votre panier n'est pas valide, vider le panier et recharger la page",
    };
  }

  const order = await prismadb.order.create({
    data: {
      id: `FA_${nanoid()}`,
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
      shopId: shopId === "domicile" ? null : shopId,
      name: user.name || user.email || "",
      datePickUp: date,
    },
  });

  await transporter.sendMail({
    from: "laiteriedupontrobert@gmail.com",
    to: user.email || "",
    subject: "Confirmation de votre commande - Laiterie du Pont Robert",
    html: render(
      OrderEmail({
        date: dateFormatter(order.createdAt),
        baseUrl,
        id: order.id,
        price: currencyFormatter.format(totalPrice),
      }),
    ),
  });

  return {
    success: true,
    data: null,
  };
};
