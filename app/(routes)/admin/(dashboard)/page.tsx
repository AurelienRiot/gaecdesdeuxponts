import { Skeleton } from "@/components/skeleton-ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import prismadb from "@/lib/prismadb";
import { CalendarSearch, CreditCardIcon, EuroIcon, Package, User } from "lucide-react";
import { Suspense } from "react";
import { Component } from "./_components/product-chart";
import { dateMonthYear } from "@/lib/date-utils";
import { UserChart } from "./_components/user-chart";

const DashboardPage = (context: { searchParams: { month: string | undefined; year: string | undefined } }) => {
  const month = Number(context.searchParams.month || new Date().getMonth());
  const year = Number(context.searchParams.year || new Date().getFullYear());
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading title="Résumé" description="Présentation " />
        <Separator />
        <div className="flex flex-wrap gap-4">
          <Card className="max-w-xs min-w-52 w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue Totaux</CardTitle>
              <EuroIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex gap-2 items-center ">
                <Suspense fallback={<Skeleton className="h-6 w-40 rounded-full" />}>
                  <TotalRevenue startDate={startDate} endDate={endDate} />
                  <EuroIcon className="size-6" />
                </Suspense>
              </div>
            </CardContent>
          </Card>
          <Card className="max-w-xs min-w-52 w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nomber de commandes</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <Suspense fallback={<Skeleton className="h-6 w-40 rounded-full" />}>
                  <OrderNumber startDate={startDate} endDate={endDate} />
                </Suspense>
              </div>
            </CardContent>
          </Card>
          <Card className="max-w-xs min-w-52 w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nombre de clients</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <Suspense fallback={<Skeleton className="h-6 w-40 rounded-full" />}>
                  <ClientNumber startDate={startDate} endDate={endDate} />
                </Suspense>
              </div>
            </CardContent>
          </Card>
          <Card className="max-w-xs min-w-52 w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Commandes en attente</CardTitle>
              <CalendarSearch className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <Suspense fallback={<Skeleton className="h-6 w-40 rounded-full" />}>
                  <PendingOrders />
                </Suspense>
              </div>
            </CardContent>
          </Card>
        </div>
        <ProductsType startDate={startDate} endDate={endDate} />
        <ClientCount startDate={startDate} endDate={endDate} />
        {/* <ToogleChose /> */}
      </div>
    </div>
  );
};

export default DashboardPage;

const TotalRevenue = async ({ startDate, endDate }: { startDate: Date; endDate: Date }) => {
  const total = await prismadb.order.findMany({
    where: {
      dateOfShipping: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      totalPrice: true,
    },
  });
  return total.reduce((acc, cur) => acc + cur.totalPrice, 0).toFixed(2);
};

const OrderNumber = async ({ startDate, endDate }: { startDate: Date; endDate: Date }) => {
  const total = await prismadb.order.count({
    where: {
      dateOfShipping: {
        gte: startDate,
        lte: endDate,
      },
    },
  });
  return total;
};

const ProductsType = async ({ startDate, endDate }: { startDate: Date; endDate: Date }) => {
  const orderItems = await prismadb.orderItem.findMany({
    where: {
      order: {
        dateOfShipping: {
          gte: startDate,
          lte: endDate,
        },
      },
    },
    select: {
      name: true,
      quantity: true,
    },
  });

  // Group order items by name and sum their positive and negative quantities
  const groupedItems = orderItems.reduce(
    (acc, item) => {
      if (!acc[item.name]) {
        acc[item.name] = { name: item.name, positiveQuantity: 0, negativeQuantity: 0 };
      }
      if (item.quantity > 0) {
        acc[item.name].positiveQuantity += item.quantity;
      } else {
        acc[item.name].negativeQuantity += item.quantity;
      }
      return acc;
    },
    {} as Record<string, { name: string; positiveQuantity: number; negativeQuantity: number }>,
  );

  const chartData = Object.values(groupedItems).flatMap((item) => {
    const data = [];
    if (item.positiveQuantity !== 0) {
      data.push({ name: item.name, quantity: item.positiveQuantity });
    }
    if (item.negativeQuantity !== 0) {
      data.push({ name: item.name, quantity: item.negativeQuantity });
    }
    return data;
  });

  return <Component chartData={chartData} monthYear={dateMonthYear(startDate)} />;
};

const ClientCount = async ({ startDate, endDate }: { startDate: Date; endDate: Date }) => {
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
      orders: { where: { dateOfShipping: { gte: startDate, lte: endDate } }, select: { totalPrice: true } },
      name: true,
      company: true,
      email: true,
    },
  });
  const usersWithTotalSpent = users.map((user) => ({
    name: user.company || user.name || user.email || "Anonyme",
    totalSpent: Number(user.orders.reduce((acc, order) => acc + order.totalPrice, 0).toFixed(2)),
  }));
  const topUsers = usersWithTotalSpent.sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 4);
  const otherTotalSpent = usersWithTotalSpent.slice(4).reduce((acc, user) => acc + user.totalSpent, 0);

  const finalUsers = otherTotalSpent ? [...topUsers, { name: "Autres", totalSpent: otherTotalSpent }] : topUsers;

  return <UserChart pieData={finalUsers} monthYear={dateMonthYear(startDate)} />;
};

const ClientNumber = async ({ startDate, endDate }: { startDate: Date; endDate: Date }) => {
  const users = await prismadb.user.count({
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
  });
  return users;
};

async function PendingOrders() {
  const orders = await prismadb.order.count({
    where: { dateOfEdition: { equals: null } },
  });
  return orders;
}
