"use server";

import { createCustomer } from "@/components/pdf/pdf-data";
import { getUnitLabel } from "@/components/product/product-function";
import { isDateDisabled } from "@/lib/date-utils";
import { createId } from "@/lib/id";
import prismadb from "@/lib/prismadb";
import { revalidateOrders } from "@/lib/revalidate-path";
import safeServerAction from "@/lib/server-action";
import type { ProductWithMain, UserWithAddress } from "@/types";
import * as z from "zod";

export const getUserWithAdress = async (id: string) => {
  const user = await prismadb.user.findUnique({
    where: {
      id,
    },
    include: {
      address: true,
      billingAddress: true,
    },
  });

  return user;
};

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

export const createCheckOut = async (data: CheckOutProps) =>
  await safeServerAction({
    data,
    schema: checkOutSchema,
    serverAction: async ({ itemsWithQuantities, date, shopId }, { id }) => {
      const user = await getUserWithAdress(id);
      if (!user) {
        return {
          success: false,
          message: "Utilisateur introuvable",
        };
      }
      const productIds = itemsWithQuantities.map((item) => item.id);

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
        const productsWithQuantity = products.map((product) => {
          return {
            item: product,
            quantity: itemsWithQuantities.find((item) => item.id === product.id)?.quantity,
          };
        });
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

        const totalPrice = itemsWithQuantities.reduce((acc, { price, quantity }) => {
          return acc + (price || 0) * (quantity || 1);
        }, 0);
        const order = await createOrder({
          productsWithQuantity,
          totalPrice,
          user,
          datePickUp: date,
          shopId,
        });
        return {
          success: true,
          message: "Commande effectuée avec succès",
          data: { orderId: order.id },
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
      id: createId("order", datePickUp),
      totalPrice,
      orderItems: {
        create: productsWithQuantity.map((product) => ({
          itemId: product.item.id,
          name: product.item.name,
          icon: product.item.icon,
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
      dateOfShipping: datePickUp,
    },
    // include: {
    //   shop: true,
    //   orderItems: true,
    //   customer: true,
    // },
  });
  const customer = createCustomer(user);
  await prismadb.shippingCustomer.create({
    data: {
      orderId: order.id,
      ...customer,
    },
  });
  revalidateOrders();

  return order;
}
