import prismadb from "@/lib/prismadb";

export async function getProUsersWithOrders() {
  return await prismadb.user.findMany({
    where: {
      NOT: {
        role: { in: ["admin", "deleted", "readOnlyAdmin"] },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      orders: {
        where: { deletedAt: null },
        select: {
          id: true,
          dateOfShipping: true,
          totalPrice: true,
          invoiceOrder: {
            select: { invoice: { select: { id: true, invoiceEmail: true, dateOfPayment: true } } },
            orderBy: { createdAt: "desc" },
            where: { invoice: { deletedAt: null } },
          },
        },
        orderBy: { dateOfShipping: "desc" },
      },
    },
  });
}
