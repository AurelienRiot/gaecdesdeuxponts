import { getPriceMinusConsigne, getTotalMilk } from "@/components/product";
import { Skeleton } from "@/components/skeleton-ui/skeleton";
import { getUserName } from "@/components/table-custom-fuction";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { dateMonthYear } from "@/lib/date-utils";
import prismadb from "@/lib/prismadb";
import { CalendarSearch, EuroIcon, Package, User } from "lucide-react";
import { Suspense } from "react";
import ClientProducts from "./_components/client-products/fetch-user";
import ProductsType from "./_components/product-type/product-fetch";
import SelectDate from "./_components/select-date";
import { ProductsPie } from "./_components/total-by-products";
import { UserChart } from "./_components/user-chart";
import { getTotalOrders } from "./_functions/get-total-orders";

const MAX_ClIENTS = 9;

export const dynamic = "force-dynamic";

const DashboardPage = async (context: {
  searchParams: Promise<{ month: string | undefined; year: string | undefined }>;
}) => {
  const searchParams = await context.searchParams;
  const month = Number(searchParams.month || new Date().getMonth() - 1);
  const year = Number(searchParams.year || new Date().getFullYear());
  const startCurrentMonth = new Date(year, month, 1);
  const endDateCurrentMonth = new Date(year, month + 1, 0);

  return (
    <div className="flex-coil">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading title={`Résumé de ${dateMonthYear([startCurrentMonth])}`} description="Présentation " />
        <Separator />
        <SelectDate month={month} year={year} />
        <div className="flex flex-wrap gap-4 justify-center">
          <Card className="max-w-xs min-w-52 w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue Totaux</CardTitle>
              <EuroIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex gap-2 items-center ">
                <Suspense fallback={<Skeleton className="h-6 w-40 rounded-full" />}>
                  <TotalRevenue startDate={startCurrentMonth} endDate={endDateCurrentMonth} />
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
                  <OrderNumber startDate={startCurrentMonth} endDate={endDateCurrentMonth} />
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
                  <ClientNumber startDate={startCurrentMonth} endDate={endDateCurrentMonth} />
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
        <div className="flex flex-wrap gap-4 justify-center">
          <ProductsType startDate={startCurrentMonth} endDate={endDateCurrentMonth} />
          <ProductTotal startDate={startCurrentMonth} endDate={endDateCurrentMonth} />
          <ClientCount startDate={startCurrentMonth} endDate={endDateCurrentMonth} />
          <ClientProducts startDate={startCurrentMonth} endDate={endDateCurrentMonth} />
        </div>
        {/* <ToogleChose /> */}
      </div>
    </div>
  );
};

export default DashboardPage;

const TotalRevenue = async ({ startDate, endDate }: { startDate: Date; endDate: Date }) => {
  const total = await getTotalOrders({ startDate, endDate });
  const totalItems = total.flatMap((order) => order.orderItems);
  const totalRevenue = total.length === 0 ? 0 : total.reduce((acc, cur) => acc + cur.totalPrice, 0).toFixed(2);
  const rawMilk = totalItems.filter((item) => item.name.toLowerCase().includes("lait cru"));
  const totalLiters = getTotalMilk(rawMilk);
  const priceMinusConsigne = getPriceMinusConsigne(rawMilk);

  return (
    <span>
      {totalRevenue} ({totalLiters} L)
      <br />
      {(priceMinusConsigne / totalLiters).toFixed(2)}€/L HT
    </span>
  );
};

const OrderNumber = async ({ startDate, endDate }: { startDate: Date; endDate: Date }) => {
  const total = (await getTotalOrders({ startDate, endDate })).reduce((acc, cur) => acc + 1, 0);
  return total;
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
          deletedAt: null,
        },
      },
    },
    select: {
      orders: {
        where: { dateOfShipping: { gte: startDate, lte: endDate }, deletedAt: null },
        select: { totalPrice: true, orderItems: true },
      },
      name: true,
      company: true,
      email: true,
    },
  });
  const usersWithTotalSpent = users
    .map((user) => {
      const totalItems = user.orders.flatMap((order) => order.orderItems);
      const rawMilk = totalItems.filter((item) => item.name.toLowerCase().includes("lait cru"));
      const priceMinusConsigne = getPriceMinusConsigne(rawMilk);
      return {
        name: getUserName(user),
        totalSpent: Number(priceMinusConsigne.toFixed(2)),
      };
    })
    .filter((user) => user.totalSpent !== 0)
    .sort((a, b) => b.totalSpent - a.totalSpent);
  // const topUsers = usersWithTotalSpent.sort((a, b) => b.totalSpent - a.totalSpent).slice(0, MAX_ClIENTS);
  // const otherTotalSpent = usersWithTotalSpent.slice(MAX_ClIENTS).reduce((acc, user) => acc + user.totalSpent, 0);

  // const finalUsers = otherTotalSpent
  //   ? [...topUsers, { name: "Autres", totalSpent: Number(otherTotalSpent.toFixed(2)) }]
  //   : topUsers;

  return <UserChart chartData={usersWithTotalSpent} monthYear={dateMonthYear([startDate])} />;
};

const ProductTotal = async ({ startDate, endDate }: { startDate: Date; endDate: Date }) => {
  const total = await getTotalOrders({ startDate, endDate });
  const totalItems = total.flatMap((order) => order.orderItems);
  const rawMilk = totalItems.filter((item) => item.name.toLowerCase().includes("lait cru"));

  const totalProducts = Object.entries(
    rawMilk.reduce(
      (acc, curr) => {
        if (acc[curr.name]) {
          acc[curr.name] = acc[curr.name] + curr.quantity;
        } else {
          acc[curr.name] = curr.quantity;
        }
        return acc;
      },
      {} as Record<string, number>,
    ),
  ).map(([name, total]) => ({ name, total }));
  // const topUsers = usersWithTotalSpent.sort((a, b) => b.totalSpent - a.totalSpent).slice(0, MAX_ClIENTS);
  // const otherTotalSpent = usersWithTotalSpent.slice(MAX_ClIENTS).reduce((acc, user) => acc + user.totalSpent, 0);

  // const finalUsers = otherTotalSpent
  //   ? [...topUsers, { name: "Autres", totalSpent: Number(otherTotalSpent.toFixed(2)) }]
  //   : topUsers;

  return <ProductsPie pieData={totalProducts} monthYear={dateMonthYear([startDate])} />;
  // return null;
};

const ClientNumber = async ({ startDate, endDate }: { startDate: Date; endDate: Date }) => {
  const orders = await getTotalOrders({ startDate, endDate });
  const userIds = new Set(orders.map((order) => order.user.id));
  return userIds.size;
};

async function PendingOrders() {
  const orders = await prismadb.order.count({
    where: { dateOfEdition: { equals: null } },
  });
  return orders === 0 ? <span>0</span> : <span className="text-destructive">{orders}</span>;
}
