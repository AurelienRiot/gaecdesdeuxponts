"use server";

import { checkAdmin } from "@/components/auth/checkAuth";
import { OrderFormValues } from "../_components/order-form";
import { ReturnTypeServerAction } from "@/types";
import prismadb from "@/lib/prismadb";

export async function createOrder(
  data: OrderFormValues,
): Promise<ReturnTypeServerAction<null>> {
  const isAuth = await checkAdmin();

  if (!isAuth) {
    return {
      success: false,
      message: "Vous devez être authentifier",
    };
  }
  await prismadb.order.create({
    data: {
      id: data.id,
      totalPrice: data.totalPrice,
      userId: data.userId,
      dateOfShipping: data.dateOfShipping,
      dateOfPayment: data.dateOfPayment,
      datePickUp: data.datePickUp,
      orderItems: {
        create: data.orderItems.map((product) => {
          return {
            itemId: product.itemId,
            price: product.price || 0,
            quantity: product.quantity,
            unit: product.unit,
            name: product.name,
            categoryName: product.categoryName,
            description: product.description,
          };
        }),
      },
    },
  });

  return {
    success: true,
    data: null,
  };
}

export default createOrder;
