import { dateMonthYear } from "@/lib/date-utils";
import { UserProducts } from "./user-products";
import prismadb from "@/lib/prismadb";

const ClientProducts = async ({ startDate, endDate }: { startDate: Date; endDate: Date }) => {
  const users = await getUserOrders({ startDate, endDate });

  const topProducts = getTopProducts(users);

  const userProductQuantities = users.map((user) => {
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
    return { name: user.company || user.name || user.email || "Anonyme", productQuantities: rest, total };
  });

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
    .slice(0, 3)
    .map(([name]) => name);

  return Object.keys(groupedProducts).length > 3 ? topProducts.concat("Autres") : topProducts;
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
        },
      },
    },
    select: {
      orders: { where: { dateOfShipping: { gte: startDate, lte: endDate } }, select: { orderItems: true } },
      name: true,
      company: true,
      email: true,
    },
  });
  return users;
}

export default ClientProducts;
