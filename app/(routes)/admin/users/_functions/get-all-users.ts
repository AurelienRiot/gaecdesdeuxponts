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
        select: { id: true, dateOfPayment: true, dateOfShipping: true, totalPrice: true, invoiceEmail: true },
        orderBy: { dateOfShipping: "desc" },
      },
    },
  });
}
