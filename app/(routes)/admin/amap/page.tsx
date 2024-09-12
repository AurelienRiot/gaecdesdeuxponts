import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import prismadb from "@/lib/prismadb";
import { Plus } from "lucide-react";
import Link from "next/link";
import type { DateRange } from "react-day-picker";
import { AMAPClient } from "./_components/client";
import type { AMAPColumn } from "./_components/columns";
import { createProduct, createProductList } from "@/components/table-custom-fuction/cell-orders";
import { dateFormatter, getDaysInFuture, getNextDay } from "@/lib/date-utils";
import NoResults from "@/components/ui/no-results";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const dynamic = "force-dynamic";

async function AMAPPage(context: {
  searchParams: { from: string | undefined; to: string | undefined; id: string | undefined };
}) {
  const id = context.searchParams.id;

  let from: Date;
  let to: Date;
  if (context.searchParams.from && context.searchParams.to) {
    from = new Date(context.searchParams.from);
    to = new Date(context.searchParams.to);
  } else {
    from = new Date(new Date().getTime() - 6 * 30 * 24 * 60 * 60 * 1000);
    to = new Date(new Date().getTime() + 2 * 30 * 24 * 60 * 60 * 1000);
  }

  const dateRange: DateRange = {
    from: from,
    to: to,
  };

  const amapOrders = await prismadb.aMAPOrder.findMany({
    where: !id
      ? {
          startDate: {
            gte: dateRange.from,
            lte: dateRange.to,
          },
        }
      : {
          id: {
            contains: id,
          },
        },
    orderBy: { createdAt: "desc" },
    include: { user: true, amapItems: true, shop: true },
  });

  const formattedOrders: AMAPColumn[] = amapOrders.map((order) => ({
    id: order.id,
    userId: order.user.id,
    name: order.user.company || order.user.name || order.user.email || "",
    shopName: order.shop.name,
    shopId: order.shop.id,
    totalPrice: order.totalPrice,
    totalPaid: order.totalPaid,
    startDate: order.startDate,
    endDate: order.endDate,
    shippingDays: order.shippingDays,
    dateOfEdition: order.dateOfEdition,
    productsList: createProductList(order.amapItems),
    products: createProduct(order.amapItems),
  }));

  return (
    <div className="space-y-4 p-8 pt-6">
      <div className="flex flex-col items-center justify-between sm:flex-row">
        <Heading title={`Contrat AMAP (${amapOrders.length})`} description="Liste des différents contrats AMAP" />
        {/* <Button asChild className="m-2 pb-6 pt-6 sm:ml-2 sm:pb-0 sm:pt-0">
            <Link href={`/admin/amap/formulaire`}>
              <Plus className="mr-2  h-4 w-4" />
              Créer un formulaire
            </Link>
          </Button> */}
        <Button asChild className="m-2 pb-6 pt-6 sm:ml-2 sm:pb-0 sm:pt-0">
          <Link href={`/admin/amap/new`}>
            <Plus className="mr-2  h-4 w-4" />
            Créer un contrat
          </Link>
        </Button>
      </div>

      <Separator />
      <AMAPClient initialData={formattedOrders} initialDateRange={dateRange} />
      <Separator />
      <NextShipping formattedOrders={formattedOrders} />
    </div>
  );
}

export default AMAPPage;

function NextShipping({ formattedOrders }: { formattedOrders: AMAPColumn[] }) {
  const ordersWithNextShipping = formattedOrders.map((order) => ({
    id: order.id,
    userId: order.userId,
    name: order.name,
    shopName: order.shopName,
    productsList: order.productsList,
    nextShippingDay: getNextDay(getDaysInFuture(order.shippingDays)),
  }));

  const smallestNextShippingDay = ordersWithNextShipping
    .map((order) => order.nextShippingDay)
    .filter((day): day is Date => day !== null && day !== undefined) // Type guard to filter out non-Date values
    .reduce<Date | null>((min, current) => {
      return min === null || (current && current < min) ? current : min;
    }, null);

  if (!smallestNextShippingDay) {
    return <NoResults />;
  }

  const ordersForNextShipping = ordersWithNextShipping.filter(
    (order) => order.nextShippingDay && order.nextShippingDay.getTime() === smallestNextShippingDay.getTime(),
  );

  return (
    <>
      <Heading
        title={`Commande pour la prochaine livraison`}
        description={`Prochaine livraison le ${dateFormatter(smallestNextShippingDay, { days: true })}`}
      />
      <div className="flex flex-wrap justify-center  gap-4">
        {ordersForNextShipping.map((order) => (
          <AmapCards
            id={order.id}
            name={order.name}
            productsList={order.productsList}
            userId={order.userId}
            key={order.id}
          />
        ))}
      </div>
    </>
  );
}

function AmapCards({
  id,
  name,
  productsList,
  userId,
}: { name: string; userId: string; productsList: { name: string; quantity?: string; unit?: string }[]; id: string }) {
  return (
    <Card className="w-full max-w-sm ">
      <CardHeader className="flex  items-center justify-start py-2 px-4 cursor-pointer">
        <Link href={`/admin/users/${userId}`} className="flex items-center gap-2 ">
          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-600 font-semibold text-xs">{name.charAt(0)}</span>
          </div>
          <span className="font-medium text-xs truncate">{name}</span>
        </Link>

        <Link href={`/admin/orders/${id}`}></Link>
      </CardHeader>
      <CardContent>
        <div>
          <h4 className="text-xs font-semibold">Produits :</h4>
          <ul className="text-xs space-y-0.5">
            {productsList.map((product, index) => (
              <li key={index} className="flex justify-between">
                <span>
                  {product.name} ({product.unit ? `${product.quantity}${product.unit}` : `x${product.quantity}`})
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
