"use server";

import { checkAdmin } from "@/components/auth/checkAuth";
import prismadb from "@/lib/prismadb";
import { DateRange } from "react-day-picker";
import { OrderColumn } from "./columns";
import { currencyFormatter, dateFormatter } from "@/lib/utils";
import { formatOrders } from "./format-orders";

type ReturnType =
  | {
      success: true;
    }
  | {
      success: false;
      message: string;
    };

async function deleteOrders({
  id,
}: {
  id: string | undefined;
}): Promise<ReturnType> {
  const isAuth = await checkAdmin();

  if (!isAuth) {
    return {
      success: false,
      message: "Vous devez être authentifier",
    };
  }
  const order = await prismadb.order.deleteMany({
    where: {
      id,
    },
  });

  if (order.count === 0) {
    return {
      success: false,
      message: "Une erreur est survenue",
    };
  }

  return {
    success: true,
  };
}

type ReturnTypeGetOrders =
  | {
      success: true;
      data: OrderColumn[];
    }
  | {
      success: false;
      message: string;
    };

const getOrders = async (
  dateRange: DateRange | undefined,
): Promise<ReturnTypeGetOrders> => {
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
      shop: { select: { name: true, id: true } },
      user: {
        select: {
          id: true,
          name: true,
          address: true,
          phone: true,
          email: true,
        },
      },
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

const changeStatus = async ({
  id,
  isPaid,
}: {
  id: string;
  isPaid: boolean | "indeterminate";
}): Promise<ReturnType> => {
  const isAuth = await checkAdmin();

  if (!isAuth) {
    return {
      success: false,
      message: "Vous devez être authentifier",
    };
  }

  if (isPaid === "indeterminate") {
    return {
      success: false,
      message: "Une erreur est survenue, veuillez reessayer",
    };
  }
  try {
    const order = await prismadb.order.update({
      where: {
        id,
      },
      data: {
        isPaid,
      },
    });
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      message: "Une erreur est survenue, veuillez reessayer",
    };
  }
};

export { deleteOrders, getOrders, changeStatus };
