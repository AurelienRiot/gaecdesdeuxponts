"use server";

import { checkAdmin } from "@/components/auth/checkAuth";
import { OrderFormValues, orderSchema } from "../_components/order-shema";
import { ReturnTypeServerAction } from "@/types";
import prismadb from "@/lib/prismadb";
import { createCustomer } from "@/components/pdf/pdf-data";

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

  const validatedData = orderSchema.safeParse(data);
  if (!validatedData.success) {
    return {
      success: false,
      message: "Erreur lors de la validation des informations",
    };
  }

  const order = await prismadb.order.create({
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
    include: { user: { include: { address: true, billingAddress: true } } },
  });

  await prismadb.order.update({
    where: {
      id: data.id,
    },
    data: {
      customer: {
        create: createCustomer(order.user),
      },
    },
  });

  return {
    success: true,
    data: null,
  };
}

export default createOrder;
