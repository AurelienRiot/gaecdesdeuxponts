import prismadb from "@/lib/prismadb";
import UserClient from "./_components/client";

export const dynamic = "force-dynamic";

const UserPage = async () => {
  const allUsers = await prismadb.user.findMany({
    where: {
      NOT: {
        role: { in: ["admin", "deleted"] },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    // include: {
    //   orders: { select: { id: true } },
    // },
  });

  // const orderLengths = allUsers.map((user) => {
  //   return user.orders.length;
  // });

  // const formatedUsers = allUsers.map((user) => {
  //   return {
  //     ...user,
  //     orders: [],
  //   };
  // });

  return (
    <UserClient
      users={allUsers}
      // orderLengths={orderLengths}
    />
  );
};

export default UserPage;
