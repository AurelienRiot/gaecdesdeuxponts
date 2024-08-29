import prismadb from "@/lib/prismadb";
import UserClient from "./_components/client";

export const dynamic = "force-dynamic";

const UserPage = async () => {
  const allUsers = await prismadb.user.findMany({
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
        select: { id: true, dateOfPayment: true, dateOfShipping: true },
      },
    },
  });

  const orderLengths: { length: number; id: string }[] = allUsers.map((user) => {
    return { length: user.orders.length, id: user.id };
  });

  const userOrders = allUsers.map((user) => ({
    id: user.id,
    name: user.company || "",
    role: user.role,
    orders: user.orders.filter(
      (order) =>
        order.dateOfShipping &&
        order.dateOfShipping.getTime() <=
          new Date(new Date().setFullYear(new Date().getFullYear(), new Date().getMonth(), 1)).setHours(0, 0, 0, 0),
    ),
  }));

  const isPaidArray: { isPaid: boolean; id: string; display: boolean }[] = userOrders.map((user) => {
    const isPaid = user.orders.every((order) => order.dateOfPayment);
    return { isPaid, id: user.id, display: user.role === "pro" && user.orders.length > 0 };
  });

  return <UserClient users={allUsers} orderLengths={orderLengths} isPaidArray={isPaidArray} />;
};

export default UserPage;
