"use server";
import { authOptions } from "@/components/auth/authOptions";
import prismadb from "@/lib/prismadb";
import { getServerSession } from "next-auth";

export const fetchUser = async () => {
  const session = await getServerSession(authOptions);
  const user = await prismadb.user.findUnique({
    where: {
      id: session?.user?.id,
    },
    include: {
      orders: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          orderItems: true,
          shop: true,
        },
      },

      address: true,
      billingAddress: true,
    },
  });
  return user;
};
