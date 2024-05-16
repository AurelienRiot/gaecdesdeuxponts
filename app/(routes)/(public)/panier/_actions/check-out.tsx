"use server";

import { checkUser } from "@/components/auth/checkAuth";
import OrderEmail from "@/components/email/order";
import { getUnitLabel } from "@/components/product/product-function";
import { transporter } from "@/lib/nodemailer";
import prismadb from "@/lib/prismadb";
import { currencyFormatter, dateFormatter } from "@/lib/utils";
import { ProductWithMain } from "@/types";
import { render } from "@react-email/render";
import { nanoid } from "nanoid";

const baseUrl = process.env.NEXT_PUBLIC_URL as string;

type CheckOutReturnType =
  | {
      success: true;
    }
  | {
      success: false;
      message: string;
      ids?: string[];
    };

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
    const foundProductIds = products.map((product) => product.id);
    const notFoundProductIds = productIds.filter(
      (id) => !foundProductIds.includes(id),
    );
    if (notFoundProductIds.length > 0) {
      return {
        success: false,
        message: `Produits modifiés`,
        ids: notFoundProductIds,
      };
    }
  }

  const order = await createOrder({
    productsWithQuantity,
    totalPrice,
    userId: isAuth.id,
    datePickUp: date,
    shopId,
    name: user.name || user.email || "",
  });

  await createShippingOrder({
    productsWithQuantity,
    totalPrice,
    userId: isAuth.id,
    datePickUp: date,
    shopId,
    name: user.name || user.email || "",
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
  };
};

type CreateOrder = {
  totalPrice: number;
  productsWithQuantity: { item: ProductWithMain; quantity?: number }[];
  shopId: string;
  userId: string;
  name: string;
  datePickUp: Date;
};

async function createOrder({
  totalPrice,
  productsWithQuantity,
  shopId,
  userId,
  name,
  datePickUp,
}: CreateOrder) {
  const order = await prismadb.order.create({
    data: {
      id: `BC_${nanoid()}`,
      totalPrice,
      orderItems: {
        create: productsWithQuantity.map((product) => ({
          name: product.item.name,
          description: product.item.description,
          categoryName: product.item.product.categoryName,
          price: product.item.price,
          unit: getUnitLabel(product.item.unit).quantity,
          quantity: product.quantity,
        })),
      },
      userId,
      shopId: shopId === "domicile" ? null : shopId,
      name,
      datePickUp,
    },
  });
  return order;
}

type CreateShippingOrder = CreateOrder;

async function createShippingOrder({
  totalPrice,
  productsWithQuantity,
  shopId,
  userId,
  name,
  datePickUp,
}: CreateShippingOrder) {
  await prismadb.order.create({
    data: {
      id: `BC_${nanoid()}`,
      totalPrice,
      orderItems: {
        create: productsWithQuantity.map((product) => ({
          name: product.item.name,
          description: product.item.description,
          categoryName: product.item.product.categoryName,
          price: product.item.price,
          unit: getUnitLabel(product.item.unit).quantity,
          quantity: product.quantity,
        })),
      },
      userId,
      shopId: shopId === "domicile" ? null : shopId,
      name,
      datePickUp,
    },
  });
}
