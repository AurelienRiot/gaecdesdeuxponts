"server only";
import { getUnitLabel } from "@/components/product/product-function";
import { getLocalDay } from "@/lib/date-utils";
import { createId } from "@/lib/id";
import prismadb from "@/lib/prismadb";
import { unstable_cache } from "next/cache";
import type { OrderFormProps } from "../_components/order-form";
import type { ProductsForOrdersType } from "./get-products-for-orders";

const getShippingOrder = async ({
  orderId,
  dateOfShipping,
  userId,
  newOrderId,
}: { orderId: string; newOrderId?: string; dateOfShipping?: Date; userId?: string }) => {
  const defaultOrder = await getDefaulOrder(userId, dateOfShipping, !newOrderId);
  if (defaultOrder) return defaultOrder;

  if (orderId === "new" && !newOrderId) return null;
  const shippingOrders = await prismadb.order.findUnique({
    where: {
      id: orderId === "new" ? newOrderId : orderId,
      deletedAt: null,
    },
    select: {
      id: true,
      totalPrice: true,
      dateOfShipping: true,
      dateOfEdition: true,
      shippingEmail: true,
      orderItems: {
        select: {
          id: true,
          stocks: true,
          name: true,
          itemId: true,
          unit: true,
          tax: true,
          icon: true,
          price: true,
          quantity: true,
          categoryName: true,
          description: true,
        },
      },
      userId: true,
      shopId: true,
      datePickUp: true,
      invoiceOrder: {
        select: { invoice: { select: { id: true, invoiceEmail: true, dateOfPayment: true } } },
        where: { invoice: { deletedAt: null } },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  const initialData: OrderFormProps["initialData"] = !shippingOrders
    ? null
    : orderId === "new"
      ? {
          ...shippingOrders,
          dateOfShipping,
          orderItems: shippingOrders.orderItems.filter((item) => item.quantity > 0 && item.price >= 0),
          id: null,
          dateOfEdition: null,
        }
      : {
          ...shippingOrders,
          invoiceId: shippingOrders.invoiceOrder[0]?.invoice.id,
          invoiceEmail: shippingOrders.invoiceOrder[0]?.invoice.invoiceEmail,
          dateOfPayment: shippingOrders.invoiceOrder[0]?.invoice.dateOfPayment,
        };

  return initialData;
};

const getUserDefaulOrder = unstable_cache(
  async (userId: string, day: number) => {
    return await prismadb.defaultOrder.findUnique({
      where: {
        userId_day: {
          userId,
          day,
        },
      },
      include: {
        defaultOrderProducts: { include: { product: { include: { product: true, stocks: true } } } },
      },
    });
  },
  ["getUserDefaulOrder"],
  { revalidate: 60 * 60 * 24 * 7, tags: ["defaultOrders", "products", "stocks-name"] },
);
const getDefaulOrder = async (
  userId?: string,
  dateOfShipping?: Date,
  emptyOrder?: boolean,
): Promise<OrderFormProps["initialData"] | null> => {
  if (!userId || !dateOfShipping) return null;
  const defaultOrder = await getUserDefaulOrder(userId, getLocalDay(dateOfShipping));

  if (defaultOrder) {
    return {
      dateOfShipping,
      orderItems: defaultOrder.defaultOrderProducts.map(({ product, price, quantity }) => ({
        categoryName: product.product.categoryName,
        description: product.description,
        itemId: product.id,
        name: product.name,
        icon: product.icon,
        price,
        quantity,
        unit: product.unit,
        stocks: product.stocks.map((stock) => stock.stockId),
        tax: product.tax,
        id: createId("orderItem"),
      })),
      userId,
      datePickUp: dateOfShipping,
      totalPrice: defaultOrder.defaultOrderProducts.reduce((acc, curr) => acc + curr.price * curr.quantity, 0),
      shopId: defaultOrder.shopId,
      id: null,
      dateOfEdition: defaultOrder.confirmed ? new Date() : null,
      invoiceId: null,
      invoiceEmail: null,
      shippingEmail: null,
      dateOfPayment: null,
    };
  }
  if (emptyOrder) {
    return {
      dateOfShipping,
      orderItems: [],
      userId,
      datePickUp: dateOfShipping,
      totalPrice: 0,
      shopId: null,
      id: null,
      dateOfEdition: null,
      invoiceId: null,
      invoiceEmail: null,
      shippingEmail: null,
      dateOfPayment: null,
    };
  }
  return null;
};

export function updateProductsForOrder(
  order: NonNullable<OrderFormProps["initialData"]>,
  products: ProductsForOrdersType,
) {
  for (const item of order.orderItems) {
    const product = products.find((product) => product.id === item.itemId);
    if (product) {
      item.name = product.name;
      item.icon = product.icon;
      item.description = product.description;
      item.categoryName = product.product.categoryName;
      item.stocks = product.stocks.map((stock) => stock.stockId);
      item.tax = product.tax;
      item.unit = getUnitLabel(product.unit).quantity;
    }
  }
  return order;
}

export default getShippingOrder;
