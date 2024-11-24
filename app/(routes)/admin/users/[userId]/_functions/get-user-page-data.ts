"server only";
import {
  createDatePickUp,
  createProduct,
  createProductList,
  createStatus,
} from "@/components/table-custom-fuction/cell-orders";
import prismadb from "@/lib/prismadb";
import { currencyFormatter } from "@/lib/utils";
import type { Address, BillingAddress, Shop, User } from "@prisma/client";
import { unstable_cache } from "next/cache";
import type { OrderColumn } from "../_components/order-column";

export interface GetUserPageDataProps {
  formatedUser: User & {
    address: Address | null;
    shop: Shop | null;
    // links: Link[];
    billingAddress: BillingAddress | null;
  };
  formattedOrders: OrderColumn[];
}

const getUserPageData = unstable_cache(
  async (id: string | undefined): Promise<GetUserPageDataProps | null> => {
    const user = await prismadb.user.findUnique({
      where: {
        id,
      },
      include: {
        address: true,
        billingAddress: true,
        shop: true,
        orders: {
          where: {
            deletedAt: null,
          },
          orderBy: {
            createdAt: "desc",
          },
          include: {
            orderItems: true,
            shop: true,
            invoiceOrder: {
              select: { invoice: { select: { id: true, invoiceEmail: true, dateOfPayment: true } } },
              orderBy: { createdAt: "desc" },
              where: { invoice: { deletedAt: null } },
            },
          },
        },
      },
    });
    if (!user) return null;

    const formatedUser = {
      ...user,
      orders: undefined,
    };

    const formattedOrders: OrderColumn[] = (user?.orders || []).map((order) => ({
      id: order.id,
      shippingEmail: order.shippingEmail,
      invoiceEmail: order.invoiceOrder[0]?.invoice.invoiceEmail,
      products: createProduct(order.orderItems),
      productsList: createProductList(order.orderItems),
      datePickUp: createDatePickUp({ dateOfShipping: order.dateOfShipping, datePickUp: order.datePickUp }),
      status: createStatus(order),
      isPaid: !!order.invoiceOrder[0]?.invoice.dateOfPayment,
      totalPrice: currencyFormatter.format(order.totalPrice),
      createdAt: order.createdAt,
      shopName: order.shop?.name || "Livraison à domicile",
      shopId: order.shop?.id || "",
      shopImage: order.shop?.imageUrl,
    }));
    return { formatedUser, formattedOrders };
  },
  ["getUserPageData"],
  { revalidate: 60 * 60 * 10, tags: ["users", "orders", "amap-orders", "invoices", "notifications", "shops"] },
);

export default getUserPageData;
