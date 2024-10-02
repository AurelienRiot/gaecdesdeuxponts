import { getUserName } from "@/components/table-custom-fuction";
import { dateMonthYear } from "@/lib/date-utils";
import prismadb from "@/lib/prismadb";
import { UserProducts } from "./user-products";

const MAX_PRODUCTS = 9;

const ClientProducts = async ({ startDate, endDate }: { startDate: Date; endDate: Date }) => {
  const users = await getUserOrders({ startDate, endDate });
  const filteredUsers = users.map((user) => ({
    ...user,
    orders: user.orders.map((order) => ({
      ...order,
      orderItems: order.orderItems.filter((item) => item.price >= 0),
    })),
  }));

  const topProducts = getTopProducts(filteredUsers);

  const userProductQuantities = filteredUsers
    .map((user) => {
      const productQuantities = user.orders
        .flatMap((order) => order.orderItems)
        .reduce(
          (acc, item) => {
            if (topProducts.includes(item.name)) {
              acc[item.name] = (acc[item.name] || 0) + item.quantity;
            } else {
              acc[`${"Autres"}`] = (acc[`${"Autres"}`] || 0) + item.quantity;
            }
            acc.total = (acc.total || 0) + item.quantity; // Calculate total quantity for each user
            return acc;
          },
          {} as Record<string, number>,
        );

      const { total, ...rest } = productQuantities;
      return { name: getUserName(user), productQuantities: rest, total };
    })
    .sort((a, b) => b.total - a.total);

  return (
    <UserProducts chartData={userProductQuantities} productName={topProducts} monthYear={dateMonthYear([startDate])} />
  );
};

function getTopProducts(users: Awaited<ReturnType<typeof getUserOrders>>) {
  const productsWithQuantities = users.flatMap((user) => {
    return user.orders.flatMap((order) =>
      order.orderItems.flatMap((item) => ({ name: item.name, quantity: item.quantity })),
    );
  });

  const groupedProducts = productsWithQuantities.reduce(
    (acc, item) => {
      if (!acc[item.name]) {
        acc[item.name] = 0;
      }
      acc[item.name] += item.quantity;
      return acc;
    },
    {} as Record<string, number>,
  );
  const topProducts = Object.entries(groupedProducts)
    .sort(([, quantityA], [, quantityB]) => quantityB - quantityA)
    .slice(0, MAX_PRODUCTS - 1)
    .map(([name]) => name);

  return Object.keys(groupedProducts).length > MAX_PRODUCTS - 1 ? topProducts.concat("Autres") : topProducts;
}

async function getUserOrders({ startDate, endDate }: { startDate: Date; endDate: Date }) {
  const users = await prismadb.user.findMany({
    where: {
      orders: {
        some: {
          dateOfShipping: {
            gte: startDate,
            lte: endDate,
          },
          deletedAt: null,
        },
      },
    },
    select: {
      orders: {
        where: { dateOfShipping: { gte: startDate, lte: endDate }, deletedAt: null },
        select: { orderItems: true },
      },
      name: true,
      company: true,
      email: true,
      id: true,
    },
  });
  return users;
}

export default ClientProducts;
