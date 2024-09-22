import prismadb from "@/lib/prismadb";

export async function getAllUsers() {
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
            select: { invoice: { select: { invoiceEmail: true, dateOfPayment: true } } },
            orderBy: { createdAt: "desc" },
          },
        },
        orderBy: { dateOfShipping: "desc" },
      },
    },
  });
}
