import prismadb from "@/lib/prismadb";

export type UserWithOrdersForInvoices = Awaited<ReturnType<typeof getUsersWithOrders>>;

export async function getUsersWithOrders() {
  return await prismadb.user.findMany({
    where: {
      role: { in: ["pro", "user"] },
      orders: {
        some: {
          deletedAt: null,
          dateOfShipping: { not: null },
          orderItems: { some: { price: { not: 0 } } },
          OR: [
            { invoiceOrder: { none: {} } },
            {
              invoiceOrder: {
                every: {
                  invoice: { deletedAt: { not: null } },
                },
              },
            },
          ],
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      image: true,
      name: true,
      company: true,
      orders: {
        where: {
          deletedAt: null,
          dateOfShipping: { not: null },
          orderItems: { some: { price: { not: 0 } } },
          OR: [
            { invoiceOrder: { none: {} } },
            {
              invoiceOrder: {
                every: {
                  invoice: { deletedAt: { not: null } },
                },
              },
            },
          ],
        },

        select: {
          id: true,
          dateOfShipping: true,
          totalPrice: true,
        },
        orderBy: { dateOfShipping: "desc" },
      },
    },
  });
}
