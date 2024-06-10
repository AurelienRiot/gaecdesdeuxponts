"use server";

import { checkAdmin } from "@/components/auth/checkAuth";
import { createCustomer } from "@/components/pdf/pdf-data";
import prismadb from "@/lib/prismadb";
import { OrderFormValues, orderSchema } from "../_components/order-shema";

export async function createOrder(data: OrderFormValues): Promise<void> {
  const isAuth = await checkAdmin();

  if (!isAuth) {
    throw new Error(`Vous devez être authentifier`);
  }

  const validatedData = orderSchema.safeParse(data);
  if (!validatedData.success) {
    throw new Error(`La requête n'est pas valide`);
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
}

export default createOrder;
