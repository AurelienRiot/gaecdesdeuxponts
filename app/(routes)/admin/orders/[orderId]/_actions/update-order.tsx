"use server";

import { checkAdmin } from "@/components/auth/checkAuth";
import { ReturnTypeServerAction } from "@/types";
import prismadb from "@/lib/prismadb";
import { OrderFormValues } from "../_components/order-form";

export async function updateOrder(
  data: OrderFormValues,
  id: string,
): Promise<ReturnTypeServerAction<null>> {
  const isAuth = await checkAdmin();

  if (!isAuth) {
    return {
      success: false,
      message: "Vous devez être authentifier",
    };
  }

  await prismadb.orderItem.deleteMany({
    where: {
      orderId: id,
    },
  });

  const shippingOrder = await prismadb.order.update({
    where: {
      id,
    },
    data: {
      userId: data.userId,
      totalPrice: data.totalPrice,
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

export default updateOrder;
