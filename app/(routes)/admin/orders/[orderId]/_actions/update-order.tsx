"use server";

import { checkAdmin } from "@/components/auth/checkAuth";
import { createCustomer } from "@/components/pdf/pdf-data";
import prismadb from "@/lib/prismadb";
import { OrderFormValues, orderSchema } from "../_components/order-shema";

export async function updateOrder(
  data: OrderFormValues,
  id: string,
): Promise<void> {
  const isAuth = await checkAdmin();

  if (!isAuth) {
    throw new Error(`Vous devez être authentifier`);
  }

  const validatedData = orderSchema.safeParse(data);
  if (!validatedData.success) {
    throw new Error(`La requête n'est pas valide`);
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
      dateOfEdition: data.dateOfEdition || new Date(),
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

  const customer = createCustomer(shippingOrder.user);
  await prismadb.order.update({
    where: {
      id,
    },
    data: {
      customer: {
        upsert: {
          create: customer,
          update: customer,
        },
      },
    },
  });
}

export default updateOrder;
