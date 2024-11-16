import type { OrderFormValues } from "@/app/(routes)/admin/orders/[orderId]/_components/order-schema";
import createOrderAction from "@/app/(routes)/admin/orders/[orderId]/_functions/create-order";
import getShippingOrder, { updateProductsForOrder } from "@/app/(routes)/admin/orders/[orderId]/_functions/get-order";
import getProductsForOrders from "@/app/(routes)/admin/orders/[orderId]/_functions/get-products-for-orders";
import { SHIPPING_ONLY } from "@/components/auth";
import { safeAPIRoute } from "@/lib/api-route";
import type { NextRequest } from "next/server";
import { z } from "zod";

export const dynamic = "force-dynamic";

const newOrderSchema = z.object({
  userId: z.string().min(1, { message: "L'utilisateur est requis" }),
  dateOfShipping: z.coerce.date({ message: "La date d'envoi est requise" }),
  newOrderId: z.string(),
});

export async function POST(request: NextRequest) {
  return await safeAPIRoute({
    method: "POST",
    request,
    schema: newOrderSchema,
    roles: SHIPPING_ONLY,
    serverError: "[CREATE_ORDER]",
    serverAction: async ({ newOrderId, dateOfShipping, userId }) => {
      const [products, initialData] = await Promise.all([
        getProductsForOrders(),
        getShippingOrder({
          orderId: "new",
          dateOfShipping,
          userId,
          newOrderId,
        }),
      ]);
      if (!initialData) {
        return { success: false, message: "Commande introuvable" };
      }

      const formattedOrder: OrderFormValues = {
        ...updateProductsForOrder(initialData, products),
        id: "1",
      };

      return await createOrderAction(formattedOrder);
    },
  });
}
