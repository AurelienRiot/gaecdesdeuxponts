"server only";

import prismadb from "@/lib/prismadb";
import { currencyFormatter } from "@/lib/utils";
import type { Address, BillingAddress, Shop, User } from "@prisma/client";
import { unstable_cache } from "next/cache";
import type { OrderColumn } from "../_components/order-column";

export interface GetUserPageDataProps {
  formatedUser: User & {
    address: Address | null;
    shop: Shop | null;
    billingAddress: BillingAddress | null;
  };
  // formattedOrders: OrderColumn[];
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
      },
    });
    if (!user) return null;

    const formatedUser = {
      ...user,
      orders: undefined,
    };

    return { formatedUser };
  },
  ["getUserPageData"],
  { revalidate: 60 * 60 * 10, tags: ["users", "orders", "amap-orders", "invoices", "notifications", "shops"] },
);

export default getUserPageData;
