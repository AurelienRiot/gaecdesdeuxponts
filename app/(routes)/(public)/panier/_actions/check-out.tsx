"use server";

import { checkUser } from "@/components/auth/checkAuth";
import OrderEmail from "@/components/email/order";
import Order from "@/components/pdf/create-commande";
import {
  createCustomer,
  createPDFData,
  generateOrderId,
} from "@/components/pdf/pdf-data";
import { getUnitLabel } from "@/components/product/product-function";
import { dateFormatter, isDateDisabled } from "@/lib/date-utils";
import { transporter } from "@/lib/nodemailer";
import prismadb from "@/lib/prismadb";
import { currencyFormatter } from "@/lib/utils";
import { FullOrder, ProductWithMain, UserWithAddress } from "@/types";
import { render } from "@react-email/render";
import { pdf } from "@react-pdf/renderer";
import { revalidatePath } from "next/cache";

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
  itemsWithQuantities: {
    id: string;
    price: number;
    quantity: number;
  }[];
  date: Date;
  shopId: string;
};

export const checkOut = async ({
  itemsWithQuantities,
  date,
  shopId,
}: CheckOutProps): Promise<CheckOutReturnType> => {
  const isAuth = await checkUser();

  if (isDateDisabled(date)) {
    return {
      success: false,
      message:
        "La date n'est pas valide, veuillez selectionner une date correcte",
    };
  }

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
    include: {
      address: true,
      billingAddress: true,
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

  const mismatchedProducts = itemsWithQuantities.filter((item) => {
    const matchingProduct = products.find((product) => product.id === item.id);
    return !matchingProduct || matchingProduct.price !== item.price;
  });

  const totalPrice = itemsWithQuantities.reduce((acc, { price, quantity }) => {
    return acc + (price || 0) * (quantity || 1);
  }, 0);

  if (mismatchedProducts.length > 0) {
    console.log("Mismatched IDs:", mismatchedProducts);
    return {
      success: false,
      message: `Produits modifiés`,
      ids: mismatchedProducts.map((product) => product.id),
    };
  }

  try {
    const order = await createOrder({
      productsWithQuantity,
      totalPrice,
      user,
      datePickUp: date,
      shopId,
    });
    const pdfBuffer = await generatePdf(order);

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
      attachments: [
        {
          filename: `Bon_de_commande-${order.id}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    revalidatePath("/dashboard-user/orders");

    return {
      success: true,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Erreur lors de la commande.",
    };
  }
};

async function generatePdf(order: FullOrder) {
  const doc = <Order data={createPDFData(order)} />;
  const pdfBlob = await pdf(doc).toBlob();
  const arrayBuffer = await pdfBlob.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

type CreateOrderType = {
  totalPrice: number;
  productsWithQuantity: { item: ProductWithMain; quantity?: number }[];
  shopId: string;
  user: UserWithAddress;
  datePickUp: Date;
};

async function createOrder({
  totalPrice,
  productsWithQuantity,
  shopId,
  user,
  datePickUp,
}: CreateOrderType) {
  const order = await prismadb.order.create({
    data: {
      id: generateOrderId(),
      totalPrice,
      orderItems: {
        create: productsWithQuantity.map((product) => ({
          itemId: product.item.id,
          name: product.item.name,
          description: product.item.description,
          categoryName: product.item.product.categoryName,
          price: product.item.price,
          unit: getUnitLabel(product.item.unit).quantity,
          quantity: product.quantity,
        })),
      },
      userId: user.id,
      shopId: shopId === "domicile" ? null : shopId,
      datePickUp,
      customer: {
        create: createCustomer(user),
      },
    },
    include: {
      shop: true,
      orderItems: true,
      customer: true,
    },
  });
  return order;
}
