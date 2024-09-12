import prismadb from "@/lib/prismadb";

export const getOrdersByDateOfShipping = async ({ beginMonth, endMonth }: { beginMonth: Date; endMonth: Date }) => {
  return await prismadb.order
    .findMany({
      where: {
        dateOfShipping: {
          gte: beginMonth,
          lt: endMonth,
        },
        deletedAt: null,
      },
      select: {
        dateOfShipping: true,
      },
      distinct: ["dateOfShipping"],
    })
    .then((orders) => {
      return orders.map((order) => order.dateOfShipping).filter((date): date is Date => date instanceof Date);
    });
};
