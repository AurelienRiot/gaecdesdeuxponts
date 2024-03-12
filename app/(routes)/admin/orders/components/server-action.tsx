"use server";

import { checkAdmin } from "@/components/auth/checkAuth";
import prismadb from "@/lib/prismadb";
import { DateRange } from "react-day-picker";
import { OrderColumn } from "./columns";
import { currencyFormatter, dateFormatter } from "@/lib/utils";

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

  const formattedOrders: OrderColumn[] = orders.map((order) => ({
    id: order.id,
    userId: order.userId,
    isPaid: order.isPaid,
    datePickUp: order.datePickUp,
    name: order.name,
    products: order.orderItems
      .map((item) => {
        let name = item.name;
        if (Number(item.quantity) > 1) {
          name += ` x${item.quantity}`;
        }
        return name;
      })
      .join(", "),
    totalPrice: currencyFormatter.format(order.totalPrice),
    createdAt: order.createdAt,
    shopName: order.shop.name,
    shopId: order.shop.id,
    dataInvoice: {
      customer: {
        id: order.user.id || "",
        name: order.user.name || "",
        address: (() => {
          const u = order.user;
          const a =
            order.user.address[0] && u.address[0].line1
              ? `${u.address[0].line1} ${u.address[0].postalCode} ${u.address[0].city}`
              : "";

          return a;
        })(),
        phone: order.user.phone || "",
        email: order.user.email || "",
      },

      order: {
        id: order.id,
        dateOfPayment: dateFormatter(order.datePickUp),
        dateOfEdition: dateFormatter(new Date()),
        items: order.orderItems.map((item) => ({
          desc: item.name,
          qty: item.quantity,
          priceTTC: item.price,
        })),
        total: order.totalPrice,
      },
    },
  }));

  return {
    success: true,
    data: formattedOrders,
  };
};

export { deleteOrders, getOrders };
