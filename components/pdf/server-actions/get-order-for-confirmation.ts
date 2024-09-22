"use server";

import { checkAdmin } from "@/components/auth/checkAuth";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { z } from "zod";

const orderForConfirmationSchema = z.object({
  orderId: z.string(),
});

const getOrderForConfirmation = async (data: z.infer<typeof orderForConfirmationSchema>) => {
  return await safeServerAction({
    data,
    schema: orderForConfirmationSchema,
    getUser: checkAdmin,
    serverAction: async ({ orderId }) => {
      const order = await prismadb.order.findUnique({
        where: {
          id: orderId,
          deletedAt: null,
        },
        select: {
          dateOfShipping: true,
          orderItems: { select: { itemId: true, name: true, quantity: true, price: true } },
          user: { select: { image: true, name: true, email: true, company: true } },
        },
      });
      if (!order) {
        return {
          success: false,
          message: "La commande n'existe pas",
        };
      }
      return {
        success: true,
        message: "",
        data: order,
      };
    },
  });
};

export default getOrderForConfirmation;
