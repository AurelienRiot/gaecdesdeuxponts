"use server";

import { checkAdmin } from "@/components/auth/checkAuth";
import prismadb from "@/lib/prismadb";
import type { ReturnTypeServerAction } from "@/lib/server-action";
import type { DateRange } from "react-day-picker";
import type { OrderColumn } from "../_components/columns";
import { formatOrders } from "../_components/format-orders";

const getOrders = async (dateRange: DateRange | undefined): Promise<ReturnTypeServerAction<OrderColumn[]>> => {
  const isAuth = await checkAdmin();

  if (!isAuth) {
    return {
      success: false,
      message: "Vous devez être authentifier",
    };
  }

  if (!dateRange) {
    return {
      success: false,
      message: "Veuillez choisir une date",
    };
  }

  const orders = await prismadb.order.findMany({
    include: {
      orderItems: true,
      shop: true,
      customer: true,
      user: true,
    },
    where: {
      createdAt: {
        gte: dateRange.from,
        lte: dateRange.to,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!orders || orders.length === 0) {
    return {
      success: false,
      message: "Aucune commande n'a été trouvée",
    };
  }

  const formattedOrders = formatOrders(orders);

  return {
    success: true,
    data: formattedOrders,
  };
};

export default getOrders;
