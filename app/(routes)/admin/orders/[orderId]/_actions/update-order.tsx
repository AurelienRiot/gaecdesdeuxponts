"use server";

import { checkAdmin } from "@/components/auth/checkAuth";
import { ReturnTypeServerAction } from "@/types";
import prismadb from "@/lib/prismadb";
import { OrderFormValues, orderSchema } from "../_components/order-shema";
import { createCustomer, createPDFData } from "@/components/pdf/pdf-data";

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

  const validatedData = orderSchema.safeParse(data);
  if (!validatedData.success) {
    return {
      success: false,
      message: "Erreur lors de la validation des informations",
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

  if (
    shippingOrder.dateOfEdition?.setHours(0, 0, 0, 0) ===
    new Date().setHours(0, 0, 0, 0)
  ) {
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
  return {
    success: true,
    data: null,
  };
}

export default updateOrder;
