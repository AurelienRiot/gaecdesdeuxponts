"use server";

import { getSessionUser } from "@/actions/get-user";
import OrderEmail from "@/components/email/order";
import OrderSendEmail from "@/components/email/order-send";
import Order from "@/components/pdf/create-commande";
import { createCustomer, createPDFData, generateOrderId } from "@/components/pdf/pdf-data";
import { getUnitLabel } from "@/components/product/product-function";
import { dateFormatter, isDateDisabled } from "@/lib/date-utils";
import { transporter } from "@/lib/nodemailer";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { currencyFormatter } from "@/lib/utils";
import type { FullOrder, ProductWithMain, UserWithAddress } from "@/types";
import { render } from "@react-email/render";
import { pdf } from "@react-pdf/renderer";
import { revalidatePath } from "next/cache";
import * as z from "zod";

const baseUrl = process.env.NEXT_PUBLIC_URL as string;
const ExcludeEmail = ["yoyololo1235@gmail.com", "pub.demystify390@passmail.net"];

const checkOutSchema = z.object({
  date: z.date().refine((date) => !isDateDisabled(date), {
    message: "La date n'est pas valide, veuillez selectionner une date correcte",
  }),
  shopId: z.string({
    required_error: "Veuillez selectionner un magasin",
  }),
  itemsWithQuantities: z.array(
    z.object({
      id: z.string({
        required_error: "Produit introuvable",
        invalid_type_error: "Produit introuvable",
      }),
      price: z.number({
        required_error: "Produit introuvable",
        invalid_type_error: "Prix invalide",
      }),
      quantity: z.number({
        invalid_type_error: "Quantité invalide",
        required_error: "Quantité invalide",
      }),
    }),
  ),
});

type CheckOutProps = z.infer<typeof checkOutSchema>;

async function getUser() {
  const isAuth = await getSessionUser();
  if (!isAuth) return null;
  const user = await prismadb.user.findUnique({
    where: {
      id: isAuth.id,
    },
    include: {
      address: true,
      billingAddress: true,
    },
  });
  return user;
}

export const createCheckOut = async (data: CheckOutProps) =>
  await safeServerAction({
    data,
    getUser,
    schema: checkOutSchema,
    serverAction: async (data, user) => {
      const { itemsWithQuantities, date, shopId } = data;
      const productIds = itemsWithQuantities.map((item) => item.id);
      console.time("Total Execution Time");

      console.time("Fetch Products");
      try {
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
        console.timeEnd("Fetch Products");

        console.time("Map Products with Quantity");
        const productsWithQuantity = products.map((product) => {
          return {
            item: product,
            quantity: itemsWithQuantities.find((item) => item.id === product.id)?.quantity,
          };
        });
        console.timeEnd("Map Products with Quantity");

        console.time("Find Mismatched Products");
        // Find mismatched products
        const mismatchedProducts = itemsWithQuantities.filter((item) => {
          const matchingProduct = products.find((product) => product.id === item.id);
          return (
            !matchingProduct ||
            matchingProduct.price !== item.price ||
            (matchingProduct.product.isPro && user.role !== "pro")
          );
        });

        if (mismatchedProducts.length > 0) {
          console.log("Mismatched IDs:", mismatchedProducts);
          return {
            success: false,
            message: `Produits modifiés`,
            errorData: mismatchedProducts.map((product) => product.id),
          };
        }

        console.timeEnd("Find Mismatched Products");

        console.time("Calculate Total Price");
        const totalPrice = itemsWithQuantities.reduce((acc, { price, quantity }) => {
          return acc + (price || 0) * (quantity || 1);
        }, 0);
        console.timeEnd("Calculate Total Price");

        console.time("Create Order");
        const order = await createOrder({
          productsWithQuantity,
          totalPrice,
          user,
          datePickUp: date,
          shopId,
        });
        console.timeEnd("Create Order");
        console.time("Generate PDF");
        const pdfBuffer = await generatePdf(order);
        console.timeEnd("Generate PDF");

        console.time("Generate email");
        // Send emails in parallel
        const emailPromises = [
          transporter.sendMail({
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
              { filename: `Bon_de_commande-${order.id}.pdf`, content: pdfBuffer, contentType: "application/pdf" },
            ],
          }),
        ];

        if (process.env.NODE_ENV === "production" && user.email && !ExcludeEmail.includes(user.email)) {
          emailPromises.push(
            transporter.sendMail({
              from: "laiteriedupontrobert@gmail.com",
              to: "laiteriedupontrobert@gmail.com",
              subject: "[NOUVELLE COMMANDE] - Laiterie du Pont Robert",
              html: render(
                OrderSendEmail({
                  baseUrl,
                  id: order.id,
                  name: user.name || user.email || "Utilisateur inconnu",
                  price: currencyFormatter.format(totalPrice),
                  date: dateFormatter(order.createdAt),
                }),
              ),
            }),
          );
        }
        console.timeEnd("Generate email");
        console.time("Send Emails");
        await Promise.all(emailPromises);
        console.timeEnd("Send Emails");

        revalidatePath("/dashboard-user/orders");

        console.timeEnd("Total Execution Time");
        return {
          success: true,
          message: "Commande effectuée avec succès",
        };
      } catch (error) {
        console.log(error);
        return {
          success: false,
          message: "Erreur lors de la commande.",
        };
      }
    },
  });

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

async function createOrder({ totalPrice, productsWithQuantity, shopId, user, datePickUp }: CreateOrderType) {
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
