import { SHIPPING } from "@/components/auth";
import prismadb from "@/lib/prismadb";
import { unstable_cache } from "next/cache";

const getAllUsers = unstable_cache(
  async () => {
    return await prismadb.user.findMany({
      where: {
        NOT: {
          role: { in: SHIPPING },
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
  },
  ["getAllUsers"],
  { revalidate: 60 * 60 * 24 * 7, tags: ["users", "invoices"] },
);

export default getAllUsers;
