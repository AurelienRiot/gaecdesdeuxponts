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
      orders: { select: { id: true } },
    },
  });

  const orderLengths: { length: number; id: string }[] = allUsers.map((user) => {
    return { length: user.orders.length, id: user.id };
  });

  return <UserClient users={allUsers} orderLengths={orderLengths} />;
};

export default UserPage;
